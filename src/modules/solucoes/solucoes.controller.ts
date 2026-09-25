import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Perfis } from '../admin/decorators/perfis.decorator';
import { UsuarioAtual } from '../admin/decorators/usuario-atual.decorator';
import { AutenticacaoAdminGuard } from '../admin/guards/autenticacao-admin.guard';
import { PerfisGuard } from '../admin/guards/perfis.guard';
import { AuditoriaService } from '../admin/services/auditoria.service';
import { UsuarioAdminAutenticado } from '../admin/types/usuario-admin-autenticado';
import { CriarSolucaoDto } from './dto/criar-solucao.dto';
import { SolucoesService } from './solucoes.service';

@Controller('solucoes')
export class SolucoesController {
  constructor(
    private readonly solucoesService: SolucoesService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Get()
  listarTodas() {
    return this.solucoesService.listarTodas();
  }

  @Get(':slug')
  buscarPorSlug(@Param('slug') slug: string) {
    return this.solucoesService.buscarPorSlug(slug);
  }

  @Post()
  @UseGuards(AutenticacaoAdminGuard, PerfisGuard)
  @Perfis('ADMIN')
  async criar(
    @Body() dados: CriarSolucaoDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    const resultado = await this.solucoesService.criar(dados);

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: 'CRIAR_SOLUCAO',
      entidade: 'solucao',
      entidadeId: resultado.solucao.id,
      descricao: 'Solução criada.',
      dadosDepois: resultado.solucao,
    });

    return resultado;
  }
}
