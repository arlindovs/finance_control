import express from 'express';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3000;
const DB_FILE_NAME = 'financeiro.sqlite';
const DB_FILE_PATH = path.join(__dirname, DB_FILE_NAME);

// Substitua com suas credenciais do Google Cloud
const oauth2Client = new google.auth.OAuth2(
  'SEU_CLIENT_ID',
  'SEU_CLIENT_SECRET',
  'http://localhost:3000/auth/google/callback'
);

async function setupDatabase(auth: any) {
  const drive = google.drive({ version: 'v3', auth });

  // 1. Procurar pelo arquivo no Google Drive
  const res = await drive.files.list({
    q: `name='${DB_FILE_NAME}' and 'appDataFolder' in parents`,
    spaces: 'appDataFolder',
    fields: 'files(id, name)',
  });

  const files = res.data.files;
  if (files && files.length > 0) {
    // 2. Se encontrar, fazer o download
    console.log('Banco de dados encontrado, fazendo download...');
    const fileId = files[0].id!;
    const dest = fs.createWriteStream(DB_FILE_PATH);
    await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    ).then(res => {
      return new Promise((resolve, reject) => {
        res.data
          .on('end', () => resolve(DB_FILE_PATH))
          .on('error', err => reject(err))
          .pipe(dest);
      });
    });
    console.log('Download concluído.');
  } else {
    // 3. Se não encontrar, criar um novo banco e fazer upload
    console.log('Nenhum banco de dados encontrado, criando um novo...');
    const db = new sqlite3.Database(DB_FILE_PATH, async (err) => {
      if (err) {
        throw err;
      }
      // Aqui rodaríamos as migrações para criar o schema inicial
      console.log('Banco de dados local criado.');

      const fileMetadata = {
        name: DB_FILE_NAME,
        parents: ['appDataFolder']
      };
      const media = {
        mimeType: 'application/x-sqlite3',
        body: fs.createReadStream(DB_FILE_PATH)
      };

      await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id'
      });
      console.log('Upload do novo banco de dados concluído.');
    });
    db.close();
  }

  // Roda as migrações
  await runMigrations();
}

async function runMigrations() {
  const db = new sqlite3.Database(DB_FILE_PATH);
  console.log('Rodando migrações...');

  const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations')).sort();

  for (const file of migrationFiles) {
    // Aqui precisaríamos de um mecanismo para controlar quais migrações já foram executadas.
    // Por simplicidade, vamos apenas executar todas por enquanto.
    console.log(`Aplicando migração: ${file}`);
    const sql = fs.readFileSync(path.join(__dirname, 'migrations', file), 'utf8');
    db.exec(sql, (err) => {
      if (err) {
        console.error(`Erro ao rodar migração ${file}`, err);
        throw err;
      }
    });
  }

  db.close();
  console.log('Migrações concluídas.');
}

app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/drive.file'
    ],
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Configura o banco de dados após a autenticação
    await setupDatabase(oauth2Client);

    res.send('Autenticado e banco de dados configurado com sucesso!');
  } catch (error) {
    console.error('Erro durante o callback de autenticação', error);
    res.status(500).send('Falha na autenticação ou configuração do banco de dados');
  }
});

app.use(express.json());

// Rotas da API
app.get('/api/relatorio-mensal', (req, res) => {
  const mes = (req.query.mes as string) || new Date().toISOString().slice(0, 7);
  const db = new sqlite3.Database(DB_FILE_PATH);

  const relatorio = {
    movimentacoes: [],
    faturaCartao: { total: 0, paga: false }, // Simplificação
    agendadas: [],
    despesasPorCategoria: [],
  };

  db.serialize(() => {
    // Movimentações do mês (não-cartão)
    db.all(
      "SELECT * FROM transacoes WHERE strftime('%Y-%m', data) = ? AND fatura_cartao = 0",
      [mes],
      (err, rows) => {
        if (err) throw err;
        relatorio.movimentacoes = rows as any;
      }
    );

    // Fatura do cartão do mês
    db.get(
      "SELECT SUM(valor) as total FROM transacoes WHERE strftime('%Y-%m', data_fatura) = ?",
      [mes],
      (err, row: any) => {
        if (err) throw err;
        relatorio.faturaCartao.total = row.total || 0;
      }
    );

    // Transações agendadas (pendentes)
    db.all(
      "SELECT * FROM transacoes WHERE recorrente = 1 AND executada = 0",
      [],
      (err, rows) => {
        if (err) throw err;
        relatorio.agendadas = rows as any;
      }
    );

    // Despesas por categoria
    db.all(
      `SELECT c.nome, SUM(t.valor) as total
       FROM transacoes t
       JOIN categorias c ON t.categoria_id = c.id
       WHERE t.tipo = 'despesa' AND (strftime('%Y-%m', t.data) = ? OR strftime('%Y-%m', t.data_fatura) = ?)
       GROUP BY c.nome`,
      [mes, mes],
      (err, rows) => {
        if (err) throw err;
        relatorio.despesasPorCategoria = rows as any;
      }
    );
  });

  db.close((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(relatorio);
  });
});

app.post('/api/transacoes', (req, res) => {
  const { descricao, valor, data, tipo, categoria_id, fatura_cartao, recorrente } = req.body;

  let data_fatura = null;
  if (fatura_cartao) {
    const dataCompra = new Date(data);
    dataCompra.setMonth(dataCompra.getMonth() + 1);
    data_fatura = dataCompra.toISOString().slice(0, 10);
  }

  const db = new sqlite3.Database(DB_FILE_PATH);
  db.run(
    'INSERT INTO transacoes (descricao, valor, data, tipo, categoria_id, fatura_cartao, data_fatura, recorrente, executada) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [descricao, valor, data, tipo, categoria_id, !!fatura_cartao, data_fatura, !!recorrente, !recorrente],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
  db.close();
});

app.put('/api/transacoes/:id', (req, res) => {
  const { descricao, valor, data, tipo, categoria_id } = req.body;
  const db = new sqlite3.Database(DB_FILE_PATH);
  db.run(
    'UPDATE transacoes SET descricao = ?, valor = ?, data = ?, tipo = ?, categoria_id = ? WHERE id = ?',
    [descricao, valor, data, tipo, categoria_id, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    }
  );
  db.close();
});

app.post('/api/transacoes/:id/executar', (req, res) => {
  const db = new sqlite3.Database(DB_FILE_PATH);
  db.run(
    'UPDATE transacoes SET executada = 1 WHERE id = ?',
    [req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    }
  );
  db.close();
});

app.delete('/api/transacoes/:id', (req, res) => {
  const db = new sqlite3.Database(DB_FILE_PATH);
  db.run('DELETE FROM transacoes WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
  db.close();
});

app.get('/', (req, res) => {
  res.send('Hello World! <a href="/auth/google">Login com Google</a>');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
