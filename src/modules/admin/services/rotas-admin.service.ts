import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { CriarPaginaDto } from '../../paginas/dto/criar-pagina.dto';
import { AtualizarPaginaAdminDto } from '../dto/atualizar-pagina-admin.dto';
import { UsuarioAdminAutenticado } from '../types/usuario-admin-autenticado';
import { AuditoriaService } from './auditoria.service';

@Injectable()
export class RotasAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  listarTodas() {
    return this.prisma.pagina.findMany({
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async criar(
    dados: CriarPaginaDto,
    usuario: UsuarioAdminAutenticado,
    requisicao: Request,
  ) {
    try {
      const pagina = await this.prisma.pagina.create({
        data: {
          titulo: dados.titulo,
          slug: dados.slug,
          resumo: dados.resumo,
          conteudo: dados.conteudo,
          status: dados.status,
          ativo: dados.ativo,
        },
      });

      await this.auditoriaService.registrar({
        usuario,
        requisicao,
        acao: 'CRIAR_ROTA',
        entidade: 'pagina',
        entidadeId: pagina.id,
        descricao: 'Nova rota/página criada pelo painel admin.',
        dadosDepois: pagina,
      });

      return {
        success: true,
        message: 'Rota criada com sucesso.',
        rota: pagina,
      };
    } catch (error) {
      this.tratarErroSlugDuplicado(error);
      throw error;
    }
  }

  async atualizar(
    id: string,
    dados: AtualizarPaginaAdminDto,
    usuario: UsuarioAdminAutenticado,
    requisicao: Request,
  ) {
    const dadosAlteracao = this.montarDadosPagina(dados);

    if (!Object.keys(dadosAlteracao).length) {
      throw new BadRequestException('Informe ao menos um campo para atualizar.');
    }

    const paginaAntes = await this.prisma.pagina.findUnique({
      where: {
        id,
      },
    });

    if (!paginaAntes) {
      throw new NotFoundException('Rota não encontrada.');
    }

    try {
      const pagina = await this.prisma.pagina.update({
        where: {
          id,
        },
        data: dadosAlteracao,
      });

      await this.auditoriaService.registrar({
        usuario,
        requisicao,
        acao: 'ATUALIZAR_ROTA',
        entidade: 'pagina',
        entidadeId: pagina.id,
        descricao: 'Rota/página atualizada pelo painel admin.',
        dadosAntes: paginaAntes,
        dadosDepois: pagina,
      });

      return {
        success: true,
        message: 'Rota atualizada com sucesso.',
        rota: pagina,
      };
    } catch (error) {
      this.tratarErroSlugDuplicado(error);
      throw error;
    }
  }

  async remover(
    id: string,
    usuario: UsuarioAdminAutenticado,
    requisicao: Request,
  ) {
    const paginaAntes = await this.prisma.pagina.findUnique({
      where: {
        id,
      },
    });

    if (!paginaAntes) {
      throw new NotFoundException('Rota não encontrada.');
    }

    const pagina = await this.prisma.pagina.update({
      where: {
        id,
      },
      data: {
        ativo: false,
        status: 'ARQUIVADA',
      },
    });

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: 'ARQUIVAR_ROTA',
      entidade: 'pagina',
      entidadeId: pagina.id,
      descricao: 'Rota/página arquivada pelo painel admin.',
      dadosAntes: paginaAntes,
      dadosDepois: pagina,
    });

    return {
      success: true,
      message: 'Rota arquivada com sucesso.',
      rota: pagina,
    };
  }

  private montarDadosPagina(dados: AtualizarPaginaAdminDto) {
    const data: Record<string, unknown> = {};

    if (dados.titulo !== undefined) data.titulo = dados.titulo;
    if (dados.slug !== undefined) data.slug = dados.slug;
    if (dados.resumo !== undefined) data.resumo = dados.resumo;
    if (dados.conteudo !== undefined) data.conteudo = dados.conteudo;
    if (dados.status !== undefined) data.status = dados.status;
    if (dados.ativo !== undefined) data.ativo = dados.ativo;

    return data;
  }

  private tratarErroSlugDuplicado(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Já existe uma rota cadastrada com este slug.',
      );
    }
  }
}
