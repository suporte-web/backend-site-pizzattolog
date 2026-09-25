import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsuarioAtual } from '../decorators/usuario-atual.decorator';
import { CriarPrimeiroAcessoDto } from '../dto/criar-primeiro-acesso.dto';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { AutenticacaoAdminGuard } from '../guards/autenticacao-admin.guard';
import { AutenticacaoAdminService } from '../services/autenticacao-admin.service';
import { UsuarioAdminAutenticado } from '../types/usuario-admin-autenticado';

@Controller('admin/autenticacao')
export class AutenticacaoAdminController {
  constructor(
    private readonly autenticacaoAdminService: AutenticacaoAdminService,
  ) {}

  @Post('primeiro-acesso')
  criarPrimeiroAcesso(
    @Body() dados: CriarPrimeiroAcessoDto,
    @Req() requisicao: Request,
  ) {
    return this.autenticacaoAdminService.criarPrimeiroAcesso(
      dados,
      requisicao,
    );
  }

  @Post('login')
  login(@Body() dados: LoginAdminDto, @Req() requisicao: Request) {
    return this.autenticacaoAdminService.login(dados, requisicao);
  }

  @Get('me')
  @UseGuards(AutenticacaoAdminGuard)
  me(@UsuarioAtual() usuario: UsuarioAdminAutenticado) {
    return {
      usuario,
    };
  }
}
