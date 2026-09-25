import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AdminModule } from './modules/admin/admin.module';
import { HeroModule } from './modules/hero/hero.module';
import { MenusModule } from './modules/menus/menus.module';
import { PaginasModule } from './modules/paginas/paginas.module';
import { RodapeModule } from './modules/rodape/rodape.module';
import { SiteModule } from './modules/site/site.module';
import { SolucoesModule } from './modules/solucoes/solucoes.module';
import { SubpaginasModule } from './modules/subpaginas/subpaginas.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AdminModule,
    SiteModule,
    MenusModule,
    HeroModule,
    SolucoesModule,
    RodapeModule,
    SubpaginasModule,
    PaginasModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
