import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Perfis } from '../admin/decorators/perfis.decorator';
import { UsuarioAtual } from '../admin/decorators/usuario-atual.decorator';
import { AutenticacaoAdminGuard } from '../admin/guards/autenticacao-admin.guard';
import { PerfisGuard } from '../admin/guards/perfis.guard';
import { AuditoriaService } from '../admin/services/auditoria.service';
import { UsuarioAdminAutenticado } from '../admin/types/usuario-admin-autenticado';
import { CriarMenuDto } from './dto/criar-menu.dto';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
  constructor(
    private readonly menusService: MenusService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Get()
  listarTodos() {
    return this.menusService.listarTodos();
  }

  @Get(':slug')
  buscarPorSlug(@Param('slug') slug: string) {
    return this.menusService.buscarPorSlug(slug);
  }

  @Post()
  @UseGuards(AutenticacaoAdminGuard, PerfisGuard)
  @Perfis('ADMIN')
  async criar(
    @Body() dados: CriarMenuDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    const resultado = await this.menusService.criar(dados);

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: 'CRIAR_MENU',
      entidade: 'menu_navegacao',
      entidadeId: resultado.menu.id,
      descricao: 'Menu criado.',
      dadosDepois: resultado.menu,
    });

    return resultado;
  }
}
