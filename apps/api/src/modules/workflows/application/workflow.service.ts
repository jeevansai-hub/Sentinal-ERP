import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowService {
  getDefinitions() {
    return [
      { id: 'wf-201', name: 'Invoice Audit Approval', triggerType: 'Event: Invoice Overdue', is_active: true },
      { id: 'wf-202', name: 'PO Auto-Provisioning', triggerType: 'Threshold: Stock Reorder', is_active: true }
    ];
  }

  getExecutionMetrics() {
    return [
      { id: 'metric-1', workflowId: 'wf-201', duration_seconds: 320, is_bottleneck_flagged: false },
      { id: 'metric-2', workflowId: 'wf-202', duration_seconds: 1850, is_bottleneck_flagged: true, bottleneck_description: 'CFO manual approval latency exceeds 48 hours' }
    ];
  }
}
