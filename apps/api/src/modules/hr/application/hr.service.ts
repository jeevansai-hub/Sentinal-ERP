import { Injectable } from '@nestjs/common';

@Injectable()
export class HRService {
  private employees = [
    { id: 'emp-101', name: 'Vikram Malhotra', role: 'VP Operations', department: 'Executive', ctc: 180000 },
    { id: 'emp-102', name: 'Aditi Rao', role: 'Head of Recruiting', department: 'HR', ctc: 110000 },
    { id: 'emp-103', name: 'Priya Sharma', role: 'Senior Auditor', department: 'Finance', ctc: 130000 },
    { id: 'emp-104', name: 'Alex Sterling', role: 'SCM Director', department: 'Logistics', ctc: 145000 }
  ];

  getEmployees() {
    return this.employees;
  }

  getLeaves() {
    return [
      { id: 'req-01', employeeName: 'Aditi Rao', dates: 'June 18 - June 20', status: 'Approved' },
      { id: 'req-02', employeeName: 'Priya Sharma', dates: 'June 25 - June 26', status: 'Pending' }
    ];
  }
}
