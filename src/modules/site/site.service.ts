import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { menusPadrao } from '../menus/data/menus-padrao';
import { subpaginasPadrao } from '../subpaginas/data/subpaginas-padrao';

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  async getInformacoesIniciais() {
    const [
      menus,
      hero,
      solucoes,
      rodape,
      subpaginasCadastradas,
      conteudosEditaveis,
    ] = await Promise.all([
      this.prisma.menuNavegacao.findMany({
        where: {
          ativo: true,
        },
        include: {
          itens: {
            where: {
              ativo: true,
            },
            orderBy: {
              ordem: 'asc',
            },
          },
        },
        orderBy: [
          {
            ordem: 'asc',
          },
          {
            titulo: 'asc',
          },
        ],
      }),
      this.prisma.heroPaginaInicial.findFirst({
        where: {
          ativo: true,
        },
        orderBy: {
          criadoEm: 'desc',
        },
      }),
      this.prisma.solucao.findMany({
        where: {
          ativo: true,
        },
        orderBy: [
          {
            ordem: 'asc',
          },
          {
            titulo: 'asc',
          },
        ],
      }),
      this.prisma.rodape.findFirst({
        where: {
          ativo: true,
        },
        include: {
          secoes: {
            where: {
              ativo: true,
            },
            include: {
              links: {
                where: {
                  ativo: true,
                },
                orderBy: {
                  ordem: 'asc',
                },
              },
            },
            orderBy: {
              ordem: 'asc',
            },
          },
        },
        orderBy: {
          criadoEm: 'desc',
        },
      }),
      this.prisma.subpagina.findMany({
        where: {
          ativo: true,
        },
        orderBy: [
          {
            ordem: 'asc',
          },
          {
            titulo: 'asc',
          },
        ],
      }),
      this.prisma.conteudoEditavel.findMany({
        where: {
          ativo: true,
        },
        orderBy: [
          {
            pagina: 'asc',
          },
          {
            rotulo: 'asc',
          },
        ],
      }),
    ]);

    const subpaginas = subpaginasCadastradas.length
      ? subpaginasCadastradas
      : subpaginasPadrao;

    return {
      nomeEmpresa: 'Pizzattolog',
      menus: menus.length ? menus : menusPadrao,
      hero,
      solucoes,
      rodape,
      subpaginas,
      conteudosEditaveis,
    };
  }
}
