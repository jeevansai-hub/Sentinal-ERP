import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  getKPIs() {
    return {
      organizationHealthScore: 94,
      departmentHealthScores: {
        finance: 98,
        hr: 94,
        scm: 82,
        sales: 95,
        security: 88
      },
      operationalEfficiency: 91.3,
      aiWorkforceReadiness: 96.2,
      automationAdoption: 85.4,
      securityPosture: 100,
      complianceReadiness: 100
    };
  }

  getControlTowerTelemetry() {
    return {
      databaseLatencyMs: 0.9,
      memoryAllocationPoolMb: [
        { name: 'Lead Qualifier', value: 1.4 },
        { name: 'Sales Closer', value: 4.8 },
        { name: 'Finance Agent', value: 12.0 }
      ],
      tokenUtilization: 42800000,
      infrastructureSpendQ3: 842000
    };
  }
}
