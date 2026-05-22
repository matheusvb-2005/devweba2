# OrganizaUno - Descrição do projeto (A2)

## Nome do sistema
OrganizaUno

## Tema 
Gestor de tarefas (segui para o âmbito pessoal, já que não estava especificado)

## Objetivo do sistema
Permitir que usuários cadastrem tarefas, as organizem e acompanhem suas pendências/rotina(s) diárias
por meio de categorias, prioridades e status, tudo via web.

## Descrição geral
O usuário se cadastra, faz login. Após autenticado, acessa o painel onde
visualiza um resumo das suas tarefas. Pode criar categorias para organizar o
trabalho (por especificidade, pessoal, profissional, etc) e adicionar tarefas com título, descrição, prioridade (baixa, média ou alta), prazo máximo (vencimento) e status (pendente, em andamento ou concluída). Cada
usuário tem acesso apenas aos seus próprios dados e rotas privadas são protegidas por sessão.

## Público-alvo
Qualquer pessoa, sinceramente. O projeto atinge todo o público que considera organização de suas tarefas como algo necessário.

## Funcionalidades principais
- Cadastro e login de usuários com senha criptografada (bcrypt)
- Dashboard com resumo de tarefas por status
- CRUD completo de tarefas 
- CRUD completo de categorias
- Filtro de tarefas por status, prioridade e categoria
- Proteção de rotas privadas via sessão (express-session)
- Página de erro amigável para situações de 403, 404 e 500
