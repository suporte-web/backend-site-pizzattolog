import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CriarSolucaoDto } from './dto/criar-solucao.dto';

@Injectable()
export class SolucoesService {
  constructor(private readonly prisma: PrismaService) {}

  listarTodas() {
    return this.prisma.solucao.findMany({
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
  }

  async buscarPorSlug(slug: string) {
    const solucao = await this.prisma.solucao.findUnique({
      where: {
        slug,
      },
    });

    if (!solucao || !solucao.ativo) {
      throw new NotFoundException('Solução não encontrada.');
    }

    return solucao;
  }

  async criar(dados: CriarSolucaoDto) {
    try {
      const solucao = await this.prisma.solucao.create({
        data: {
          titulo: dados.titulo,
          slug: dados.slug,
          descricao: dados.descricao,
          icone: dados.icone,
          ordem: dados.ordem,
          ativo: dados.ativo,
        },
      });

      return {
        success: true,
        message: 'Solução cadastrada com sucesso.',
        solucao,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe uma solução cadastrada com este slug.',
        );
      }

      throw error;
    }
  }
}
