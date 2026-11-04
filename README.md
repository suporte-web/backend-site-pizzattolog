# Site Pizzattolog — Backend

API do site institucional da Pizzattolog, desenvolvida com NestJS, TypeScript, Prisma e PostgreSQL.

## Executar

Use Node.js 22.12 ou superior e um banco PostgreSQL. Na pasta do backend:

```bash
npm install
```

Copie `.env.example` para `.env` e configure `DATABASE_URL`, `FRONTEND_URL` e as variáveis do painel administrativo. O exemplo considera o frontend local na porta 3002. Depois:

```bash
npm run prisma:generate
npm run start:dev
```

O banco deve ter as migrations deste projeto aplicadas. Para um ambiente que você deseja atualizar, execute `npx prisma migrate deploy` com a conexão correspondente configurada.

- Verificação da API: http://localhost:3001/api/health
- Dados iniciais do site: http://localhost:3001/api/site

Para produção:

```bash
npm run build
npm run start:prod
```

O build gera o cliente Prisma automaticamente e produz `dist/main.js`, junto com os arquivos necessários ao cliente. Configure `ADMIN_JWT_SECRET` no ambiente de produção.

## Estrutura

```text
src/
  main.ts                    Inicialização, CORS, prefixo /api e validação
  app.module.ts              Composição dos módulos da aplicação
  database/                  Módulo global e serviço de acesso ao Prisma
  generated/prisma/          Cliente gerado; não editar nem versionar
  modules/
    health/                  Verificação de disponibilidade da API
    admin/                   Autenticação, permissões, edição e auditoria
      controllers/           Endpoints administrativos
      decorators/            Perfil e usuário autenticado
      dto/                   Validação das entradas
      guards/                Controle de autenticação e acesso
      services/              Regras do painel administrativo
      types/                 Tipos do usuário autenticado
    site/                    Dados agregados para o site
    hero/                    Banner inicial
    menus/                   Navegação e itens de menu
      data/                  Menus padrão de fallback
    paginas/                 Páginas institucionais
    rodape/                  Rodapé, seções e links
    solucoes/                Soluções logísticas
    subpaginas/              Subpáginas e âncoras
      data/                  Subpáginas padrão de fallback
prisma/
  schema.prisma              Gerador do cliente e provedor do banco
  models/                    Modelos agrupados por domínio
  migrations/                Histórico de alterações do banco
prisma.config.ts             Configuração da CLI do Prisma
tests/                      Verificação do artefato de produção
docs/                       Registro da organização do backend
```

## Convenções

- Cada funcionalidade fica em `src/modules/<funcionalidade>`, com seu módulo, controller, service e DTOs.
- Módulos pequenos mantêm controller e service junto ao módulo. O admin usa subpastas porque contém várias responsabilidades.
- Infraestrutura de banco fica em `src/database`; os modelos e as migrations permanecem em `prisma`.
- Dados padrão ficam em `data` dentro de sua funcionalidade e também podem ser consumidos pelo agregador `site`.
- Use imports relativos: o projeto não depende de aliases para resolver módulos em produção.
- Não remova rotas ou modelos apenas pela ausência de chamadas no frontend: a API pode atender outros clientes.
- Não edite o cliente gerado nem apague migrations já aplicadas. `dist` e `node_modules` são artefatos locais ignorados pelo Git.
- As pastas de skills são ferramentas de desenvolvimento e não entram no build da aplicação.

## Verificação

```bash
npm run prisma:validate
npm run typecheck
npm test
```

O TypeScript detecta imports, variáveis e parâmetros sem uso. `npm test` executa um build novo e verifica se o caminho de produção existe e se o grafo real dos módulos carrega, incluindo o cliente Prisma. Essas verificações não conectam ao banco nem alteram dados; não substituem testes das consultas em um PostgreSQL disponível.

## Rotas do painel admin

Crie o primeiro usuário admin apenas uma vez:

```http
POST /api/admin/autenticacao/primeiro-acesso
```

Faça login e use o `token` retornado como `Authorization: Bearer <token>` nas rotas protegidas:

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

As rotas de criação `POST /api/hero`, `POST /api/menus`, `POST /api/paginas`, `POST /api/rodape`, `POST /api/solucoes` e `POST /api/subpaginas` também exigem perfil `ADMIN` e gravam log de auditoria.
