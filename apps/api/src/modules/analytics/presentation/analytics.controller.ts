import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from '../application/analytics.service';
import { wrapResponse } from '../../../shared/presentation/response.format';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('kpis')
  getKPIs() {
    const kpis = this.analyticsService.getKPIs();
    return wrapResponse(kpis);
  }

  @Get('control-tower/telemetry')
  getTelemetry() {
    const telemetry = this.analyticsService.getControlTowerTelemetry();
    return wrapResponse(telemetry);
  }
}
