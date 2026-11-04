import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CriarSubpaginaDto } from './dto/criar-subpagina.dto';
import { subpaginasPadrao } from './data/subpaginas-padrao';

@Injectable()
export class SubpaginasService {
  constructor(private readonly prisma: PrismaService) {}

  async listarTodas() {
    const subpaginas = await this.prisma.subpagina.findMany({
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
    });

    return subpaginas.length ? subpaginas : subpaginasPadrao;
  }

  async listarPorPagina(paginaPai: string) {
    const subpaginas = await this.prisma.subpagina.findMany({
      where: {
        paginaPai,
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
    });

    if (subpaginas.length) {
      return subpaginas;
    }

    return subpaginasPadrao.filter(
      (subpagina) => subpagina.paginaPai === paginaPai,
    );
  }

  async buscarPorSlug(slug: string) {
    const subpagina = await this.prisma.subpagina.findUnique({
      where: {
        slug,
      },
    });

    if (subpagina?.ativo) {
      return subpagina;
    }

    const subpaginaPadrao = subpaginasPadrao.find(
      (item) => item.slug === slug && item.ativo,
    );

    if (!subpaginaPadrao) {
      throw new NotFoundException('Subpágina não encontrada.');
    }

    return subpaginaPadrao;
  }

  async criar(dados: CriarSubpaginaDto) {
    try {
      const subpagina = await this.prisma.subpagina.create({
        data: {
          titulo: dados.titulo,
          slug: dados.slug,
          paginaPai: dados.paginaPai,
          caminho: dados.caminho,
          ancora: dados.ancora,
          descricao: dados.descricao,
          ordem: dados.ordem,
          ativo: dados.ativo,
        },
      });

      return {
        success: true,
        message: 'Subpágina cadastrada com sucesso.',
        subpagina,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe uma subpágina cadastrada com este slug.',
        );
      }

      throw error;
    }
  }
}
