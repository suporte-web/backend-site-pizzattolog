import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CriarPaginaDto } from '../../paginas/dto/criar-pagina.dto';
import { Perfis } from '../decorators/perfis.decorator';
import { UsuarioAtual } from '../decorators/usuario-atual.decorator';
import { AtualizarPaginaAdminDto } from '../dto/atualizar-pagina-admin.dto';
import { AutenticacaoAdminGuard } from '../guards/autenticacao-admin.guard';
import { PerfisGuard } from '../guards/perfis.guard';
import { RotasAdminService } from '../services/rotas-admin.service';
import { UsuarioAdminAutenticado } from '../types/usuario-admin-autenticado';

@Controller('admin/rotas')
@UseGuards(AutenticacaoAdminGuard, PerfisGuard)
@Perfis('ADMIN')
export class RotasAdminController {
  constructor(private readonly rotasAdminService: RotasAdminService) {}

  @Get()
  listarTodas() {
    return this.rotasAdminService.listarTodas();
  }

  @Post()
  criar(
    @Body() dados: CriarPaginaDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    return this.rotasAdminService.criar(dados, usuario, requisicao);
  }

  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() dados: AtualizarPaginaAdminDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    return this.rotasAdminService.atualizar(id, dados, usuario, requisicao);
  }

  @Delete(':id')
  remover(
    @Param('id') id: string,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    return this.rotasAdminService.remover(id, usuario, requisicao);
  }
}
