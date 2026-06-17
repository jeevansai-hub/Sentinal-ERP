import { Controller, Get } from '@nestjs/common';
import { ObservabilityService } from '../application/observability.service';
import { wrapResponse } from '../../../shared/presentation/response.format';

@Controller('observability')
export class ObservabilityController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  @Get('metrics')
  getMetrics() {
    const list = this.observabilityService.getSystemMetrics();
    return wrapResponse(list, { totalCount: list.length });
  }
}
