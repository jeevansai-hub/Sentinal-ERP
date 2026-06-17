import { useState, useMemo, Fragment } from 'react';
import { 
  Shield, 
  Search, 
  Lock 
} from 'lucide-react';

interface SecurityViewProps {
  user: any;
}

interface TelemetryLog {
  id: string;
  ipAddress: string;
  location: string;
  device: string;
  timestamp: string;
  status: 'Approved' | 'Blocked' | 'MFA Challenged';
  severity: 'Low' | 'Medium' | 'Critical';
}

export default function SecurityView({ user: _user }: SecurityViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Telemetry logs database state
  const [logs, setLogs] = useState<TelemetryLog[]>([
    { id: 'LOG-4091', ipAddress: '103.88.22.14', location: 'Mumbai, IN', device: 'Chrome / Windows 10', timestamp: '2026-06-11 13:02:15', status: 'Approved', severity: 'Low' },
    { id: 'LOG-4092', ipAddress: '198.51.100.42', location: 'Frankfurt, DE', device: 'Mozilla / Linux Gateway 4', timestamp: '2026-06-11 12:45:00', status: 'Blocked', severity: 'Critical' },
    { id: 'LOG-4093', ipAddress: '203.0.113.119', location: 'San Jose, US', device: 'Safari / macOS 12', timestamp: '2026-06-11 12:30:12', status: 'MFA Challenged', severity: 'Medium' },
    { id: 'LOG-4094', ipAddress: '103.88.22.15', location: 'Mumbai, IN', device: 'Chrome / Android 13', timestamp: '2026-06-11 12:12:05', status: 'Approved', severity: 'Low' },
    { id: 'LOG-4095', ipAddress: '185.220.101.4', location: 'Unknown (Tor Exit)', device: 'Firefox / Linux', timestamp: '2026-06-11 11:55:30', status: 'Blocked', severity: 'Critical' }
  ]);

  // IP block simulator
  const handleToggleBlock = (id: string) => {
    setLogs(prev => prev.map(log => {
      if (log.id === id) {
        const nextStatus = log.status === 'Blocked' ? 'Approved' : 'Blocked';
        return { ...log, status: nextStatus };
      }
      return log;
    }));
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = log.ipAddress.includes(searchQuery) || 
                          log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.device.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSeverity = selectedSeverity === 'All' || log.severity === selectedSeverity;
      return matchSearch && matchSeverity;
    });
  }, [logs, searchQuery, selectedSeverity]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left view-accent-security">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <Shield className="text-white h-5 w-5 animate-pulse" />
            Cybersecurity Operations Center
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
            Live secure gateway telemetry. Monitor incoming connection logs, audit suspicious IP nodes, block potential threat vector contexts, and review firewall parameters.
          </p>
        </div>

        {/* Global Security Metrics */}
        <div className="flex gap-4 self-center shrink-0">
          <div className="text-right border-r border-white/10 pr-4">
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Gateway Threats Detected</div>
            <div className="text-sm font-bold text-rose-400 mt-0.5">
              {logs.filter(l => l.status === 'Blocked').length} Neutralized
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Security Sync status</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              100% Secure
            </div>
          </div>
        </div>
      </div>

      {/* ── LOG TELEMETRY INTERACTION MATRIX ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* COLUMN 1, 2 & 3: IP ACCESS DATABASES */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:max-w-xs text-left">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter IP or device log..."
                className="w-full h-9 pl-9 pr-4 text-xs bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
              />
              <div className="absolute left-3 top-2.5 text-white/30">
                <Search size={13} />
              </div>
            </div>

            <div className="flex bg-white/3 border border-white/5 rounded-lg p-0.5 w-full sm:w-auto shrink-0 justify-end">
              {['All', 'Low', 'Medium', 'Critical'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedSeverity(level)}
                  className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedSeverity === level ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed logs table grid */}
          <div className="bg-neutral-950/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/3 text-[10px] text-white/45 uppercase tracking-wider font-bold">
                    <th className="p-3.5">IP Gateway Node</th>
                    <th className="p-3.5">Geographical Node</th>
                    <th className="p-3.5">Access Timestamp</th>
                    <th className="p-3.5">Severity</th>
                    <th className="p-3.5 text-right">Firewall Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLogs.map(log => {
                    const isExpanded = expandedLogId === log.id;
                    
                    return (
                      <Fragment key={log.id}>
                        <tr 
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="hover:bg-white/[0.01] transition-colors cursor-pointer"
                        >
                          <td className="p-3.5 font-semibold text-white font-mono">
                            {log.ipAddress}
                            <span className="text-[9px] text-white/40 block font-normal font-sans">{log.device}</span>
                          </td>
                          <td className="p-3.5 text-white/70">{log.location}</td>
                          <td className="p-3.5 font-mono text-white/40">{log.timestamp}</td>
                          <td className="p-3.5">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              log.severity === 'Critical' 
                                ? 'border-rose-500/20 bg-rose-500/10 text-rose-400 animate-pulse' 
                                : log.severity === 'Medium'
                                ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                                : 'border-white/10 bg-white/5 text-white/50'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleBlock(log.id);
                              }}
                              className={`px-2.5 py-1 text-[9px] font-bold rounded cursor-pointer transition-colors ${
                                log.status === 'Blocked' 
                                  ? 'bg-rose-500 text-white hover:bg-rose-600' 
                                  : 'bg-white text-black hover:bg-neutral-200'
                              }`}
                            >
                              {log.status === 'Blocked' ? 'Unblock' : 'Block IP'}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded detail section mock payload metadata */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={5} className="p-4 bg-white/[0.01] text-[10px] leading-relaxed border-t border-white/5 text-white/60">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-white/30 uppercase font-bold text-[8px] block">Browser Client Payload</span>
                                  <code className="text-white/80 block font-mono bg-neutral-900 p-2 rounded border border-white/5">{log.device}</code>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-white/30 uppercase font-bold text-[8px] block">Node Session Status</span>
                                  <div>
                                    Authentication Status: 
                                    <strong className={`ml-1 ${log.status === 'Approved' ? 'text-emerald-400' : log.status === 'Blocked' ? 'text-rose-400' : 'text-amber-400'}`}>
                                      {log.status}
                                    </strong>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-white/30 italic">
                        No telemetry logs synced under this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* COLUMN 4: FIREWALL CONTROLS & SECURITY GUIDELINES (RIGHT) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <Lock size={12} />
              SOC Compliance Matrix
            </span>
          </div>

          <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="space-y-3 text-xs text-left">
              <div className="space-y-1 bg-white/3 p-3 rounded-xl border border-white/5">
                <span className="text-emerald-400 font-bold block text-[10px]">✔ MFA Enforcement</span>
                <p className="text-[9px] text-white/50 leading-relaxed mt-0.5">Dual-factor OAuth validations active across all corporate finance gateways.</p>
              </div>
              <div className="space-y-1 bg-white/3 p-3 rounded-xl border border-white/5">
                <span className="text-emerald-400 font-bold block text-[10px]">✔ TLS 1.3 Sync</span>
                <p className="text-[9px] text-white/50 leading-relaxed mt-0.5">Encrypted connection gateways fully active with zero expired handshakes.</p>
              </div>
              <div className="space-y-1 bg-white/3 p-3 rounded-xl border border-white/5">
                <span className="text-emerald-400 font-bold block text-[10px]">✔ SOC 2 Policy sync</span>
                <p className="text-[9px] text-white/50 leading-relaxed mt-0.5">Access control audits synced to compliance database templates automatically.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
