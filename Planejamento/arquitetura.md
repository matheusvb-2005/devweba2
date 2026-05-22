# OrganizaUno - Planejamento 

## Stack tecnológico

| Camada | Tecnologia |
|--------|------------|
| Runtime | Node.js (v18+) |
| Framework HTTP | Express |
| Template engine | EJS (renderização server-side) |
| Banco de dados | SQLite via `better-sqlite3` (síncrono, sem servidor) |
| Sessão | `express-session` (cookie de sessão) |
| Senha | `bcrypt` (hash com salt) |
| Frontend | HTML5, CSS puro, JavaScript vanilla |

## Estrutura de pastas

```
devweba2/
|-- src/
|   |-- app.js                    # configuração do Express (middlewares, rotas, view engine)
|   |-- server.js                 # inicialização do servidor (listen)
|   |-- config/
|   |   `-- database.js           # conexão SQLite, criação das tabelas
|   |-- controllers/
|   |   |-- authController.js     # login, cadastro, logout
|   |   |-- taskController.js     # CRUD de tarefas + dashboard
|   |   `-- categoryController.js # CRUD de categorias
|   |-- services/
|   |   |-- authService.js        # hash de senha, verificação de credenciais
|   |   |-- taskService.js        # regras de negócio de tarefas
|   |   `-- categoryService.js    # regras de negócio de categorias
|   |-- repositories/
|   |   |-- userRepository.js     # queries SQL para usuários
|   |   |-- taskRepository.js     # queries SQL para tarefas
|   |   `-- categoryRepository.js # queries SQL para categorias
|   |-- middlewares/
|   |   |-- authMiddleware.js     # redireciona para /login se sessão ausente
|   |   `-- errorMiddleware.js    # handler global de erros (404/500)
|   |-- routes/
|   |   |-- index.js              # agrega e exporta todas as rotas
|   |   |-- authRoutes.js
|   |   |-- taskRoutes.js
|   |   `-- categoryRoutes.js
|   |-- views/                    # templates EJS renderizados pelo servidor
|   |   |-- partials/
|   |   |   |-- header.ejs        # <head> + links de CSS
|   |   |   `-- navbar.ejs        # barra de navegação superior
|   |   |-- auth/
|   |   |   |-- login.ejs
|   |   |   `-- register.ejs
|   |   |-- tasks/
|   |   |   |-- list.ejs          # listagem com filtros
|   |   |   `-- form.ejs          # formulário criar/editar
|   |   |-- categories/
|   |   |   `-- index.ejs         # listagem + form inline
|   |   |-- dashboard.ejs
|   |   `-- error.ejs
|   `-- public/
|       |-- css/
|       |   `-- style.css
|       `-- js/
|           `-- main.js
|-- data/
|   `-- organizauno.db            
`-- package.json
```

## Resp. por camada

I Camada I Responsabilidade I
I--------I-----------------I
I **Controller** I Recebe a requisição HTTP, extrai dados do `req.body` e `req.params`, valida campos obrigatórios presentes, chama o Service e devolve a resposta (`res.redirect` ou `res.render`) I
I **Service** I Contém a lógica de negócio: regras de validação de domínio, criptografia de senha com bcrypt, verificação de posse do recurso (o usuário owna a tarefa?), conversão de dados I
I **Repository** I Acesso ao banco pelo `better-sqlite3`. Cada método executa exatamente uma query SQL e retorna os dados brutos I
I **Middleware** I `authMiddleware` verifica `req.session.userId`; se ausente, redireciona para `/login`. `errorMiddleware` captura erros não tratados e renderiza `error.ejs` com o código de status adequado |

### fluxo de uma requisiçãi

```
Cliente (navegador)
    |
    v  HTTP
Router (Express)
    |
    v
Middleware (authMiddleware, se rota privada)
    |
    v
Controller (extrai dados, valida presença)
    |
    v
Service (regras de negócio, hash, autorização)
    |
    v
Repository (SQL via better-sqlite3)
    |
    v
SQLite (data/organizauno.db)
```

A resposta volta pelo caminho inverso até o cliente como render EJS ou redirect.

## Organização das routes

Cada conjunto de rotas é definido em um arquivo dedicado dentro de `src/routes/`
e agregado em `src/routes/index.js`, que é montado em `app.js` via `app.use('/', routes)`.

| Arquivo | Prefixo | Protegido? | Contém |
|---------|---------|-----------|--------|
| `authRoutes.js` | - | Não | `/login`, `/register`, `/logout` |
| `taskRoutes.js` | `/tasks` | Sim (authMiddleware) | CRUD de tarefas + `/dashboard` |
| `categoryRoutes.js` | `/categories` | Sim (authMiddleware) | CRUD de categorias |

> A lista completa de rotas (método HTTP, caminho, controller e finalidade) está em [`rotas.md`](./rotas.md).

## Entidades do sistema

### User
| Campo | Tipo | Restrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| name | TEXT | NOT NULL |
| email | TEXT | UNIQUE, NOT NULL |
| password | TEXT | NOT NULL (hash bcrypt) |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP |

### Category
| Campo | Tipo | Restrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| name | TEXT | NOT NULL |
| color | TEXT | DEFAULT '#6c757d' |
| user_id | INTEGER | FK > users.id ON DELETE CASCADE |

### Task
| Campo | Tipo | Restrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| title | TEXT | NOT NULL |
| description | TEXT | - |
| status | TEXT | 'pendente' / 'em andamento' / 'concluída' |
| priority | TEXT | 'baixa' / 'média' / 'alta' |
| due_date | TEXT | formato ISO (YYYY-MM-DD) |
| category_id | INTEGER | FK > categories.id (nullable) |
| user_id | INTEGER | FK > users.id ON DELETE CASCADE |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP |

## Relacionamento entre entidades

```
User (1) ----< Category (N)
User (1) ----< Task (N)
Category (1) ----< Task (N)   [associação opcional]
```

Um usuário possui muitas categorias e muitas tarefas. Uma tarefa pertence a um
usuário e opcionalmente a uma categoria. Ao excluir um usuário, todas as suas
tarefas e categorias são removidas em cascata (on delete casdade)
