import { Module } from '@nestjs/common';
import { WorkflowController } from './presentation/workflow.controller';
import { WorkflowService } from './application/workflow.service';

@Module({
  controllers: [WorkflowController],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
