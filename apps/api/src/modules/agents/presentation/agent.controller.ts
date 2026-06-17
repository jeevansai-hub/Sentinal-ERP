import { Controller, Get } from '@nestjs/common';
import { AgentService } from '../application/agent.service';
import { wrapResponse } from '../../../shared/presentation/response.format';

@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('registry')
  getRegistry() {
    const list = this.agentService.getRegistry();
    return wrapResponse(list, { totalCount: list.length });
  }

  @Get('decisions')
  getDecisionLogs() {
    const list = this.agentService.getDecisionLogs();
    return wrapResponse(list, { totalCount: list.length });
  }

  @Get('swarms')
  getSwarms() {
    const list = this.agentService.getSwarms();
    return wrapResponse(list, { totalCount: list.length });
  }
}
