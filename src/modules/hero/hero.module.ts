import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';

@Module({
  imports: [AdminModule],
  controllers: [HeroController],
  providers: [HeroService],
})
export class HeroModule {}
