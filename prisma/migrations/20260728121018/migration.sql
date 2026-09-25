-- CreateEnum
CREATE TYPE "StatusPagina" AS ENUM ('RASCUNHO', 'PUBLICADA', 'ARQUIVADA');

-- CreateTable
CREATE TABLE "heroes_pagina_inicial" (
    "id" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "textoBotaoPrimario" TEXT NOT NULL,
    "urlBotaoPrimario" TEXT,
    "textoBotaoSecundario" TEXT NOT NULL,
    "urlBotaoSecundario" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "heroes_pagina_inicial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_menu" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "url" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "menuId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itens_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links_rodape" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "url" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "secaoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_rodape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus_navegacao" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "url" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_navegacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paginas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resumo" TEXT,
    "conteudo" TEXT NOT NULL,
    "status" "StatusPagina" NOT NULL DEFAULT 'RASCUNHO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paginas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rodapes" (
    "id" TEXT NOT NULL,
    "nomeEmpresa" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "direitosAutorais" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rodapes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secoes_rodape" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "rodapeId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secoes_rodape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solucoes" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "icone" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solucoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subpaginas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "paginaPai" TEXT NOT NULL,
    "caminho" TEXT NOT NULL,
    "ancora" TEXT,
    "descricao" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subpaginas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "itens_menu_menuId_slug_key" ON "itens_menu"("menuId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "menus_navegacao_slug_key" ON "menus_navegacao"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "paginas_slug_key" ON "paginas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "solucoes_slug_key" ON "solucoes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "subpaginas_slug_key" ON "subpaginas"("slug");

-- CreateIndex
CREATE INDEX "subpaginas_paginaPai_idx" ON "subpaginas"("paginaPai");

-- AddForeignKey
ALTER TABLE "itens_menu" ADD CONSTRAINT "itens_menu_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus_navegacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links_rodape" ADD CONSTRAINT "links_rodape_secaoId_fkey" FOREIGN KEY ("secaoId") REFERENCES "secoes_rodape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secoes_rodape" ADD CONSTRAINT "secoes_rodape_rodapeId_fkey" FOREIGN KEY ("rodapeId") REFERENCES "rodapes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
