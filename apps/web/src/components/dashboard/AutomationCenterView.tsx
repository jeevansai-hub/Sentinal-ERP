import { useState } from 'react';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import { Cpu, Play, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

interface AutomationBot {
  id: string;
  name: string;
  trigger: string;
  lastRun: string;
  status: 'Idle' | 'Running' | 'Failed';
  runsCount: number;
}

export default function AutomationCenterView() {
  const [loading, setLoading] = useState(false);
  const [bots, setBots] = useState<AutomationBot[]>([
    { id: 'BOT-01', name: 'Invoice Overdue Collector', trigger: 'Cron: Daily @ 08:00', lastRun: '2026-06-11 08:00', status: 'Idle', runsCount: 124 },
    { id: 'BOT-02', name: 'Inventory Replenishment Trigger', trigger: 'Event: Stock Threshold Breach', lastRun: '2026-06-11 14:32', status: 'Running', runsCount: 45 },
    { id: 'BOT-03', name: 'IAM Access Log Anomaly Auditor', trigger: 'Event: Out-of-Bounds User IP', lastRun: '2026-06-10 23:11', status: 'Failed', runsCount: 208 }
  ]);

  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Sentinel Automation Engine v3.0 initialized...',
    '[BOT-02] INVOKE: Stock level SKU-847 fell to 12% in Hub 3.',
    '[BOT-02] ACTION: Dispatched raw feed requisition to Procurement SCM.',
    '[BOT-03] ERROR: Unsigned TLS certificate rejected during Security Center audit check.',
    '[SYSTEM] Daemon listening for secure webhook payload events...'
  ]);

  const handleRunBot = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setBots(prev => prev.map(b => {
        if (b.id === id) {
          return {
            ...b,
            status: 'Running',
            lastRun: new Date().toISOString().replace('T', ' ').substring(0, 16),
            runsCount: b.runsCount + 1
          };
        }
        return b;
      }));
      setLogs(prev => [
        `[BOT-${id.split('-')[1]}] MANUAL TRIGGER: Initiating task flow execution...`,
        `[BOT-${id.split('-')[1]}] STATUS: Executing webhook nodes...`,
        ...prev
      ]);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="p-6 space-y-6 view-accent-automation">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Cpu size={12} />
            <span>Intelligence & Automation Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Automation Hub & Execution Log</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            AI Operating System control center. Dispatch daemon agents, configure event triggers, and audit runtime execution logs.
          </p>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="list">
        
        {/* ── BOT STATUS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {bots.map(bot => (
            <div 
              key={bot.id}
              className={`p-5 bg-neutral-950/40 border rounded-2xl flex flex-col justify-between h-44 transition-all ${
                bot.status === 'Running'
                  ? 'border-emerald-500/20 bg-emerald-500/[0.01]'
                  : bot.status === 'Failed'
                  ? 'border-rose-500/20 bg-rose-500/[0.01] animate-pulse'
                  : 'border-white/5 hover:border-white/12'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-white/40">{bot.id}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    bot.status === 'Running'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : bot.status === 'Failed'
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-white/5 text-white/40'
                  }`}>
                    {bot.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-white leading-snug">{bot.name}</div>
                <p className="text-[9px] text-white/40 leading-normal">Trigger: {bot.trigger}</p>
              </div>

              <div className="border-t border-white/5 pt-2.5 flex justify-between items-center text-[9px] font-mono text-white/35">
                <div>
                  <div>Runs: {bot.runsCount}</div>
                  <div>Last: {bot.lastRun}</div>
                </div>
                <button
                  onClick={() => handleRunBot(bot.id)}
                  disabled={bot.status === 'Running'}
                  className="h-7 w-7 bg-white text-black hover:bg-neutral-200 disabled:opacity-30 flex items-center justify-center rounded-lg cursor-pointer transition-all"
                  title="Trigger Bot Manual Run"
                >
                  <Play size={10} fill="#000" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── TERMINAL LOGS OUTPUT PANEL ── */}
        <div className="bg-neutral-950/60 border border-white/5 rounded-2xl p-5 text-left space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal size={13} className="text-white/40" />
              <span>Live System Execution Stream</span>
            </span>
            <button 
              onClick={() => setLogs([])}
              className="text-[9px] font-mono text-white/30 hover:text-white cursor-pointer transition-colors"
            >
              Clear Buffer
            </button>
          </div>

          <div className="h-44 overflow-y-auto font-mono text-[9px] leading-relaxed space-y-1.5 select-text">
            {logs.map((log, idx) => {
              const isError = log.includes('ERROR') || log.includes('Failed');
              const isSuccess = log.includes('Success') || log.includes('initialized') || log.includes('listening');
              
              return (
                <div key={idx} className="flex gap-2 items-start">
                  {isError ? (
                    <AlertCircle size={10} className="text-rose-500 mt-0.5 shrink-0" />
                  ) : isSuccess ? (
                    <CheckCircle2 size={10} className="text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <Terminal size={10} className="text-white/20 mt-0.5 shrink-0" />
                  )}
                  <span className={isError ? 'text-rose-400' : isSuccess ? 'text-emerald-400/80' : 'text-white/50'}>
                    {log}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
