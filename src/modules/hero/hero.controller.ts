import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Perfis } from '../admin/decorators/perfis.decorator';
import { UsuarioAtual } from '../admin/decorators/usuario-atual.decorator';
import { AutenticacaoAdminGuard } from '../admin/guards/autenticacao-admin.guard';
import { PerfisGuard } from '../admin/guards/perfis.guard';
import { AuditoriaService } from '../admin/services/auditoria.service';
import { UsuarioAdminAutenticado } from '../admin/types/usuario-admin-autenticado';
import { CriarHeroDto } from './dto/criar-hero.dto';
import { HeroService } from './hero.service';

@Controller('hero')
export class HeroController {
  constructor(
    private readonly heroService: HeroService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Get()
  buscarAtivo() {
    return this.heroService.buscarAtivo();
  }

  @Post()
  @UseGuards(AutenticacaoAdminGuard, PerfisGuard)
  @Perfis('ADMIN')
  async criar(
    @Body() dados: CriarHeroDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    const resultado = await this.heroService.criar(dados);

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: 'CRIAR_HERO',
      entidade: 'hero_pagina_inicial',
      entidadeId: resultado.hero.id,
      descricao: 'Hero criado.',
      dadosDepois: resultado.hero,
    });

    return resultado;
  }
}
