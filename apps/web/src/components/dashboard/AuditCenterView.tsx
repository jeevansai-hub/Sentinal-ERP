import { useState } from 'react';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';
import EnterpriseChart from '../common/EnterpriseChart';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import { Shield } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  severity: 'Critical' | 'High' | 'Normal';
  ipAddress: string;
}

export default function AuditCenterView() {
  const [loading] = useState(false);
  const [logs] = useState<AuditLog[]>([
    { id: '1', timestamp: '2026-06-11 15:20:10', actor: 'Elena Rostova', action: 'Modified Engineering budget allocations', severity: 'High', ipAddress: '192.168.10.15' },
    { id: '2', timestamp: '2026-06-11 14:10:05', actor: 'Sanjay Dutt', action: 'Dispatched custom shipment requisition Override', severity: 'Critical', ipAddress: '10.0.4.88' },
    { id: '3', timestamp: '2026-06-11 11:05:40', actor: 'Amit Sharma', action: 'Authorized Asset Purchase: SKU-482', severity: 'High', ipAddress: '192.168.10.24' },
    { id: '4', timestamp: '2026-06-11 09:30:15', actor: 'System Daemon', action: 'Completed scheduled accounts ledger indexing cron', severity: 'Normal', ipAddress: 'localhost' }
  ]);

  const riskData = [
    { name: 'Node-1 (Gateway Access)', value: 80, x: 25, y: 70, riskStatus: 'High' as const },
    { name: 'Node-2 (Financial Ledgers)', value: 20, x: 10, y: 30, riskStatus: 'Low' as const },
    { name: 'Node-3 (SCM Shipping API)', value: 50, x: 65, y: 45, riskStatus: 'Medium' as const }
  ];

  const columns = [
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    { key: 'actor', label: 'Operator Actor', sortable: true },
    { key: 'action', label: 'Audit Command Action', sortable: true },
    { key: 'ipAddress', label: 'Gateway Node IP', sortable: true },
    {
      key: 'severity',
      label: 'Security Severity',
      sortable: true,
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
          val === 'Critical'
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
            : val === 'High'
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-white/5 text-white/40 border border-white/10'
        }`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 view-accent-audit">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Shield size={12} />
            <span>Executive Intelligence Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Security & Audit Center</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            SOC compliance control deck. Verify immutable transaction logs, trace administrative role delegations, and view network threat vectors.
          </p>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="grid">
        
        {/* ── 2D COMPLIANCE HEATMAPS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          <div className="lg:col-span-2 bg-neutral-950/40 border border-white/5 p-4 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Network Risk Coordinates (2D Matrix)</span>
              <span className="text-[9px] text-rose-400 font-mono">1 Critical Alert</span>
            </div>
            <EnterpriseChart type="riskMatrix" data={riskData} height="200px" />
          </div>

          <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Compliance Index Scores</span>
              <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                Active compliance metrics calculated across regulatory domains.
              </p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/50">GDPR Privacy Act</span>
                  <span className="text-white font-bold">100% Secure</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/50">SOC-2 Type II Trust</span>
                  <span className="text-white font-bold">96.8% Compliant</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '96.8%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/50">ISO 27001 ISMS</span>
                  <span className="text-white font-bold">88.5% Checked</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '88.5%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECURITY EVENTS DATA GRID ── */}
        <div className="bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
          <EnterpriseDataGrid
            data={logs}
            columns={columns}
            searchKeys={['actor', 'action', 'ipAddress']}
            searchPlaceholder="Filter security audit logs..."
          />
        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
