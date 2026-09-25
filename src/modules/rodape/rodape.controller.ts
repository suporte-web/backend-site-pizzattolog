import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Perfis } from '../admin/decorators/perfis.decorator';
import { UsuarioAtual } from '../admin/decorators/usuario-atual.decorator';
import { AutenticacaoAdminGuard } from '../admin/guards/autenticacao-admin.guard';
import { PerfisGuard } from '../admin/guards/perfis.guard';
import { AuditoriaService } from '../admin/services/auditoria.service';
import { UsuarioAdminAutenticado } from '../admin/types/usuario-admin-autenticado';
import { CriarRodapeDto } from './dto/criar-rodape.dto';
import { RodapeService } from './rodape.service';

@Controller('rodape')
export class RodapeController {
  constructor(
    private readonly rodapeService: RodapeService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Get()
  buscarAtivo() {
    return this.rodapeService.buscarAtivo();
  }

  @Post()
  @UseGuards(AutenticacaoAdminGuard, PerfisGuard)
  @Perfis('ADMIN')
  async criar(
    @Body() dados: CriarRodapeDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    const resultado = await this.rodapeService.criar(dados);

    await this.auditoriaService.registrar({
      usuario,
      requisicao,
      acao: 'CRIAR_RODAPE',
      entidade: 'rodape',
      entidadeId: resultado.rodape.id,
      descricao: 'Rodapé criado.',
      dadosDepois: resultado.rodape,
    });

    return resultado;
  }
}
