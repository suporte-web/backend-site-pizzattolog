import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { SolucoesController } from './solucoes.controller';
import { SolucoesService } from './solucoes.service';

@Module({
  imports: [AdminModule],
  controllers: [SolucoesController],
  providers: [SolucoesService],
})
export class SolucoesModule {}
