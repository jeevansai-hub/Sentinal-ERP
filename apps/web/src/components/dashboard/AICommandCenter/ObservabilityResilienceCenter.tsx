import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Cpu, Database, RefreshCw, Zap, Server } from 'lucide-react';

interface ServiceNode {
  id: string;
  name: string;
  status: 'Healthy' | 'Degraded' | 'Critical';
  latency: string;
  load: number;
}

const INITIAL_SERVICES: ServiceNode[] = [
  { id: "srv-api", name: "Gateway REST API Server", status: "Healthy", latency: "24ms", load: 12 },
  { id: "srv-db", name: "PostgreSQL Production DB Shard", status: "Healthy", latency: "4ms", load: 24 },
  { id: "srv-mq", name: "RabbitMQ Swarm Broker", status: "Healthy", latency: "11ms", load: 8 },
  { id: "srv-pay", name: "Axis Bank Payment Service", status: "Healthy", latency: "42ms", load: 14 }
];

export default function ObservabilityResilienceCenter() {
  const [services, setServices] = useState<ServiceNode[]>(INITIAL_SERVICES);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[Health Agent] Sentinel infrastructure scan completed. All systems reporting healthy.",
    "[Observability] Queue depths: 0. Database pool utilization: 8%.",
    "[Recovery Agent] Recovery cron active. Standby restart modules loaded."
  ]);
  const [healingProgress, setHealingProgress] = useState(0);
  const [isHealing, setIsHealing] = useState(false);

  const addLog = (log: string) => {
    setConsoleLogs(prev => [...prev.slice(-8), log]);
  };

  const triggerCrashSim = () => {
    if (isHealing) return;

    // Crash the Payment Service node
    setServices(prev => prev.map(s => 
      s.id === 'srv-pay' ? { ...s, status: 'Critical', latency: '999ms', load: 100 } : s
    ));
    
    addLog("[Health Agent] ALERT: Connectivity breach detected in srv-pay (Axis Bank Gateway). Response status code: 504.");
    addLog("[Health Agent] Triggering autonomous recovery swarm...");

    // Start self-healing progress after 1s
    setTimeout(() => {
      setIsHealing(true);
      setHealingProgress(10);
    }, 1200);
  };

  useEffect(() => {
    if (!isHealing) return;

    const interval = setInterval(() => {
      setHealingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsHealing(false);
          // Restore Payment Service node
          setServices(INITIAL_SERVICES);
          addLog("[Recovery Agent] Restarted api-payment-service instances successfully. Gateway synchronization restored.");
          addLog("[Health Agent] Standby diagnostics normal. System status: Healthy.");
          return 0;
        }

        if (prev === 30) {
          addLog("[Recovery Agent] Isolating failed payment channel queues. Instantiating container replica pool...");
        }
        if (prev === 70) {
          addLog("[Recovery Agent] Validated double-entry budget checks integrity with Finance Agent.");
        }

        return prev + 15;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isHealing]);

  return (
    <div className="p-6 space-y-6 text-left font-sans">
      
      {/* ── TOP DIAGNOSTICS ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Broker CPU Usage", val: "14.2%", desc: "Average across core", icon: Cpu, color: "text-emerald-500" },
          { label: "Message Queue depth", val: "0 Active", desc: "No congestion detected", icon: Zap, color: "text-purple-500" },
          { label: "PostgreSQL Pool", val: "12 / 100", desc: "Allocated connections", icon: Database, color: "text-blue-500" },
          { label: "Gateway API Latency", val: "24ms", desc: "Global average latency", icon: Activity, color: "text-emerald-500" }
        ].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="bg-neutral-950/40 backdrop-blur-md border border-white/5 p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider leading-none">{item.label}</span>
                <IconComp size={14} className={item.color} />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold font-mono tracking-tight text-white">{item.val}</div>
                <div className="text-[9px] text-white/30 font-medium mt-0.5 leading-none">{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Microservices grid */}
        <div className="lg:col-span-7 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 space-y-5 flex flex-col justify-between min-h-[400px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block font-mono">Resilience Monitor</span>
              <h3 className="text-xs font-bold text-white/95 mt-0.5">Microservice Instances Registry</h3>
            </div>
            <button 
              disabled={isHealing}
              onClick={triggerCrashSim}
              className={`h-8 px-3.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                isHealing 
                  ? 'bg-neutral-800 text-white/40 cursor-not-allowed border border-white/5' 
                  : 'bg-white text-black hover:bg-neutral-200 active:scale-95'
              }`}
            >
              <ShieldAlert size={12} fill={isHealing ? 'none' : 'black'} />
              <span>Simulate Payment Crash</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow content-center py-4">
            {services.map((s) => {
              const isCrit = s.status === 'Critical';
              return (
                <div 
                  key={s.id} 
                  className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                    isCrit 
                      ? 'bg-red-500/5 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]' 
                      : 'bg-white/3 border-white/5 hover:border-white/10'
                  }`}
                >
                  {isCrit && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 animate-pulse" />
                  )}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] font-bold font-mono text-white/30 uppercase tracking-widest leading-none block">{s.id}</span>
                      <h4 className="text-xs font-bold text-white/95 mt-1 leading-tight">{s.name}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
                        isCrit 
                          ? 'text-red-400 border-red-500/25 bg-red-500/5 animate-pulse' 
                          : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/5 pt-3 mt-3 text-white/40">
                    <span>Latency: <strong className={isCrit ? 'text-red-400' : 'text-white/70'}>{s.latency}</strong></span>
                    <span>Load: <strong className={isCrit ? 'text-red-400' : 'text-white/70'}>{s.load}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Self-Healing Progress Bar */}
          {isHealing && (
            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40 font-mono">Self-Healing Swarm Remediation Status:</span>
                <span className="font-bold text-purple-400 font-mono">{healingProgress}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${healingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Operations Recovery Console Logs */}
        <div className="lg:col-span-5 bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col justify-between min-h-[400px]">
          <div className="space-y-3 flex-1 flex flex-col justify-start">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Recovery Swarm Console</span>
              <span className="text-[9px] text-purple-400 font-mono font-bold">TTY SESSION</span>
            </div>

            <div className="bg-black/80 border border-white/5 p-4 rounded-xl flex-grow overflow-y-auto max-h-[260px] space-y-2 font-mono text-[9px] text-neutral-300 text-left leading-relaxed select-text select-all select-none scrollbar-none">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-purple-500 shrink-0 font-bold">$</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[9px] text-white/20 text-center border-t border-white/5 pt-3 font-mono">
            Observability Standard: OpenTelemetry Shards Integration
          </div>
        </div>

      </div>

    </div>
  );
}
