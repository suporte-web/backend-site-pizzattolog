import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Perfis } from '../admin/decorators/perfis.decorator';
import { UsuarioAtual } from '../admin/decorators/usuario-atual.decorator';
import { AutenticacaoAdminGuard } from '../admin/guards/autenticacao-admin.guard';
import { PerfisGuard } from '../admin/guards/perfis.guard';
import { AuditoriaService } from '../admin/services/auditoria.service';
import { UsuarioAdminAutenticado } from '../admin/types/usuario-admin-autenticado';
import { CriarPaginaDto } from './dto/criar-pagina.dto';
import { PaginasService } from './paginas.service';

@Controller('paginas')
export class PaginasController {
  constructor(
    private readonly paginasService: PaginasService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Get()
  listarTodas() {
    return this.paginasService.listarTodas();
  }

  @Get(':slug')
  buscarPorSlug(@Param('slug') slug: string) {
    return this.paginasService.buscarPorSlug(slug);
  }

  @Post()
  @UseGuards(AutenticacaoAdminGuard, PerfisGuard)
  @Perfis('ADMIN')
  async criar(
    @Body() dados: CriarPaginaDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    const resultado = await this.paginasService.criar(dados);

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: 'CRIAR_PAGINA',
      entidade: 'pagina',
      entidadeId: resultado.pagina.id,
      descricao: 'Página criada.',
      dadosDepois: resultado.pagina,
    });

    return resultado;
  }
}
