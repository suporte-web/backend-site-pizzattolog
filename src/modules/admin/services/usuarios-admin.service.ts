import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AtualizarUsuarioAdminDto } from '../dto/atualizar-usuario-admin.dto';
import { CriarUsuarioAdminDto } from '../dto/criar-usuario-admin.dto';
import { UsuarioAdminAutenticado } from '../types/usuario-admin-autenticado';
import { AuditoriaService } from './auditoria.service';
import { CriptografiaSenhaService } from './criptografia-senha.service';

@Injectable()
export class UsuariosAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly criptografiaSenhaService: CriptografiaSenhaService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  listarTodos() {
    return this.prisma.usuarioAdmin.findMany({
      select: this.camposPublicosUsuario(),
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async criar(
    dados: CriarUsuarioAdminDto,
    usuarioAtual: UsuarioAdminAutenticado,
    requisicao: Request,
  ) {
    try {
      const usuario = await this.prisma.usuarioAdmin.create({
        data: {
          nome: dados.nome,
          email: dados.email.toLowerCase(),
          senhaHash: this.criptografiaSenhaService.gerarHash(dados.senha),
          perfil: dados.perfil,
          ativo: dados.ativo,
        },
        select: this.camposPublicosUsuario(),
      });

      await this.auditoriaService.registrar({
        usuario: usuarioAtual,
        requisicao,
        acao: 'CRIAR_USUARIO_ADMIN',
        entidade: 'usuario_admin',
        entidadeId: usuario.id,
        descricao: 'Usuário do painel admin criado.',
        dadosDepois: usuario,
      });

      return {
        success: true,
        message: 'Usuário admin criado com sucesso.',
        usuario,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um usuário admin com este e-mail.',
        );
      }

      throw error;
    }
  }

  async atualizar(
    id: string,
    dados: AtualizarUsuarioAdminDto,
    usuarioAtual: UsuarioAdminAutenticado,
    requisicao: Request,
  ) {
    const dadosAtualizacao: Record<string, unknown> = {};

    if (dados.nome !== undefined) dadosAtualizacao.nome = dados.nome;
    if (dados.email !== undefined) dadosAtualizacao.email = dados.email.toLowerCase();
    if (dados.perfil !== undefined) dadosAtualizacao.perfil = dados.perfil;
    if (dados.ativo !== undefined) dadosAtualizacao.ativo = dados.ativo;
    if (dados.senha !== undefined) {
      dadosAtualizacao.senhaHash =
        this.criptografiaSenhaService.gerarHash(dados.senha);
    }

    if (!Object.keys(dadosAtualizacao).length) {
      throw new BadRequestException('Informe ao menos um campo para atualizar.');
    }

    const usuarioAntes = await this.prisma.usuarioAdmin.findUnique({
      where: {
        id,
      },
      select: this.camposPublicosUsuario(),
    });

    if (!usuarioAntes) {
      throw new NotFoundException('Usuário admin não encontrado.');
    }

    try {
      const usuario = await this.prisma.usuarioAdmin.update({
        where: {
          id,
        },
        data: dadosAtualizacao,
        select: this.camposPublicosUsuario(),
      });

      await this.auditoriaService.registrar({
        usuario: usuarioAtual,
        requisicao,
        acao: 'ATUALIZAR_USUARIO_ADMIN',
        entidade: 'usuario_admin',
        entidadeId: usuario.id,
        descricao: 'Usuário do painel admin atualizado.',
        dadosAntes: usuarioAntes,
        dadosDepois: usuario,
      });

      return {
        success: true,
        message: 'Usuário admin atualizado com sucesso.',
        usuario,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um usuário admin com este e-mail.',
        );
      }

      throw error;
    }
  }

  private camposPublicosUsuario() {
    return {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      ativo: true,
      ultimoLoginEm: true,
      criadoEm: true,
      atualizadoEm: true,
    };
  }
}
