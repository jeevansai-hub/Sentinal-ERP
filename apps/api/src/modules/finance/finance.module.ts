import { Module } from '@nestjs/common';
import { FinanceController } from './presentation/finance.controller';
import { FinanceService } from './application/finance.service';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
