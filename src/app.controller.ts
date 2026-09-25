import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      success: true,
      status: 'online',
      sistema: 'site_pizzattolog_backend',
    };
  }
}