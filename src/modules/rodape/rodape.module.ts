import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { RodapeController } from './rodape.controller';
import { RodapeService } from './rodape.service';

@Module({
  imports: [AdminModule],
  controllers: [RodapeController],
  providers: [RodapeService],
})
export class RodapeModule {}
