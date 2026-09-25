import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { SubpaginasController } from './subpaginas.controller';
import { SubpaginasService } from './subpaginas.service';

@Module({
  imports: [AdminModule],
  controllers: [SubpaginasController],
  providers: [SubpaginasService],
  exports: [SubpaginasService],
})
export class SubpaginasModule {}
