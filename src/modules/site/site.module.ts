import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

@Module({
  providers: [SiteService],
  controllers: [SiteController],
})
export class SiteModule {}
