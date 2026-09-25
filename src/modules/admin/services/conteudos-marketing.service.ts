import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { AtualizarConteudoEditavelDto } from '../dto/atualizar-conteudo-editavel.dto';
import { AtualizarHeroAdminDto } from '../dto/atualizar-hero-admin.dto';
import { CriarHeroDto } from '../../hero/dto/criar-hero.dto';
import { UsuarioAdminAutenticado } from '../types/usuario-admin-autenticado';
import { AuditoriaService } from './auditoria.service';

@Injectable()
export class ConteudosMarketingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  listarConteudos() {
    return this.prisma.conteudoEditavel.findMany({
      orderBy: [
        {
          pagina: 'asc',
        },
        {
          rotulo: 'asc',
        },
      ],
    });
  }

  buscarConteudo(chave: string) {
    return this.prisma.conteudoEditavel.findUnique({
      where: {
        chave,
      },
    });
  }

  async atualizarConteudo(
    chave: string,
    dados: AtualizarConteudoEditavelDto,
    usuario: UsuarioAdminAutenticado,
    requisicao: Request,
  ) {
    const dadosAlteracao = this.montarDadosConteudo(dados);

    if (!Object.keys(dadosAlteracao).length) {
      throw new BadRequestException('Informe ao menos um campo para atualizar.');
    }

    const conteudoAntes = await this.prisma.conteudoEditavel.findUnique({
      where: {
        chave,
      },
    });

    const conteudo = conteudoAntes
      ? await this.prisma.conteudoEditavel.update({
          where: {
            chave,
          },
          data: dadosAlteracao,
        })
      : await this.prisma.conteudoEditavel.create({
          data: {
            chave,
            pagina: dados.pagina ?? 'site',
            rotulo: dados.rotulo ?? chave,
            titulo: dados.titulo,
            texto: dados.texto,
            imagemUrl: dados.imagemUrl,
            ativo: dados.ativo,
          },
        });

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: conteudoAntes
        ? 'ATUALIZAR_CONTEUDO_EDITAVEL'
        : 'CRIAR_CONTEUDO_EDITAVEL',
      entidade: 'conteudo_editavel',
      entidadeId: conteudo.id,
      descricao: 'Conteúdo editável do site alterado.',
      dadosAntes: conteudoAntes,
      dadosDepois: conteudo,
    });

    return {
      success: true,
      message: 'Conteúdo atualizado com sucesso.',
      conteudo,
    };
  }

  buscarHeroAtivo() {
    return this.prisma.heroPaginaInicial.findFirst({
      where: {
        ativo: true,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async criarHero(
    dados: CriarHeroDto,
    usuario: UsuarioAdminAutenticado,
    requisicao: Request,
  ) {
    const hero = await this.prisma.heroPaginaInicial.create({
      data: {
        etiqueta: dados.etiqueta,
        titulo: dados.titulo,
        descricao: dados.descricao,
        imagemUrl: dados.imagemUrl,
        textoBotaoPrimario: dados.textoBotaoPrimario,
        urlBotaoPrimario: dados.urlBotaoPrimario,
        textoBotaoSecundario: dados.textoBotaoSecundario,
        urlBotaoSecundario: dados.urlBotaoSecundario,
        ativo: dados.ativo,
      },
    });

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: 'CRIAR_HERO',
      entidade: 'hero_pagina_inicial',
      entidadeId: hero.id,
      descricao: 'Hero criado pelo painel admin.',
      dadosDepois: hero,
    });

    return {
      success: true,
      message: 'Hero criado com sucesso.',
      hero,
    };
  }

  async atualizarHero(
    id: string,
    dados: AtualizarHeroAdminDto,
    usuario: UsuarioAdminAutenticado,
    requisicao: Request,
  ) {
    const dadosAlteracao = this.montarDadosHero(dados);

    if (!Object.keys(dadosAlteracao).length) {
      throw new BadRequestException('Informe ao menos um campo para atualizar.');
    }

    const heroAntes = await this.prisma.heroPaginaInicial.findUnique({
      where: {
        id,
      },
    });

    if (!heroAntes) {
      throw new NotFoundException('Hero não encontrado.');
    }

    const hero = await this.prisma.heroPaginaInicial.update({
      where: {
        id,
      },
      data: dadosAlteracao,
    });

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: 'ATUALIZAR_HERO',
      entidade: 'hero_pagina_inicial',
      entidadeId: hero.id,
      descricao: 'Textos ou imagem do hero alterados.',
      dadosAntes: heroAntes,
      dadosDepois: hero,
    });

    return {
      success: true,
      message: 'Hero atualizado com sucesso.',
      hero,
    };
  }

  private montarDadosConteudo(dados: AtualizarConteudoEditavelDto) {
    const data: Record<string, unknown> = {};

    if (dados.pagina !== undefined) data.pagina = dados.pagina;
    if (dados.rotulo !== undefined) data.rotulo = dados.rotulo;
    if (dados.titulo !== undefined) data.titulo = dados.titulo;
    if (dados.texto !== undefined) data.texto = dados.texto;
    if (dados.imagemUrl !== undefined) data.imagemUrl = dados.imagemUrl;
    if (dados.ativo !== undefined) data.ativo = dados.ativo;

    return data;
  }

  private montarDadosHero(dados: AtualizarHeroAdminDto) {
    const data: Record<string, unknown> = {};

    if (dados.etiqueta !== undefined) data.etiqueta = dados.etiqueta;
    if (dados.titulo !== undefined) data.titulo = dados.titulo;
    if (dados.descricao !== undefined) data.descricao = dados.descricao;
    if (dados.imagemUrl !== undefined) data.imagemUrl = dados.imagemUrl;
    if (dados.textoBotaoPrimario !== undefined) {
      data.textoBotaoPrimario = dados.textoBotaoPrimario;
    }
    if (dados.urlBotaoPrimario !== undefined) {
      data.urlBotaoPrimario = dados.urlBotaoPrimario;
    }
    if (dados.textoBotaoSecundario !== undefined) {
      data.textoBotaoSecundario = dados.textoBotaoSecundario;
    }
    if (dados.urlBotaoSecundario !== undefined) {
      data.urlBotaoSecundario = dados.urlBotaoSecundario;
    }

    return data;
  }
}
