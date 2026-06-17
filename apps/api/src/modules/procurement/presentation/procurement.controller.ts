import { Controller, Get } from '@nestjs/common';
import { ProcurementService } from '../application/procurement.service';
import { wrapResponse } from '../../../shared/presentation/response.format';

@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get('vendors')
  getVendors() {
    const list = this.procurementService.getVendors();
    return wrapResponse(list, { totalCount: list.length });
  }

  @Get('rfqs')
  getRFQs() {
    const list = this.procurementService.getRFQs();
    return wrapResponse(list, { totalCount: list.length });
  }
}
