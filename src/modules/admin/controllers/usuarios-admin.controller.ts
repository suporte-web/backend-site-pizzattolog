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
import { Perfis } from '../decorators/perfis.decorator';
import { UsuarioAtual } from '../decorators/usuario-atual.decorator';
import { AtualizarUsuarioAdminDto } from '../dto/atualizar-usuario-admin.dto';
import { CriarUsuarioAdminDto } from '../dto/criar-usuario-admin.dto';
import { AutenticacaoAdminGuard } from '../guards/autenticacao-admin.guard';
import { PerfisGuard } from '../guards/perfis.guard';
import { UsuariosAdminService } from '../services/usuarios-admin.service';
import { UsuarioAdminAutenticado } from '../types/usuario-admin-autenticado';

@Controller('admin/usuarios')
@UseGuards(AutenticacaoAdminGuard, PerfisGuard)
@Perfis('ADMIN')
export class UsuariosAdminController {
  constructor(private readonly usuariosAdminService: UsuariosAdminService) {}

  @Get()
  listarTodos() {
    return this.usuariosAdminService.listarTodos();
  }

  @Post()
  criar(
    @Body() dados: CriarUsuarioAdminDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    return this.usuariosAdminService.criar(dados, usuario, requisicao);
  }

  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() dados: AtualizarUsuarioAdminDto,
    @UsuarioAtual() usuario: UsuarioAdminAutenticado,
    @Req() requisicao: Request,
  ) {
    return this.usuariosAdminService.atualizar(id, dados, usuario, requisicao);
  }
}
