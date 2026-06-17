import { Controller, Get } from '@nestjs/common';
import { HRService } from '../application/hr.service';
import { wrapResponse } from '../../../shared/presentation/response.format';

@Controller('hr')
export class HRController {
  constructor(private readonly hrService: HRService) {}

  @Get('employees')
  getEmployees() {
    const list = this.hrService.getEmployees();
    return wrapResponse(list, { totalCount: list.length });
  }

  @Get('leaves')
  getLeaves() {
    const leaves = this.hrService.getLeaves();
    return wrapResponse(leaves, { totalCount: leaves.length });
  }
}
