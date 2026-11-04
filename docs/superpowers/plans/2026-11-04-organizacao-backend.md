# Organização do backend

**Objetivo:** organizar responsabilidades e remover código comprovadamente sem uso, preservando rotas, autenticação, conteúdo padrão e migrations.

**Estrutura:** manter funcionalidades em `src/modules`, mover a integração com o banco para `src/database`, isolar saúde em `modules/health` e colocar conteúdo padrão em `data` na funcionalidade correspondente. Manter o cliente gerado em `src/generated/prisma`.

**Abordagem:** reorganização pontual seguindo os módulos NestJS existentes. Uma divisão global entre controllers e services separaria arquivos da mesma funcionalidade; apagar módulos pela ausência de consumo no frontend poderia remover APIs usadas por outros clientes.

**Tecnologias:** NestJS, TypeScript, Prisma e PostgreSQL, sem atualização de versões.

## Execução

- [x] Reproduzir a divergência entre o caminho emitido pelo build e `start:prod` com um teste que carregue o grafo real de módulos.
- [x] Limitar o build ao código da aplicação e copiar o cliente Prisma para o diretório correto.
- [x] Mover infraestrutura e dados padrão, atualizar imports e remover `AppService`, sem referências nem registro no módulo.
- [x] Remover dependências diretas sem uso, declarar `dotenv` usado pela configuração do Prisma e sincronizar o lockfile.
- [x] Adicionar comandos de verificação, exemplo de ambiente e documentação da estrutura.
- [x] Validar tipos, schema Prisma, build, teste de carregamento e diff final.

## Restrições e revisão

- Preservar contratos HTTP, autenticação e auditoria.
- Preservar modelos e migrations; não executar alterações no banco.
- Preservar configurações locais e ferramentas de agentes.
- Verificar os imports dos dados padrão após os movimentos.
- Checar a configuração da CLI do Prisma pelo TypeScript sem incluí-la no build.
- Executar nesta pasta, sem commit, publicação ou alterações em outros projetos.

## Resultado da verificação

Schema Prisma válido, typecheck e teste de build aprovados. O teste reproduziu antes a ausência de dist/main.js e passou após o ajuste. Grafo de imports: 66 arquivos ligados a main.ts, sem órfãos. Movimentos de infraestrutura e dados padrão preservaram o conteúdo. Nenhuma conexão ou alteração no banco foi executada.
