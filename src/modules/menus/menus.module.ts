import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

@Module({
  imports: [AdminModule],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
