import { useState } from 'react';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import EnterpriseChart from '../common/EnterpriseChart';
import { Layers, Sparkles, Sliders, Calendar } from 'lucide-react';

export default function ReportStudioView() {
  const [loading, setLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [chartSource, setChartSource] = useState('Revenue');

  const lineData = [
    { name: 'Jan', value: 320000 },
    { name: 'Feb', value: 450000 },
    { name: 'Mar', value: 380000 },
    { name: 'Apr', value: 520000 },
    { name: 'May', value: 610000 },
    { name: 'Jun', value: 780000 }
  ];

  const handleCompile = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Custom compiled ${chartSource} forecast report successfully downloaded as ${selectedFormat}`);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 view-accent-reports">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Layers size={12} />
            <span>Executive Intelligence Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Interactive Report Studio</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            Corporate BI report builder. Select custom parameters, compile forecasts, and export certified records.
          </p>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="chart">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: BUILDER SETTINGS */}
          <div className="lg:col-span-4 bg-neutral-950/40 border border-white/5 p-5 rounded-2xl text-left space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Sliders size={14} className="text-white/40" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Parameters Control</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase font-bold">Data Feed Source</label>
                <select
                  value={chartSource}
                  onChange={(e) => setChartSource(e.target.value)}
                  className="w-full h-9 bg-white/5 border border-white/10 rounded-xl px-2 text-white outline-none focus:border-white/20"
                >
                  <option value="Revenue" className="bg-neutral-950">Corporate Sales Revenues</option>
                  <option value="Expenses" className="bg-neutral-950">Department Operational Spend</option>
                  <option value="Headcount" className="bg-neutral-950">Staff Recruitment Capacity</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase font-bold">Export Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {['PDF', 'CSV', 'XLSX'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`h-9 border rounded-xl font-mono text-[10px] font-bold cursor-pointer transition-all ${
                        selectedFormat === fmt
                          ? 'bg-white text-black border-white'
                          : 'bg-white/3 border-white/5 text-white/50 hover:bg-white/5'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase font-bold">Compilation Date Filter</label>
                <div className="h-9 bg-white/3 border border-white/5 rounded-xl px-3 flex items-center justify-between text-white/40">
                  <span className="text-[10px]">Active Fiscal Year 2026</span>
                  <Calendar size={13} />
                </div>
              </div>
            </div>

            <button
              onClick={handleCompile}
              className="w-full h-10 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Sparkles size={13} />
              <span>Compile & Export Report</span>
            </button>
          </div>

          {/* RIGHT COLUMN: PREVIEW GRAPH */}
          <div className="lg:col-span-8 bg-neutral-950/40 border border-white/5 p-6 rounded-2xl text-left space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">{chartSource} Forecast Trend (6-Month Band)</span>
              <span className="text-[9px] text-emerald-400 font-mono">Confidence Level 95%</span>
            </div>
            <EnterpriseChart type="line" data={lineData} height="220px" />
          </div>

        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
