import { Controller, Get } from '@nestjs/common';
import { FinanceService } from '../application/finance.service';
import { wrapResponse } from '../../../shared/presentation/response.format';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('ledgers')
  getLedgers() {
    const list = this.financeService.getLedgers();
    return wrapResponse(list, { totalCount: list.length });
  }

  @Get('invoices')
  getInvoices() {
    const list = this.financeService.getInvoices();
    return wrapResponse(list, { totalCount: list.length });
  }
}
