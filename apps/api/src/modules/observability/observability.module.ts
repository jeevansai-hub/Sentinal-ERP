import { Module } from '@nestjs/common';
import { ObservabilityController } from './presentation/observability.controller';
import { ObservabilityService } from './application/observability.service';

@Module({
  controllers: [ObservabilityController],
  providers: [ObservabilityService],
  exports: [ObservabilityService],
})
export class ObservabilityModule {}
