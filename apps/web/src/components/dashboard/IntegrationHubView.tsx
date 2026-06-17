import { useState } from 'react';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import EnterpriseChart from '../common/EnterpriseChart';
import { Cpu, Power, CheckCircle, RefreshCw } from 'lucide-react';

interface IntegrationItem {
  id: string;
  name: string;
  category: 'Communication' | 'LLM Engines' | 'Identity' | 'DevOps';
  status: 'Connected' | 'Disconnected';
  pingMs: number;
}

export default function IntegrationHubView() {
  const [loading, setLoading] = useState(false);
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    { id: '1', name: 'OpenAI Enterprise Gateway', category: 'LLM Engines', status: 'Connected', pingMs: 120 },
    { id: '2', name: 'Okta IAM SSO Client', category: 'Identity', status: 'Connected', pingMs: 45 },
    { id: '3', name: 'Slack Hook Bot Notifications', category: 'Communication', status: 'Connected', pingMs: 95 },
    { id: '4', name: 'GitHub Code Repo Webhooks', category: 'DevOps', status: 'Disconnected', pingMs: 0 }
  ]);

  const networkNodes = [
    { name: 'Identity (Okta)', value: 100, x: 25, y: 30, color: '#3B82F6' },
    { name: 'LLM Node (OpenAI)', value: 100, x: 75, y: 30, color: '#10B981' },
    { name: 'Alerts (Slack)', value: 100, x: 25, y: 75, color: '#F59E0B' },
    { name: 'Code Hub (GitHub)', value: 100, x: 75, y: 75, color: '#EF4444' }
  ];

  const handleToggleStatus = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setIntegrations(prev => prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'Connected' ? 'Disconnected' : 'Connected';
          return {
            ...item,
            status: nextStatus,
            pingMs: nextStatus === 'Connected' ? 88 : 0
          };
        }
        return item;
      }));
      setLoading(false);
    }, 450);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Cpu size={12} />
            <span>Intelligence & Automation Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Integration Registry & API Connectors</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            AI Operating System middleware router. Manage third-party integrations, OAuth credentials, and monitor webhook ping latencies.
          </p>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="chart">
        
        {/* ── VISUAL CONNECTIONS NETWORK GRAPH ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          <div className="lg:col-span-2 bg-neutral-950/40 border border-white/5 p-4 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Active Communication Graph Network</span>
              <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle size={10} /> 3 Nodes Synced
              </span>
            </div>
            <EnterpriseChart type="network" data={networkNodes} height="200px" />
          </div>

          <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Latencies & Ping Check</span>
              <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                Response ping latencies checking gateway connection integrity.
              </p>
            </div>
            <div className="space-y-3 font-mono text-[10px]">
              {integrations.filter(i => i.status === 'Connected').map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-white/50">{item.name}</span>
                  <span className="text-emerald-400 font-bold">{item.pingMs}ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── API KEY REGISTRY GRID ── */}
        <div className="space-y-4 text-left">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider block">Integrations registry</span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map(item => (
              <div 
                key={item.id}
                className={`p-4 bg-neutral-950/40 border rounded-2xl flex justify-between items-center gap-4 transition-all ${
                  item.status === 'Connected' 
                    ? 'border-white/5 hover:border-white/10'
                    : 'border-rose-500/20 bg-rose-500/[0.01]'
                }`}
              >
                <div className="space-y-1 truncate text-left">
                  <div className="text-[8px] font-mono text-white/40 uppercase tracking-wider">{item.category}</div>
                  <div className="text-xs font-bold text-white truncate">{item.name}</div>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    item.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleStatus(item.id)}
                  className={`h-8 w-8 rounded-xl border border-white/5 hover:border-white/10 flex items-center justify-center cursor-pointer transition-colors ${
                    item.status === 'Connected' ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                  title={item.status === 'Connected' ? 'Disconnect API' : 'Connect API'}
                >
                  {item.status === 'Connected' ? <Power size={13} /> : <RefreshCw size={13} />}
                </button>
              </div>
            ))}
          </div>
        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
