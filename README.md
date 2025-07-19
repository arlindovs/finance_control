# Web App de Controle Financeiro

Este é um web app de controle financeiro simples, moderno e responsivo, construído com React, Node.js e SQLite, com integração com o Google para autenticação e armazenamento de dados no Google Drive.

## Stack de Tecnologia

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Banco de Dados:** SQLite
- **Autenticação:** Google OAuth 2.0
- **Armazenamento:** Google Drive API

## Funcionalidades

- Controle financeiro mensal (receitas e despesas)
- Suporte a despesas no cartão de crédito com lançamento na fatura do mês seguinte
- Transações agendadas/recorrentes
- Relatório mensal consolidado
- Autenticação segura com conta Google
- Sincronização automática do banco de dados com o Google Drive do usuário

## Configuração do Ambiente

**Pré-requisitos:**
- Node.js (versão 20.x ou superior)
- npm (versão 10.x ou superior)
- Uma conta Google e credenciais da API do Google Cloud

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd <nome-do-repositorio>
    ```

2.  **Configure as Credenciais do Google:**
    - Acesse o [Google Cloud Console](https://console.cloud.google.com/).
    - Crie um novo projeto.
    - Ative as APIs "Google Drive API" e "Google People API".
    - Vá para "Tela de consentimento OAuth", configure-a para "Usuários externos" e adicione os escopos necessários (`.../auth/userinfo.email`, `.../auth/drive.file`). Adicione seu email como usuário de teste.
    - Vá para "Credenciais", crie uma "ID do cliente OAuth", selecione "Aplicativo da Web".
    - Em "URIs de redirecionamento autorizados", adicione `http://localhost:3000/auth/google/callback`.
    - Copie o `Client ID` e o `Client Secret`.

3.  **Configure o Backend:**
    - Navegue até a pasta `backend`: `cd backend`
    - Renomeie o arquivo `.env.example` para `.env` (se existir) ou crie um novo.
    - Adicione suas credenciais do Google no arquivo `backend/src/index.ts`, substituindo os placeholders:
      ```typescript
      const oauth2Client = new google.auth.OAuth2(
        'SEU_CLIENT_ID',
        'SEU_CLIENT_SECRET',
        'http://localhost:3000/auth/google/callback'
      );
      ```
    - Instale as dependências:
      ```bash
      npm install
      ```

4.  **Configure o Frontend:**
    - Navegue até a pasta `frontend`: `cd ../frontend`
    - Instale as dependências:
      ```bash
      npm install
      ```

## Executando a Aplicação

1.  **Inicie o Backend:**
    - Na pasta `backend`, execute:
      ```bash
      npm run start
      ```
    - O servidor backend estará rodando em `http://localhost:3000`.

2.  **Inicie o Frontend:**
    - Em um novo terminal, na pasta `frontend`, execute:
      ```bash
      npm run dev
      ```
    - A aplicação estará acessível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

3.  **Acesse a aplicação** no seu navegador e faça o login com a conta Google que você configurou como testadora.

## Deploy

Para o deploy em produção, você precisará:
- Configurar as variáveis de ambiente no seu servidor de hospedagem.
- Construir os arquivos estáticos do frontend com `npm run build` na pasta `frontend`.
- Servir esses arquivos estáticos através do seu servidor Node.js ou de um serviço de hospedagem de sites estáticos.
- Garantir que o URI de redirecionamento do Google OAuth corresponda ao seu domínio de produção.
