import { useState } from 'react';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import EnterpriseChart from '../common/EnterpriseChart';
import { Cpu, Settings, Activity, Thermometer, Database } from 'lucide-react';

interface MachineItem {
  id: string;
  name: string;
  status: 'Operational' | 'Maintenance' | 'Fault';
  temp: number; // °C
  load: number;  // %
  uptime: string;
}

export default function ManufacturingView() {
  const [loading] = useState(false);
  const [machines, setMachines] = useState<MachineItem[]>([
    { id: '1', name: 'Automated Assembly Line A', status: 'Operational', temp: 42, load: 78, uptime: '99.8%' },
    { id: '2', name: 'Precision CNC Cutter Node B', status: 'Operational', temp: 58, load: 92, uptime: '98.5%' },
    { id: '3', name: 'Industrial Robotic Welder C', status: 'Maintenance', temp: 22, load: 0, uptime: '94.2%' },
    { id: '4', name: 'Core Raw Feed Injection D', status: 'Fault', temp: 85, load: 15, uptime: '88.1%' }
  ]);

  const scheduleData = [
    { name: 'Batch-A41 Production', value: 85, start: 0, duration: 3 },
    { name: 'Batch-B18 Laser Etching', value: 40, start: 2, duration: 4 },
    { name: 'Assembly Quality Run', value: 0, start: 5, duration: 2 }
  ];

  const handleReboot = (id: string) => {
    alert(`Dispatched warm reboot sequence to machine ID ${id}`);
    setMachines(prev => prev.map(m => m.id === id ? { ...m, status: 'Operational', temp: 38 } : m));
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HERO HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Cpu size={12} />
            <span>Operations & Supply Chain Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Manufacturing Control Tower</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            Real-time shop floor machine telemetry. Monitor line efficiencies, heat tolerances, and scheduling.
          </p>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="chart">
        
        {/* ── REAL-TIME MACHINE TELEMETRY CELLS ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          {machines.map(m => (
            <div 
              key={m.id} 
              className={`p-4 rounded-2xl border bg-neutral-950/40 space-y-3 flex flex-col justify-between ${
                m.status === 'Operational' 
                  ? 'border-white/5 hover:border-white/15' 
                  : m.status === 'Maintenance'
                  ? 'border-amber-500/20 bg-amber-500/[0.02]'
                  : 'border-rose-500/20 bg-rose-500/[0.02] animate-pulse'
              }`}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-white truncate">{m.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 ${
                    m.status === 'Operational' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : m.status === 'Maintenance'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <div className="text-[9px] font-mono text-white/35">Uptime: {m.uptime}</div>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-2.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-white/40 flex items-center gap-1"><Thermometer size={10} /> Core Temp</span>
                  <span className={`font-mono font-bold ${m.temp > 75 ? 'text-rose-400' : 'text-white'}`}>{m.temp}°C</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-white/40 flex items-center gap-1"><Activity size={10} /> Duty Load</span>
                  <span className="font-mono font-bold text-white">{m.load}%</span>
                </div>
              </div>

              {m.status !== 'Operational' && (
                <button
                  onClick={() => handleReboot(m.id)}
                  className="w-full mt-2 py-1.5 border border-white/10 hover:border-white/20 text-[9px] font-bold text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Settings size={10} />
                  <span>Sequencing Override</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── BATCH DURATIONS & SCHEDULING ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          <div className="lg:col-span-2 bg-neutral-950/40 border border-white/5 p-4 rounded-2xl space-y-4">
            <div>
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Production Batch Run Schedules</span>
              <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                Active product run timelines across the assembly line layout.
              </p>
            </div>
            <EnterpriseChart type="gantt" data={scheduleData} height="200px" />
          </div>

          <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Raw Material Feeds</span>
              <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                Reconciliation of raw materials inventory stored inside line hubs.
              </p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/50">Steel Alloys (Hub-1)</span>
                  <span className="text-white font-bold">84%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '84%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/50">Composite Plastics (Hub-2)</span>
                  <span className="text-white font-bold">38%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '38%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/50">Catalyst Gases (Hub-3)</span>
                  <span className="text-white font-bold">12%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
            <button className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/8 rounded-xl text-xs font-bold transition-all text-white flex items-center justify-center gap-1.5 cursor-pointer">
              <Database size={13} />
              <span>Dispense Stock Requisitions</span>
            </button>
          </div>

        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
