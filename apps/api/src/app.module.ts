import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import domain modules
import { HRModule } from './modules/hr/hr.module';
import { FinanceModule } from './modules/finance/finance.module';
import { CRMModule } from './modules/crm/crm.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { WorkflowModule } from './modules/workflows/workflow.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AgentModule } from './modules/agents/agent.module';
import { ObservabilityModule } from './modules/observability/observability.module';

@Module({
  imports: [
    HRModule,
    FinanceModule,
    CRMModule,
    ProcurementModule,
    WorkflowModule,
    AnalyticsModule,
    AgentModule,
    ObservabilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
