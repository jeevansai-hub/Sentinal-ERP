import { useState } from 'react';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import { Database, FileText, CheckCircle2 } from 'lucide-react';

interface MasterRecord {
  id: string;
  name: string;
  category: 'Subsidiaries' | 'Cost Centers' | 'SKUs' | 'Suppliers';
  ownerCode: string;
  status: 'Validated' | 'Draft' | 'Deprecated';
}

export default function MDMView() {
  const [loading] = useState(false);
  const [records, setRecords] = useState<MasterRecord[]>([
    { id: 'MDM-001', name: 'Sentinel ERP EMEA Holding Ltd', category: 'Subsidiaries', ownerCode: 'CORP-EMEA', status: 'Validated' },
    { id: 'MDM-002', name: 'R&D Engineering Cost Center', category: 'Cost Centers', ownerCode: 'CC-ENG-04', status: 'Validated' },
    { id: 'MDM-003', name: 'Raw Silicon Feed Grade-A', category: 'SKUs', ownerCode: 'SKU-847', status: 'Draft' },
    { id: 'MDM-004', name: 'Summit Logistics Corp', category: 'Suppliers', ownerCode: 'VEN-LOG-01', status: 'Validated' },
    { id: 'MDM-005', name: 'APAC Sales & Operations Unit', category: 'Cost Centers', ownerCode: 'CC-SALES-02', status: 'Deprecated' }
  ]);

  const handleValidate = (row: MasterRecord) => {
    setRecords(prev => prev.map(rec => rec.id === row.id ? { ...rec, status: 'Validated' } : rec));
    alert(`Record ${row.id} has been validated and committed to Master database schema.`);
  };

  const handleBulkValidate = (selected: MasterRecord[]) => {
    setRecords(prev => prev.map(rec => {
      if (selected.some(s => s.id === rec.id)) {
        return { ...rec, status: 'Validated' };
      }
      return rec;
    }));
  };

  const columns = [
    { key: 'id', label: 'Record Key', sortable: true },
    { key: 'name', label: 'Entity Label / Name', sortable: true },
    { key: 'category', label: 'Domain Category', sortable: true },
    { key: 'ownerCode', label: 'Owner Code Prefix', sortable: true },
    {
      key: 'status',
      label: 'Schema Status',
      sortable: true,
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
          val === 'Validated'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : val === 'Draft'
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Database size={12} />
            <span>Financial Operations Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Master Data Management (MDM)</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            Data-dense catalog index. Define cost center hierarchies, subsidiary corporate nodes, and audit database schemas.
          </p>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="grid">
        
        {/* ── MDM REGISTRY GRID ── */}
        <div className="bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
          <EnterpriseDataGrid
            data={records}
            columns={columns}
            searchKeys={['id', 'name', 'ownerCode', 'category']}
            searchPlaceholder="Search master records by ID, label, or owner..."
            bulkActions={[
              { label: 'Re-validate Selected Schema', action: handleBulkValidate }
            ]}
            rowActions={[
              { label: 'Commit Schema', action: handleValidate, icon: CheckCircle2 }
            ]}
          />
        </div>

        {/* ── INFORMATION SCHEMAS CARD ── */}
        <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl text-left space-y-2">
          <div className="flex items-center gap-2 text-white/60 font-bold text-xs uppercase">
            <FileText size={14} className="text-white/40" />
            <span>Master Registry Schema Alignment</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">
            All records in the MDM system adhere to the secure corporate namespace guidelines. Changes propagate instantly to billing ledgers, SCM channels, and HR systems.
          </p>
        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
