import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { wrapResponse } from './shared/presentation/response.format';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    const status = this.appService.getSystemStatus();
    return wrapResponse(status);
  }
}
