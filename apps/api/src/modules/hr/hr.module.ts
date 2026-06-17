import { Module } from '@nestjs/common';
import { HRController } from './presentation/hr.controller';
import { HRService } from './application/hr.service';

@Module({
  controllers: [HRController],
  providers: [HRService],
  exports: [HRService],
})
export class HRModule {}
