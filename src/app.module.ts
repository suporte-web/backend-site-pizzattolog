import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AdminModule } from './modules/admin/admin.module';
import { HeroModule } from './modules/hero/hero.module';
import { HealthModule } from './modules/health/health.module';
import { MenusModule } from './modules/menus/menus.module';
import { PaginasModule } from './modules/paginas/paginas.module';
import { RodapeModule } from './modules/rodape/rodape.module';
import { SiteModule } from './modules/site/site.module';
import { SolucoesModule } from './modules/solucoes/solucoes.module';
import { SubpaginasModule } from './modules/subpaginas/subpaginas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    HealthModule,
    AdminModule,
    SiteModule,
    MenusModule,
    HeroModule,
    SolucoesModule,
    RodapeModule,
    SubpaginasModule,
    PaginasModule,
  ],
})
export class AppModule {}
