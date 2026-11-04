import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CriarRodapeDto } from './dto/criar-rodape.dto';

@Injectable()
export class RodapeService {
  constructor(private readonly prisma: PrismaService) {}

  buscarAtivo() {
    return this.prisma.rodape.findFirst({
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
    });
  }

  async criar(dados: CriarRodapeDto) {
    const rodape = await this.prisma.rodape.create({
      data: {
        nomeEmpresa: dados.nomeEmpresa,
        descricao: dados.descricao,
        direitosAutorais: dados.direitosAutorais,
        ativo: dados.ativo,
        secoes: dados.secoes?.length
          ? {
              create: dados.secoes.map((secao) => ({
                titulo: secao.titulo,
                ordem: secao.ordem,
                ativo: secao.ativo,
                links: secao.links?.length
                  ? {
                      create: secao.links.map((link) => ({
                        titulo: link.titulo,
                        url: link.url,
                        ordem: link.ordem,
                        ativo: link.ativo,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        secoes: {
          include: {
            links: true,
          },
          orderBy: {
            ordem: 'asc',
          },
        },
      },
    });

    return {
      success: true,
      message: 'Rodapé cadastrado com sucesso.',
      rodape,
    };
  }
}
