import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CriarMenuDto } from './dto/criar-menu.dto';
import { menusPadrao } from './menus-padrao';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  async listarTodos() {
    const menus = await this.prisma.menuNavegacao.findMany({
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
    });

    return menus.length ? menus : menusPadrao;
  }

  async buscarPorSlug(slug: string) {
    const menu = await this.prisma.menuNavegacao.findUnique({
      where: {
        slug,
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
    });

    if (menu?.ativo) {
      return menu;
    }

    const menuPadrao = menusPadrao.find((item) => item.slug === slug);

    if (!menuPadrao) {
      throw new NotFoundException('Menu não encontrado.');
    }

    return menuPadrao;
  }

  async criar(dados: CriarMenuDto) {
    try {
      const menu = await this.prisma.menuNavegacao.create({
        data: {
          titulo: dados.titulo,
          slug: dados.slug,
          url: dados.url,
          ordem: dados.ordem,
          ativo: dados.ativo,
          itens: dados.itens?.length
            ? {
                create: dados.itens.map((item) => ({
                  titulo: item.titulo,
                  slug: item.slug,
                  url: item.url,
                  ordem: item.ordem,
                  ativo: item.ativo,
                })),
              }
            : undefined,
        },
        include: {
          itens: {
            orderBy: {
              ordem: 'asc',
            },
          },
        },
      });

      return {
        success: true,
        message: 'Menu cadastrado com sucesso.',
        menu,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um menu cadastrado com este slug.',
        );
      }

      throw error;
    }
  }
}
