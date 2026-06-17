import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, 
  ShoppingCart,
  ShieldCheck,
  FileText,
  Activity,
  Layers
} from 'lucide-react';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';
import EnterpriseChart from '../common/EnterpriseChart';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';

interface ProcurementViewProps {
  user: any;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  activeContracts: number;
  slaCompliance: number;
  reliabilityScore: number;
  costEfficiency: number;
  riskStatus: 'Low' | 'Medium' | 'High';
}

interface RFQContract {
  id: string;
  item: string;
  vendorName: string;
  value: number;
  status: 'Pending' | 'Active' | 'Closed';
  deliveryDate: string;
}

export default function ProcurementView({ user: _user }: ProcurementViewProps) {
  const [loading] = useState(false);
  const location = useLocation();
  const isPurchaseMgmt = location.pathname.includes('purchase');
  const [activeTab, setActiveTab] = useState<'contracts' | 'vendors'>(isPurchaseMgmt ? 'contracts' : 'contracts');
  const [selectedVendorNode, setSelectedVendorNode] = useState<string | null>(null);

  const expenditureData = [
    { name: 'Jan', value: 2400000, stackedValues: [
      { label: 'Raw Metals', value: 1200000, color: '#F43F5E' },
      { label: 'Alloys', value: 800000, color: '#FDA4AF' },
      { label: 'Logistics', value: 400000, color: '#FECDD3' }
    ]},
    { name: 'Feb', value: 3800000, stackedValues: [
      { label: 'Raw Metals', value: 1900000, color: '#F43F5E' },
      { label: 'Alloys', value: 1100000, color: '#FDA4AF' },
      { label: 'Logistics', value: 800000, color: '#FECDD3' }
    ]},
    { name: 'Mar', value: 3100000, stackedValues: [
      { label: 'Raw Metals', value: 1500000, color: '#F43F5E' },
      { label: 'Alloys', value: 1000000, color: '#FDA4AF' },
      { label: 'Logistics', value: 600000, color: '#FECDD3' }
    ]},
    { name: 'Apr', value: 4500000, stackedValues: [
      { label: 'Raw Metals', value: 2500000, color: '#F43F5E' },
      { label: 'Alloys', value: 1200000, color: '#FDA4AF' },
      { label: 'Logistics', value: 800000, color: '#FECDD3' }
    ]}
  ];

  const ganttTracks = [
    { name: 'Tata Steel Plates Delivery', value: 65, start: 1, duration: 3 },
    { name: 'Hindalco Alloys Transit', value: 90, start: 3, duration: 2 },
    { name: 'Vedanta Sourcing Provision', value: 20, start: 4, duration: 4 }
  ];

  const [vendors] = useState<Vendor[]>([
    { id: 'VND-001', name: 'Reliance Materials Ltd', category: 'Raw Metal Refineries', rating: 4.8, activeContracts: 3, slaCompliance: 98, reliabilityScore: 92, costEfficiency: 85, riskStatus: 'Low' },
    { id: 'VND-002', name: 'Tata Steel Processing', category: 'Heavy Metal Plates', rating: 4.5, activeContracts: 2, slaCompliance: 94, reliabilityScore: 88, costEfficiency: 75, riskStatus: 'Low' },
    { id: 'VND-003', name: 'Hindalco Extrusions', category: 'Aluminum Alloys', rating: 4.2, activeContracts: 4, slaCompliance: 89, reliabilityScore: 78, costEfficiency: 90, riskStatus: 'Medium' },
    { id: 'VND-004', name: 'Vedanta Sourcing', category: 'Copper Refineries', rating: 3.9, activeContracts: 1, slaCompliance: 81, reliabilityScore: 65, costEfficiency: 60, riskStatus: 'High' },
    { id: 'VND-005', name: 'Jindal Steel Power', category: 'Forged Iron Rails', rating: 4.6, activeContracts: 3, slaCompliance: 96, reliabilityScore: 90, costEfficiency: 80, riskStatus: 'Low' }
  ]);

  const [contracts, setContracts] = useState<RFQContract[]>([
    { id: 'RFQ-881', item: 'Carbon Alloy Plates (120T)', vendorName: 'Tata Steel Processing', value: 3200000, status: 'Pending', deliveryDate: '2026-07-10' },
    { id: 'RFQ-882', item: 'Premium Copper Bars (50T)', vendorName: 'Vedanta Sourcing', value: 1850000, status: 'Active', deliveryDate: '2026-06-25' },
    { id: 'RFQ-883', item: 'Aluminum Sheets (80T)', vendorName: 'Hindalco Extrusions', value: 2400000, status: 'Active', deliveryDate: '2026-07-01' },
    { id: 'RFQ-884', item: 'Structural Steel Rebars (200T)', vendorName: 'Jindal Steel Power', value: 4500000, status: 'Closed', deliveryDate: '2026-05-15' }
  ]);

  const handleApproveRFQ = (id: string) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: 'Active' } : c));
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const contractColumns = [
    { 
      key: 'item', 
      label: 'RFQ Line Item', 
      sortable: true,
      render: (_: any, row: RFQContract) => (
        <div>
          <span className="font-semibold text-white">{row.item}</span>
          <span className="text-[9px] text-white/40 block font-normal font-mono">{row.id}</span>
        </div>
      )
    },
    { key: 'vendorName', label: 'Vendor Node', sortable: true },
    { 
      key: 'value', 
      label: 'Value Amt', 
      sortable: true,
      render: (val: number) => <span className="font-mono text-white/80">{formatINR(val)}</span>
    },
    { key: 'deliveryDate', label: 'Target Delivery', sortable: true },
    {
      key: 'status',
      label: 'Verification',
      sortable: true,
      render: (val: string, row: RFQContract) => (
        row.status === 'Pending' ? (
          <button 
            onClick={() => handleApproveRFQ(row.id)}
            className="px-2.5 py-1 bg-white text-black font-bold text-[9px] rounded hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Accept
          </button>
        ) : (
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
            val === 'Active' 
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' 
              : 'border-white/10 bg-white/5 text-white/40'
          }`}>
            {val}
          </span>
        )
      )
    }
  ];

  const vendorColumns = [
    { key: 'id', label: 'Vendor ID', sortable: true },
    { key: 'name', label: 'Vendor Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { 
      key: 'slaCompliance', 
      label: 'SLA Match', 
      sortable: true,
      render: (val: number) => <span className="font-mono text-emerald-400 font-bold">{val}%</span>
    },
    { key: 'activeContracts', label: 'Active Contracts', sortable: true }
  ];

  const riskData = useMemo(() => {
    return vendors.map(v => ({
      name: v.name,
      value: v.slaCompliance,
      x: v.reliabilityScore,
      y: v.costEfficiency,
      riskStatus: v.riskStatus
    }));
  }, [vendors]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            {isPurchaseMgmt ? (
              <>
                <FileText className="text-white h-5 w-5 animate-pulse" />
                Purchase Order Management &amp; Expenditures
              </>
            ) : (
              <>
                <ShoppingCart className="text-white h-5 w-5 animate-pulse" />
                SCM Procurement &amp; Supplier Networks
              </>
            )}
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
            {isPurchaseMgmt 
              ? "Manage purchase requests, track supplier invoicing, monitor active fulfillment stages, and verify budget limits."
              : "Audit raw material supply chains, evaluate vendor risk matrices, examine active RFQ contracts, and trigger automated stock provisions."
            }
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 rounded-xl p-0.5 border border-white/5 shrink-0 self-center">
          <button 
            onClick={() => setActiveTab('contracts')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'contracts' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            {isPurchaseMgmt ? "Purchase Orders" : "RFQ Contracts"}
          </button>
          <button 
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'vendors' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            {isPurchaseMgmt ? "Fulfillment Status" : "Vendor Registry"}
          </button>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="grid">
        {/* ── CENTRAL MATRIX GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* COLUMN 1 & 2: DATA GRID */}
          <div className="lg:col-span-2 bg-neutral-950/20 border border-white/5 p-4 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                {isPurchaseMgmt 
                  ? (activeTab === 'contracts' ? 'Active Purchase Orders' : 'Fulfillment Registry')
                  : (activeTab === 'contracts' ? 'Active RFQs' : 'Registered Vendors')
                }
              </span>
              {activeTab === 'contracts' && (
                <button 
                  onClick={() => alert(isPurchaseMgmt ? "Simulation: Opening PO Creation Drawer." : "Simulation: Opening RFQ Draft Drawer.")}
                  className="h-8 px-3 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus size={12} />
                  <span>{isPurchaseMgmt ? "Create PO" : "Draft RFQ"}</span>
                </button>
              )}
            </div>

            {isPurchaseMgmt ? (
              activeTab === 'contracts' ? (
                <EnterpriseDataGrid
                  data={contracts}
                  columns={contractColumns}
                  searchKeys={['item', 'vendorName', 'id']}
                  searchPlaceholder="Search purchase orders..."
                />
              ) : (
                <EnterpriseDataGrid
                  data={contracts.filter(c => c.status === 'Active')}
                  columns={contractColumns}
                  searchKeys={['item', 'vendorName', 'id']}
                  searchPlaceholder="Search active fulfillment..."
                />
              )
            ) : (
              activeTab === 'contracts' ? (
                <EnterpriseDataGrid
                  data={contracts}
                  columns={contractColumns}
                  searchKeys={['item', 'vendorName', 'id']}
                  searchPlaceholder="Search RFQ contracts..."
                />
              ) : (
                <EnterpriseDataGrid
                  data={vendors}
                  columns={vendorColumns}
                  searchKeys={['name', 'category', 'id']}
                  searchPlaceholder="Search vendor registry..."
                  rowActions={[
                    { label: 'Audit Risk', action: (row) => setSelectedVendorNode(row.name), icon: ShieldCheck }
                  ]}
                />
              )
            )}
          </div>

          {/* COLUMN 3: RIGHT PANEL (RISK MATRIX OR EXPENDITURE/GANTT CHARTS) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {isPurchaseMgmt ? (
              <>
                {/* Monthly Expenditures Stacked Bar */}
                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4 text-left">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers size={12} />
                      Monthly Expenditures
                    </span>
                  </div>
                  <div className="bg-neutral-950/20 border border-white/5 rounded-xl p-2.5">
                    <EnterpriseChart type="stackedBar" data={expenditureData} height="160px" colorTheme="rose" />
                  </div>
                  <p className="text-[10px] leading-relaxed text-white/50">
                    Expenditures broken down by raw materials, alloy sheets, and logistical dispatch costs.
                  </p>
                </div>

                {/* PO Fulfillment Gantt Tracks */}
                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4 text-left">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                      <Activity size={12} />
                      PO Fulfillment Tracks
                    </span>
                  </div>
                  <div className="bg-neutral-950/20 border border-white/5 rounded-xl p-2">
                    <EnterpriseChart type="gantt" data={ganttTracks} height="130px" />
                  </div>
                  <p className="text-[10px] leading-relaxed text-white/50">
                    Milestone tracks showing target delivery completion cycles.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4 text-left h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                      Supplier Risk Matrix
                    </span>
                  </div>
                  <div className="bg-neutral-950/20 border border-white/5 rounded-xl p-2.5">
                    <EnterpriseChart 
                      type="riskMatrix" 
                      data={riskData} 
                      height="220px" 
                      onNodeClick={(node) => setSelectedVendorNode(node.name)}
                    />
                  </div>

                  {/* Selected Vendor telemetry details panel */}
                  <div className="p-3.5 bg-white/3 border border-white/5 rounded-xl text-left space-y-2">
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block">Vendor Risk Coordinates Audit</span>
                    {selectedVendorNode ? (
                      <>
                        <div className="font-bold text-white text-xs">{selectedVendorNode}</div>
                        {(() => {
                          const match = vendors.find(v => v.name === selectedVendorNode);
                          if (!match) return null;
                          return (
                            <div className="space-y-1.5 text-[10px] text-white/60">
                              <div>Division Category: <strong className="text-white">{match.category}</strong></div>
                              <div>SLA Compliance Rate: <strong className="text-emerald-400 font-mono">{match.slaCompliance}%</strong></div>
                              <div>Risk Urgency Matrix: 
                                <span className={`ml-1 font-bold uppercase ${
                                  match.riskStatus === 'Low' ? 'text-emerald-400' : match.riskStatus === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                                }`}>
                                  {match.riskStatus} Risk
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    ) : (
                      <div className="text-[10px] text-white/30 italic">Click on any coordinate node or vendor in registry above to view telemetry metrics.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </WorkspaceStateWrapper>

    </div>
  );
}
