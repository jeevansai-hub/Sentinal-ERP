import { useState } from 'react';
import { 
  Settings, 
  ShieldAlert, 
  Globe 
} from 'lucide-react';

interface SettingsViewProps {
  user: any;
}

interface RolePermission {
  module: string;
  admin: 'Full' | 'Read' | 'None';
  manager: 'Full' | 'Read' | 'None';
  auditor: 'Full' | 'Read' | 'None';
  staff: 'Full' | 'Read' | 'None';
}

export default function SettingsView({ user: _user }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'iam' | 'integrations'>('iam');

  // IAM Role matrix database state
  const [permissions, setPermissions] = useState<RolePermission[]>([
    { module: 'Finance Ledger Accounts', admin: 'Full', manager: 'Full', auditor: 'Read', staff: 'None' },
    { module: 'Human Resource Payroll', admin: 'Full', manager: 'Full', auditor: 'None', staff: 'None' },
    { module: 'SCM Procurement RFQs', admin: 'Full', manager: 'Full', auditor: 'Read', staff: 'Read' },
    { module: 'Cyber Security Operations', admin: 'Full', manager: 'None', auditor: 'Read', staff: 'None' },
    { module: 'Agentic AI Workflows', admin: 'Full', manager: 'Read', auditor: 'Read', staff: 'Read' }
  ]);

  // Integrations state
  const [integrations, setIntegrations] = useState([
    { id: 'int-1', name: 'Axis Bank Sync Gateway', desc: 'Direct ledger matching and payroll disbursement routing.', active: true },
    { id: 'int-2', name: 'Tata Steel vendor API', desc: 'SCM raw material stock procurement automated logs.', active: true },
    { id: 'int-3', name: 'Slack Alerts Dispatcher', desc: 'Sends SLA breach warnings to operations channel.', active: false },
    { id: 'int-4', name: 'Firebase security telemetry', desc: 'IP access records audits for compliance matrices.', active: true }
  ]);

  // Toggle permission level mock cycle
  const cyclePermission = (moduleName: string, role: 'admin' | 'manager' | 'auditor' | 'staff') => {
    const levels: ('Full' | 'Read' | 'None')[] = ['Full', 'Read', 'None'];
    setPermissions(prev => prev.map(p => {
      if (p.module === moduleName) {
        const currentVal = p[role];
        const idx = levels.indexOf(currentVal);
        const nextVal = levels[(idx + 1) % levels.length];
        return { ...p, [role]: nextVal };
      }
      return p;
    }));
  };

  // Toggle integration state
  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => int.id === id ? { ...int, active: !int.active } : int));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left view-accent-settings">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <Settings className="text-white h-5 w-5 animate-pulse" />
            Configuration Studio &amp; IAM
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
            Calibrate enterprise-level workspace options. Customize role permissions matrices, configure external API integrations, and inspect organizational parameters.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 rounded-xl p-0.5 border border-white/5 shrink-0 self-center">
          <button 
            onClick={() => setActiveTab('iam')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'iam' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            IAM Permissions Matrix
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'integrations' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Marketplace Integrations
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE SECURITY WORKSPACE ── */}
      {activeTab === 'iam' && (
        <div className="space-y-4 max-w-5xl mx-auto">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert size={12} />
              IAM Roles Permissions Matrix
            </span>
            <span className="text-[9px] text-white/50 bg-white/3 border border-white/5 px-2 py-0.5 rounded">
              Interactive Grid: Click levels to cycle permissions
            </span>
          </div>

          {/* IAM Role grid Table */}
          <div className="bg-neutral-950/40 border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/3 text-[10px] text-white/45 uppercase tracking-wider font-bold">
                    <th className="p-4">ERP Module Node</th>
                    <th className="p-4 text-center">Administrator</th>
                    <th className="p-4 text-center">Executive Manager</th>
                    <th className="p-4 text-center">Auditor Controller</th>
                    <th className="p-4 text-center">Staff Associate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {permissions.map(perm => (
                    <tr key={perm.module} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 font-semibold text-white/90">{perm.module}</td>
                      
                      {/* Admin cell */}
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => cyclePermission(perm.module, 'admin')}
                          className={`px-3 py-1 rounded font-mono font-bold text-[10px] transition-colors cursor-pointer ${
                            perm.admin === 'Full' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : perm.admin === 'Read' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-white/30'
                          }`}
                        >
                          {perm.admin}
                        </button>
                      </td>

                      {/* Manager cell */}
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => cyclePermission(perm.module, 'manager')}
                          className={`px-3 py-1 rounded font-mono font-bold text-[10px] transition-colors cursor-pointer ${
                            perm.manager === 'Full' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : perm.manager === 'Read' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-white/30'
                          }`}
                        >
                          {perm.manager}
                        </button>
                      </td>

                      {/* Auditor cell */}
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => cyclePermission(perm.module, 'auditor')}
                          className={`px-3 py-1 rounded font-mono font-bold text-[10px] transition-colors cursor-pointer ${
                            perm.auditor === 'Full' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : perm.auditor === 'Read' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-white/30'
                          }`}
                        >
                          {perm.auditor}
                        </button>
                      </td>

                      {/* Staff cell */}
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => cyclePermission(perm.module, 'staff')}
                          className={`px-3 py-1 rounded font-mono font-bold text-[10px] transition-colors cursor-pointer ${
                            perm.staff === 'Full' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : perm.staff === 'Read' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-white/30'
                          }`}
                        >
                          {perm.staff}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-[10px] leading-relaxed text-white/50">
            <span className="text-white font-bold block mb-1">IAM Governance Sync:</span>
            Permission changes sync immediately with Firebase authentication modules. Role level validations are audited weekly according to standard SOC 2 protocols.
          </div>
        </div>
      )}

      {/* ── MARKETPLACE INTEGRATIONS ── */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {integrations.map(int => (
            <div 
              key={int.id}
              className="bg-neutral-950/40 border border-white/5 p-5 rounded-2xl text-left flex justify-between items-start gap-4 hover:border-white/10 transition-all"
            >
              <div className="space-y-2">
                <h4 className="font-semibold text-white/95 text-xs flex items-center gap-1.5">
                  <Globe size={13} className="text-white/60" />
                  {int.name}
                </h4>
                <p className="text-[10px] text-white/45 leading-relaxed">{int.desc}</p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleIntegration(int.id)}
                className={`h-5 w-9 rounded-full relative transition-all duration-300 cursor-pointer shrink-0 border border-white/10 ${
                  int.active ? 'bg-white' : 'bg-black'
                }`}
              >
                <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all duration-300 ${
                  int.active ? 'left-4.5 bg-black' : 'left-0.5 bg-white/60'
                }`} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
