import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../../database/prisma.service';
import { UsuarioAdminAutenticado } from '../types/usuario-admin-autenticado';

interface RegistrarAuditoriaParams {
  usuario?: UsuarioAdminAutenticado;
  requisicao?: Request;
  acao: string;
  entidade: string;
  entidadeId?: string;
  descricao?: string;
  dadosAntes?: unknown;
  dadosDepois?: unknown;
}

interface ListarAuditoriaParams {
  pagina?: number;
  limite?: number;
  usuarioId?: string;
  entidade?: string;
  acao?: string;
}

@Injectable()
export class AuditoriaService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar({
    usuario,
    requisicao,
    acao,
    entidade,
    entidadeId,
    descricao,
    dadosAntes,
    dadosDepois,
  }: RegistrarAuditoriaParams) {
    return this.prisma.logAuditoria.create({
      data: {
        usuarioId: usuario?.id,
        usuarioEmail: usuario?.email,
        perfil: usuario?.perfil,
        acao,
        entidade,
        entidadeId,
        descricao,
        dadosAntes: this.normalizarJson(dadosAntes),
        dadosDepois: this.normalizarJson(dadosDepois),
        ip: this.obterIp(requisicao),
        userAgent: requisicao?.headers['user-agent'],
      },
    });
  }

  async listar({
    pagina = 1,
    limite = 50,
    usuarioId,
    entidade,
    acao,
  }: ListarAuditoriaParams) {
    const paginaNormalizada = Math.max(Number(pagina) || 1, 1);
    const limiteNormalizado = Math.min(Math.max(Number(limite) || 50, 1), 100);
    const where = {
      usuarioId,
      entidade,
      acao,
    };

    const [total, logs] = await Promise.all([
      this.prisma.logAuditoria.count({ where }),
      this.prisma.logAuditoria.findMany({
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              perfil: true,
            },
          },
        },
        orderBy: {
          criadoEm: 'desc',
        },
        skip: (paginaNormalizada - 1) * limiteNormalizado,
        take: limiteNormalizado,
      }),
    ]);

    return {
      pagina: paginaNormalizada,
      limite: limiteNormalizado,
      total,
      logs,
    };
  }

  private normalizarJson(valor: unknown) {
    if (valor === undefined) {
      return undefined;
    }

    return JSON.parse(JSON.stringify(valor));
  }

  private obterIp(requisicao?: Request) {
    const encaminhado = requisicao?.headers['x-forwarded-for'];

    if (Array.isArray(encaminhado)) {
      return encaminhado[0];
    }

    if (encaminhado) {
      return encaminhado.split(',')[0].trim();
    }

    return requisicao?.ip;
  }
}
