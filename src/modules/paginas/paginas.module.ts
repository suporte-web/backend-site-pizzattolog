import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { PaginasController } from './paginas.controller';
import { PaginasService } from './paginas.service';

@Module({
  imports: [AdminModule],
  controllers: [PaginasController],
  providers: [PaginasService],
})
export class PaginasModule {}
