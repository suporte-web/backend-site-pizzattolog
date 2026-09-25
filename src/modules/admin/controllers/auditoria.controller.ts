import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Perfis } from '../decorators/perfis.decorator';
import { AutenticacaoAdminGuard } from '../guards/autenticacao-admin.guard';
import { PerfisGuard } from '../guards/perfis.guard';
import { AuditoriaService } from '../services/auditoria.service';

@Controller('admin/auditoria')
@UseGuards(AutenticacaoAdminGuard, PerfisGuard)
@Perfis('ADMIN')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  listar(
    @Query('pagina') pagina?: number,
    @Query('limite') limite?: number,
    @Query('usuarioId') usuarioId?: string,
    @Query('entidade') entidade?: string,
    @Query('acao') acao?: string,
  ) {
    return this.auditoriaService.listar({
      pagina,
      limite,
      usuarioId,
      entidade,
      acao,
    });
  }
}
