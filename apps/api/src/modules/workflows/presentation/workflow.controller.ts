import { Controller, Get } from '@nestjs/common';
import { WorkflowService } from '../application/workflow.service';
import { wrapResponse } from '../../../shared/presentation/response.format';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get('definitions')
  getDefinitions() {
    const list = this.workflowService.getDefinitions();
    return wrapResponse(list, { totalCount: list.length });
  }

  @Get('metrics')
  getExecutionMetrics() {
    const list = this.workflowService.getExecutionMetrics();
    return wrapResponse(list, { totalCount: list.length });
  }
}
