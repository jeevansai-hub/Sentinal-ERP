import { Module } from '@nestjs/common';
import { AnalyticsController } from './presentation/analytics.controller';
import { AnalyticsService } from './application/analytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
