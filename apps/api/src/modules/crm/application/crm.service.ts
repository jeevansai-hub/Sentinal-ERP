import { Injectable } from '@nestjs/common';

@Injectable()
export class CRMService {
  private deals = [
    { id: 'DEAL-901', client: 'Reliance Industries', amount: 8500000, stage: 'Negotiation', owner: 'Vikram Malhotra', health: 'Optimal' },
    { id: 'DEAL-902', client: 'Infosys Corp', amount: 4200000, stage: 'Proposal', owner: 'Vikram Malhotra', health: 'Optimal' },
    { id: 'DEAL-903', client: 'HDFC Bank Ltd', amount: 12000000, stage: 'Lead', owner: 'Aditi Rao', health: 'Warning' },
    { id: 'DEAL-904', client: 'Zomato Group', amount: 3100000, stage: 'Contacted', owner: 'Priya Sharma', health: 'Optimal' }
  ];

  getDeals() {
    return this.deals;
  }

  getTickets() {
    return [
      { id: 'TKT-101', customerName: 'Ola Electric Support', subject: 'API Webhook Timeout', status: 'Open' },
      { id: 'TKT-102', customerName: 'Tata Steel Account', subject: 'Invoice Discrepancy SLA', status: 'Closed' }
    ];
  }
}
