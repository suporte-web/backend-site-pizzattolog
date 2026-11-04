import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../../database/prisma.service';
import { CriarPrimeiroAcessoDto } from '../dto/criar-primeiro-acesso.dto';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { CriptografiaSenhaService } from './criptografia-senha.service';
import { AuditoriaService } from './auditoria.service';
import { TokenAdminService } from './token-admin.service';

@Injectable()
export class AutenticacaoAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly criptografiaSenhaService: CriptografiaSenhaService,
    private readonly tokenAdminService: TokenAdminService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async criarPrimeiroAcesso(dados: CriarPrimeiroAcessoDto, requisicao: Request) {
    const totalUsuarios = await this.prisma.usuarioAdmin.count();

    if (totalUsuarios > 0) {
      throw new ConflictException(
        'O primeiro acesso já foi configurado. Faça login com um usuário admin.',
      );
    }

    const usuario = await this.prisma.usuarioAdmin.create({
      data: {
        nome: dados.nome,
        email: dados.email.toLowerCase(),
        senhaHash: this.criptografiaSenhaService.gerarHash(dados.senha),
        perfil: 'ADMIN',
      },
      select: this.camposPublicosUsuario(),
    });

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: 'CRIAR_PRIMEIRO_ACESSO',
      entidade: 'usuario_admin',
      entidadeId: usuario.id,
      descricao: 'Primeiro usuário admin criado.',
      dadosDepois: usuario,
    });

    return {
      success: true,
      message: 'Primeiro acesso criado com sucesso.',
      usuario,
    };
  }

  async login(dados: LoginAdminDto, requisicao: Request) {
    const usuario = await this.prisma.usuarioAdmin.findUnique({
      where: {
        email: dados.email.toLowerCase(),
      },
    });

    if (
      !usuario ||
      !usuario.ativo ||
      !this.criptografiaSenhaService.validarSenha(
        dados.senha,
        usuario.senhaHash,
      )
    ) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const usuarioAtualizado = await this.prisma.usuarioAdmin.update({
      where: {
        id: usuario.id,
      },
      data: {
        ultimoLoginEm: new Date(),
      },
      select: this.camposPublicosUsuario(),
    });

    await this.auditoriaService.registrar({
      usuario: usuarioAtualizado,
      requisicao,
      acao: 'LOGIN_ADMIN',
      entidade: 'usuario_admin',
      entidadeId: usuario.id,
      descricao: 'Login realizado no painel admin.',
    });

    return {
      success: true,
      token: this.tokenAdminService.gerar({
        sub: usuarioAtualizado.id,
        email: usuarioAtualizado.email,
        perfil: usuarioAtualizado.perfil,
      }),
      expiraEmSegundos: this.tokenAdminService.obterExpiracaoSegundos(),
      usuario: usuarioAtualizado,
    };
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
