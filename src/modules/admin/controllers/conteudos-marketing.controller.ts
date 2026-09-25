import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CriarHeroDto } from '../../hero/dto/criar-hero.dto';
import { Perfis } from '../decorators/perfis.decorator';
import { UsuarioAtual } from '../decorators/usuario-atual.decorator';
import { AtualizarConteudoEditavelDto } from '../dto/atualizar-conteudo-editavel.dto';
import { AtualizarHeroAdminDto } from '../dto/atualizar-hero-admin.dto';
import { AutenticacaoAdminGuard } from '../guards/autenticacao-admin.guard';
import { PerfisGuard } from '../guards/perfis.guard';
import { ConteudosMarketingService } from '../services/conteudos-marketing.service';
import { UsuarioAdminAutenticado } from '../types/usuario-admin-autenticado';

@Controller('admin/marketing')
@UseGuards(AutenticacaoAdminGuard, PerfisGuard)
@Perfis('ADMIN', 'MARKETING')
export class ConteudosMarketingController {
  constructor(
    private readonly conteudosMarketingService: ConteudosMarketingService,
  ) {}

  @Get('conteudos')
  listarConteudos() {
    return this.conteudosMarketingService.listarConteudos();
  }

  @Get('conteudos/:chave')
  buscarConteudo(@Param('chave') chave: string) {
    return this.conteudosMarketingService.buscarConteudo(chave);
  }

  @Patch('conteudos/:chave')
  atualizarConteudo(
    @Param('chave') chave: string,
    @Body() dados: AtualizarConteudoEditavelDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    return this.conteudosMarketingService.atualizarConteudo(
      chave,
      dados,
      usuario,
      requisicao,
    );
  }

  @Get('hero')
  buscarHeroAtivo() {
    return this.conteudosMarketingService.buscarHeroAtivo();
  }

  @Post('hero')
  criarHero(
    @Body() dados: CriarHeroDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    return this.conteudosMarketingService.criarHero(
      dados,
      usuario,
      requisicao,
    );
  }

  @Patch('hero/:id')
  atualizarHero(
    @Param('id') id: string,
    @Body() dados: AtualizarHeroAdminDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    return this.conteudosMarketingService.atualizarHero(
      id,
      dados,
      usuario,
      requisicao,
    );
  }
}
