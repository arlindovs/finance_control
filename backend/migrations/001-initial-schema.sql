CREATE TABLE categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE transacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  descricao TEXT NOT NULL,
  valor REAL NOT NULL,
  data DATE NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
  categoria_id INTEGER,
  fatura_cartao BOOLEAN DEFAULT 0,
  executada BOOLEAN DEFAULT 1,
  FOREIGN KEY (categoria_id) REFERENCES categorias (id)
);

-- Inserindo algumas categorias padrão
INSERT INTO categorias (nome) VALUES ('Alimentação'), ('Transporte'), ('Salário'), ('Lazer'), ('Outros');
