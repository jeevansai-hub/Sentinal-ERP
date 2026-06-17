import { useState } from 'react';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import { Package, ShieldAlert } from 'lucide-react';

interface AssetItem {
  id: string;
  name: string;
  type: string;
  purchaseDate: string;
  cost: number;
  depreciatedVal: number;
  assignedTo: string;
  status: 'In Service' | 'Depreciated' | 'In Maintenance';
}

export default function AssetManagementView() {
  const [loading] = useState(false);
  const [assets, setAssets] = useState<AssetItem[]>([
    { id: 'AST-901', name: 'High-Density GPU Cluster A', type: 'Hardware', purchaseDate: '2025-01-15', cost: 1200000, depreciatedVal: 980000, assignedTo: 'AI Ops Team', status: 'In Service' },
    { id: 'AST-902', name: 'Executive Suite Office Chairs', type: 'Furniture', purchaseDate: '2023-08-20', cost: 150000, depreciatedVal: 45000, assignedTo: 'C-Suite HQ', status: 'Depreciated' },
    { id: 'AST-903', name: 'Core Router Edge Swivel', type: 'Networking', purchaseDate: '2024-11-02', cost: 680000, depreciatedVal: 610000, assignedTo: 'Engineering', status: 'In Service' },
    { id: 'AST-904', name: 'Warehouse Lift Truck Delta', type: 'Vehicles', purchaseDate: '2024-03-11', cost: 420000, depreciatedVal: 310000, assignedTo: 'SCM Log-A', status: 'In Maintenance' }
  ]);

  const columns = [
    { key: 'id', label: 'Asset ID', sortable: true },
    { key: 'name', label: 'Asset Label', sortable: true },
    { key: 'type', label: 'Category', sortable: true },
    { key: 'purchaseDate', label: 'Purchase Date', sortable: true },
    { 
      key: 'cost', 
      label: 'Initial Cost', 
      sortable: true,
      render: (val: number) => <span className="font-mono">₹{val.toLocaleString('en-IN')}</span>
    },
    { 
      key: 'depreciatedVal', 
      label: 'Current Book Value', 
      sortable: true,
      render: (val: number) => <span className="font-mono">₹{val.toLocaleString('en-IN')}</span>
    },
    { key: 'assignedTo', label: 'Custodian Unit', sortable: true },
    {
      key: 'status',
      label: 'Operational Status',
      sortable: true,
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
          val === 'In Service' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : val === 'In Maintenance'
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-white/5 text-white/40 border border-white/10'
        }`}>
          {val}
        </span>
      )
    }
  ];

  const handleAudit = (row: AssetItem) => {
    alert(`Initiating formal custodian audit flow for asset ${row.id} assigned to ${row.assignedTo}`);
  };

  const handleFlagMaintenance = (selected: AssetItem[]) => {
    setAssets(prev => prev.map(ast => {
      if (selected.some(s => s.id === ast.id)) {
        return { ...ast, status: 'In Maintenance' };
      }
      return ast;
    }));
    alert(`Sent request to transition ${selected.length} assets to maintenance backlog.`);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Package size={12} />
            <span>Financial Operations Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Asset Inventory & Depreciation</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            Data-dense ledger of core enterprise property. Record amortized values, custodian assignments, and active maintenance contracts.
          </p>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="grid">
        
        {/* ── DATA-DENSE GRID VIEW ── */}
        <div className="bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
          <EnterpriseDataGrid
            data={assets}
            columns={columns}
            searchKeys={['id', 'name', 'type', 'assignedTo']}
            searchPlaceholder="Filter assets by ID, name, or custodian..."
            bulkActions={[
              { label: 'Flag Selected for Maintenance', action: handleFlagMaintenance }
            ]}
            rowActions={[
              { label: 'Audit Custodian', action: handleAudit, icon: ShieldAlert }
            ]}
          />
        </div>

        {/* ── AMORTIZATION INFO BLOCK ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-2">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Gross Asset Capital</span>
            <div className="text-lg font-mono font-bold text-white">₹24,50,000</div>
            <p className="text-[10px] text-white/30 leading-normal">Cumulative purchase expenditure of all logged assets.</p>
          </div>
          <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-2">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Net Book Value</span>
            <div className="text-lg font-mono font-bold text-emerald-400">₹19,45,000</div>
            <p className="text-[10px] text-white/30 leading-normal">Remaining valuation after applying standard depreciation algorithms.</p>
          </div>
          <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-2">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Write-Off Total (YTD)</span>
            <div className="text-lg font-mono font-bold text-rose-400">₹5,05,000</div>
            <p className="text-[10px] text-white/30 leading-normal">Assets fully written-off or salvaged during the active fiscal term.</p>
          </div>
        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
