import { Module } from '@nestjs/common';
import { ProcurementController } from './presentation/procurement.controller';
import { ProcurementService } from './application/procurement.service';

@Module({
  controllers: [ProcurementController],
  providers: [ProcurementService],
  exports: [ProcurementService],
})
export class ProcurementModule {}
