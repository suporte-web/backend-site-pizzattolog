import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CriarPaginaDto } from './dto/criar-pagina.dto';

@Injectable()
export class PaginasService {
  constructor(private readonly prisma: PrismaService) {}

  async listarTodas() {
    return this.prisma.pagina.findMany({
      where: {
        ativo: true,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async buscarPorSlug(slug: string) {
    const pagina = await this.prisma.pagina.findUnique({
      where: {
        slug,
      },
    });

    if (!pagina || !pagina.ativo) {
      throw new NotFoundException('Página não encontrada.');
    }

    return pagina;
  }

  async criar(dados: CriarPaginaDto) {
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

      return {
        success: true,
        message: 'Página cadastrada com sucesso.',
        pagina,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe uma página cadastrada com este slug.',
        );
      }

      throw error;
    }
  }
}
