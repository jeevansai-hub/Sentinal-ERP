import { Module } from '@nestjs/common';
import { AgentController } from './presentation/agent.controller';
import { AgentService } from './application/agent.service';

@Module({
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
