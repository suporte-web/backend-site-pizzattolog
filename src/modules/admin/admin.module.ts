import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AuditoriaController } from './controllers/auditoria.controller';
import { AutenticacaoAdminController } from './controllers/autenticacao-admin.controller';
import { ConteudosMarketingController } from './controllers/conteudos-marketing.controller';
import { RotasAdminController } from './controllers/rotas-admin.controller';
import { UsuariosAdminController } from './controllers/usuarios-admin.controller';
import { AutenticacaoAdminGuard } from './guards/autenticacao-admin.guard';
import { PerfisGuard } from './guards/perfis.guard';
import { AuditoriaService } from './services/auditoria.service';
import { AutenticacaoAdminService } from './services/autenticacao-admin.service';
import { ConteudosMarketingService } from './services/conteudos-marketing.service';
import { CriptografiaSenhaService } from './services/criptografia-senha.service';
import { RotasAdminService } from './services/rotas-admin.service';
import { TokenAdminService } from './services/token-admin.service';
import { UsuariosAdminService } from './services/usuarios-admin.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    AuditoriaController,
    AutenticacaoAdminController,
    ConteudosMarketingController,
    RotasAdminController,
    UsuariosAdminController,
  ],
  providers: [
    AuditoriaService,
    AutenticacaoAdminService,
    AutenticacaoAdminGuard,
    ConteudosMarketingService,
    CriptografiaSenhaService,
    PerfisGuard,
    RotasAdminService,
    TokenAdminService,
    UsuariosAdminService,
  ],
  exports: [
    AuditoriaService,
    AutenticacaoAdminGuard,
    PerfisGuard,
    TokenAdminService,
  ],
})
export class AdminModule {}
