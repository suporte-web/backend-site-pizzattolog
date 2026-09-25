import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Perfis } from '../admin/decorators/perfis.decorator';
import { UsuarioAtual } from '../admin/decorators/usuario-atual.decorator';
import { AutenticacaoAdminGuard } from '../admin/guards/autenticacao-admin.guard';
import { PerfisGuard } from '../admin/guards/perfis.guard';
import { AuditoriaService } from '../admin/services/auditoria.service';
import { UsuarioAdminAutenticado } from '../admin/types/usuario-admin-autenticado';
import { CriarSubpaginaDto } from './dto/criar-subpagina.dto';
import { SubpaginasService } from './subpaginas.service';

@Controller('subpaginas')
export class SubpaginasController {
  constructor(
    private readonly subpaginasService: SubpaginasService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Get()
  listarTodas() {
    return this.subpaginasService.listarTodas();
  }

  @Get('pagina/:paginaPai')
  listarPorPagina(@Param('paginaPai') paginaPai: string) {
    return this.subpaginasService.listarPorPagina(paginaPai);
  }

  @Get(':slug')
  buscarPorSlug(@Param('slug') slug: string) {
    return this.subpaginasService.buscarPorSlug(slug);
  }

  @Post()
  @UseGuards(AutenticacaoAdminGuard, PerfisGuard)
  @Perfis('ADMIN')
  async criar(
    @Body() dados: CriarSubpaginaDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    const resultado = await this.subpaginasService.criar(dados);

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: 'CRIAR_SUBPAGINA',
      entidade: 'subpagina',
      entidadeId: resultado.subpagina.id,
      descricao: 'Subpágina criada.',
      dadosDepois: resultado.subpagina,
    });

    return resultado;
  }
}
