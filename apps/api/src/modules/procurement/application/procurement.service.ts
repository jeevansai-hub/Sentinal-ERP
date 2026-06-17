import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcurementService {
  getVendors() {
    return [
      { id: 'VND-001', name: 'Reliance Materials Ltd', category: 'Raw Metal Refineries', rating: 4.8, activeContracts: 3, slaCompliance: 98, reliabilityScore: 92, costEfficiency: 85, riskStatus: 'Low' },
      { id: 'VND-002', name: 'Tata Steel Processing', category: 'Heavy Metal Plates', rating: 4.5, activeContracts: 2, slaCompliance: 94, reliabilityScore: 88, costEfficiency: 75, riskStatus: 'Low' },
      { id: 'VND-003', name: 'Hindalco Extrusions', category: 'Aluminum Alloys', rating: 4.2, activeContracts: 4, slaCompliance: 89, reliabilityScore: 78, costEfficiency: 90, riskStatus: 'Medium' }
    ];
  }

  getRFQs() {
    return [
      { id: 'RFQ-881', item: 'Carbon Alloy Plates (120T)', vendorName: 'Tata Steel Processing', value: 3200000, status: 'Pending', deliveryDate: '2026-07-10' },
      { id: 'RFQ-882', item: 'Premium Copper Bars (50T)', vendorName: 'Vedanta Sourcing', value: 1850000, status: 'Active', deliveryDate: '2026-06-25' }
    ];
  }
}
