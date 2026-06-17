import { Injectable } from '@nestjs/common';

@Injectable()
export class ObservabilityService {
  getSystemMetrics() {
    return [
      { id: 'metric-1', metric_type: 'api_latency', value: 24.5, labels: { path: '/api/v1/finance/ledgers' } },
      { id: 'metric-2', metric_type: 'db_query_time', value: 0.9, labels: { schema: 'finance', query: 'SELECT balance' } },
      { id: 'metric-3', metric_type: 'system_utilization', value: 42.8, labels: { type: 'memory_allocation_pool' } }
    ];
  }
}
