# site_pizzattolog_backend

Backend do site institucional da Pizzattolog criado com NestJS e TypeScript.

## Como executar

```bash
npm install
npm run start:dev
```

Acesse:

- Verificação da API: http://localhost:3001/api/health
- Dados iniciais do site: http://localhost:3001/api/site

## Rotas do painel admin

Crie o primeiro usuário admin apenas uma vez:

```http
POST /api/admin/autenticacao/primeiro-acesso
```

Faça login e use o `token` retornado como `Authorization: Bearer <token>` nas
rotas protegidas:

Em produção, configure `ADMIN_JWT_SECRET` no ambiente antes de iniciar a API.

```http
POST /api/admin/autenticacao/login
GET /api/admin/autenticacao/me
```

Perfil `MARKETING` pode alterar textos e imagens simples:

```http
GET /api/admin/marketing/conteudos
GET /api/admin/marketing/conteudos/:chave
PATCH /api/admin/marketing/conteudos/:chave
GET /api/admin/marketing/hero
PATCH /api/admin/marketing/hero/:id
```

Perfil `ADMIN` pode fazer tudo, incluindo usuários, rotas/páginas e auditoria:

```http
GET /api/admin/usuarios
POST /api/admin/usuarios
PATCH /api/admin/usuarios/:id
GET /api/admin/rotas
POST /api/admin/rotas
PATCH /api/admin/rotas/:id
DELETE /api/admin/rotas/:id
GET /api/admin/auditoria
```

As rotas públicas de criação existentes (`POST /api/hero`, `POST /api/menus`,
`POST /api/paginas`, `POST /api/rodape`, `POST /api/solucoes` e
`POST /api/subpaginas`) também exigem perfil `ADMIN` e gravam log de auditoria.
