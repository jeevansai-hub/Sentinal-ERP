import { Injectable } from '@nestjs/common';

@Injectable()
export class AgentService {
  getRegistry() {
    return [
      { id: 'agent-1', name: 'Lead Qualifier Agent', agent_type: 'task', department_owner: 'Sales', health_status: 'Nominal', skills: ['lead-sorting', 'sentiment-analysis'] },
      { id: 'agent-2', name: 'Sales Closer Agent', agent_type: 'reasoning', department_owner: 'Sales', health_status: 'Nominal', skills: ['negotiation', 'contract-drafting'] },
      { id: 'agent-3', name: 'Finance Auditor Agent', agent_type: 'analytical', department_owner: 'Finance', health_status: 'Nominal', skills: ['ledger-matching', 'disbursement-verification'] }
    ];
  }

  getDecisionLogs() {
    return [
      { id: 'log-1', agentId: 'agent-1', decision_made: 'Approved Lead REL-901', confidence_score: 98.4 },
      { id: 'log-2', agentId: 'agent-3', decision_made: 'Flagged SLA delay on PO-991', confidence_score: 99.2 }
    ];
  }

  getSwarms() {
    return [
      { id: 'swarm-1', name: 'Enterprise Sales Swarm', member_agent_ids: ['agent-1', 'agent-2'], is_active: true }
    ];
  }
}
