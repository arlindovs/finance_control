# Guia do Usuário - App de Controle Financeiro

Bem-vindo ao seu novo aplicativo de controle financeiro! Este guia rápido irá ajudá-lo a começar.

## 1. Primeiro Acesso e Autenticação

Para usar o aplicativo, você precisa se conectar com sua conta Google. Isso é necessário para garantir que seus dados financeiros sejam salvos de forma segura e privada no seu próprio Google Drive.

- **Na primeira vez que você abrir o aplicativo**, clique no botão **"Login com Google"**.
- Uma janela de login do Google aparecerá. Escolha a conta que deseja usar.
- Você precisará conceder permissão para que o aplicativo acesse seu email (para identificação) e crie um arquivo em uma pasta especial de aplicativos no seu Google Drive (para armazenar seus dados).

Após a autenticação, você será levado ao seu painel financeiro.

## 2. O Painel Financeiro

O painel é a sua visão geral do mês atual. Ele é dividido em várias seções:

- **Resumo do Mês:** No topo, você verá cartões com o total de suas **Receitas**, **Despesas** e o **Saldo** do mês.
- **Movimentações do Mês:** Uma lista de todas as receitas e despesas que você registrou no mês atual.
- **Fatura do Cartão:** O valor total de todas as compras feitas no cartão de crédito que serão cobradas na fatura deste mês.
- **Agendamentos Pendentes:** Uma lista de transações recorrentes que estão aguardando para serem confirmadas.

## 3. Adicionando uma Nova Transação

Para adicionar uma nova receita ou despesa:

1.  Use o formulário **"Adicionar Transação"**.
2.  **Descrição:** Dê um nome para a transação (ex: "Almoço", "Salário").
3.  **Valor:** Insira o valor da transação.
4.  **Data:** Escolha a data em que a transação ocorreu.
5.  **Tipo:** Selecione se é uma "Receita" ou "Despesa".
6.  **Opções:**
    - **É no cartão de crédito?** Marque esta caixa se for uma compra no cartão. A despesa será lançada na fatura do mês seguinte.
    - **É uma transação recorrente?** Marque esta caixa se for uma despesa ou receita que se repete (ex: aluguel, assinatura de streaming). Ela aparecerá nos "Agendamentos Pendentes" até ser confirmada.
7.  Clique em **"Adicionar"**. A transação aparecerá imediatamente na sua lista.

## 4. Gerenciando Transações

- **Excluir uma transação:** Clique no ícone de "X" ao lado de uma transação na lista de movimentações para removê-la.
- **Confirmar um agendamento:** Na seção "Agendamentos Pendentes", clique no botão **"Executar"** ao lado de uma transação para confirmá-la. Ela será movida para as movimentações do mês.

## 5. Seus Dados

Seus dados são salvos em um arquivo chamado `financeiro.sqlite` em uma pasta de aplicativos oculta no seu Google Drive. Isso significa que só você e este aplicativo têm acesso a ele, e você pode acessar suas finanças de qualquer dispositivo onde fizer login.
