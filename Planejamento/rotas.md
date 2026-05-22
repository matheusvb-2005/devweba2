# OrganizaUno - Definição de rotas

## Rotas públicas (sem autenticação)

| Método | Caminho | Controller | Finalidade |
|--------|---------|------------|------------|
| GET | `/` | - | Redireciona para `/dashboard` (logado) ou `/login` (não logado) |
| GET | `/login` | `authController.showLogin` | Exibe o formulário de login |
| POST | `/login` | `authController.login` | Processa credenciais, inicia sessão e redireciona para `/dashboard` |
| GET | `/register` | `authController.showRegister` | Exibe o formulário de cadastro |
| POST | `/register` | `authController.register` | Cria nova conta, redireciona para `/login` |
| POST | `/logout` | `authController.logout` | Destrói a sessão, redireciona para `/login` |

## Rotas privadas (requerem sessão ativa - protegidas por `authMiddleware`)

### Dashboard
| Método | Caminho | Controller | Finalidade |
|--------|---------|------------|------------|
| GET | `/dashboard` | `taskController.dashboard` | Painel com contagem de tarefas por status e lista de urgentes |

### Tarefas
| Método | Caminho | Controller | Finalidade |
|--------|---------|------------|------------|
| GET | `/tasks` | `taskController.list` | Lista todas as tarefas do usuário com filtros opcionais |
| GET | `/tasks/new` | `taskController.showCreate` | Exibe formulário para criar nova tarefa |
| POST | `/tasks` | `taskController.create` | Salva nova tarefa no banco |
| GET | `/tasks/:id/edit` | `taskController.showEdit` | Exibe formulário preenchido para editar tarefa |
| POST | `/tasks/:id` | `taskController.update` | Atualiza os dados da tarefa |
| POST | `/tasks/:id/delete` | `taskController.delete` | Remove a tarefa do banco |

### Categorias
| Método | Caminho | Controller | Finalidade |
|--------|---------|------------|------------|
| GET | `/categories` | `categoryController.list` | Lista todas as categorias do usuário |
| POST | `/categories` | `categoryController.create` | Cria nova categoria |
| POST | `/categories/:id` | `categoryController.update` | Atualiza nome ou cor da categoria |
| POST | `/categories/:id/delete` | `categoryController.delete` | Remove a categoria |

## Proteção de rotas
Todas as rotas privadas são agrupadas sob o middleware `authMiddleware`, que
verifica a existência de `req.session.userId`. Se a sessão estiver ausente,
o usuário é redirecionado automaticamente para `/login`.


