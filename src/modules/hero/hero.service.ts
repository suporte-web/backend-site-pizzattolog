import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CriarHeroDto } from './dto/criar-hero.dto';

@Injectable()
export class HeroService {
  constructor(private readonly prisma: PrismaService) {}

  buscarAtivo() {
    return this.prisma.heroPaginaInicial.findFirst({
      where: {
        ativo: true,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async criar(dados: CriarHeroDto) {
    const hero = await this.prisma.heroPaginaInicial.create({
      data: {
        etiqueta: dados.etiqueta,
        titulo: dados.titulo,
        descricao: dados.descricao,
        imagemUrl: dados.imagemUrl,
        textoBotaoPrimario: dados.textoBotaoPrimario,
        urlBotaoPrimario: dados.urlBotaoPrimario,
        textoBotaoSecundario: dados.textoBotaoSecundario,
        urlBotaoSecundario: dados.urlBotaoSecundario,
        ativo: dados.ativo,
      },
    });

    return {
      success: true,
      message: 'Hero cadastrado com sucesso.',
      hero,
    };
  }
}
