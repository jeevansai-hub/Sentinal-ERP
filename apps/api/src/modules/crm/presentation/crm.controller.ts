import { Controller, Get } from '@nestjs/common';
import { CRMService } from '../application/crm.service';
import { wrapResponse } from '../../../shared/presentation/response.format';

@Controller('crm')
export class CRMController {
  constructor(private readonly crmService: CRMService) {}

  @Get('deals')
  getDeals() {
    const list = this.crmService.getDeals();
    return wrapResponse(list, { totalCount: list.length });
  }

  @Get('tickets')
  getTickets() {
    const list = this.crmService.getTickets();
    return wrapResponse(list, { totalCount: list.length });
  }
}
