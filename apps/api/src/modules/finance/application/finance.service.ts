import { Injectable } from '@nestjs/common';

@Injectable()
export class FinanceService {
  getLedgers() {
    return [
      { id: 'ledger-01', accountName: 'Axis Operating Accounts', accountType: 'Asset', balance: 42000000 },
      { id: 'ledger-02', employeePayable: 'Accrued Wages', accountType: 'Liability', balance: 1850000 },
      { id: 'ledger-03', description: 'Deferred Capital Reserves', accountType: 'Asset', balance: 84000000 }
    ];
  }

  getInvoices() {
    return [
      { id: 'inv-801', clientName: 'Reliance Retail Ltd', amount: 1240000, status: 'Unpaid', dueDate: 'June 30' },
      { id: 'inv-802', clientName: 'Hindalco Alloys', amount: 890000, status: 'Paid', dueDate: 'June 10' }
    ];
  }
}
