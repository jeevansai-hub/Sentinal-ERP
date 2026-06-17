import { useState } from 'react';
import { motion } from 'framer-motion';
import EnterpriseChart from '../common/EnterpriseChart';
import { 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  ArrowUpRight,
  Send,
  AlertOctagon,
  Shield,
  Zap,
  CheckCircle,
  Activity,
  Layers
} from 'lucide-react';

interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  orgName?: string;
  industry?: string;
}

interface HomeViewProps {
  user: UserSession | null;
  setAiPanelOpen: (open: boolean) => void;
}

export default function HomeView({ user, setAiPanelOpen }: HomeViewProps) {
  const [activeMetricTab, setActiveMetricTab] = useState<'revenue' | 'efficiency'>('revenue');
  const [aiCommandInput, setAiCommandInput] = useState('');
  const [aiCommandResponse, setAiCommandResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const revenueChartData = [
    { name: 'Nov', value: 13000000, compareValue: 12000000 },
    { name: 'Dec', value: 15000000, compareValue: 14000000 },
    { name: 'Jan', value: 18000000, compareValue: 16500000 },
    { name: 'Feb', value: 22000000, compareValue: 20000000 },
    { name: 'Mar', value: 21000000, compareValue: 23000000 },
    { name: 'Apr', value: 32000000, compareValue: 28000000 },
    { name: 'May', value: 39000000, compareValue: 34000000 }
  ];

  const efficiencyChartData = [
    { name: 'Nov', value: 85, compareValue: 80 },
    { name: 'Dec', value: 90, compareValue: 82 },
    { name: 'Jan', value: 88, compareValue: 84 },
    { name: 'Feb', value: 92, compareValue: 86 },
    { name: 'Mar', value: 91, compareValue: 88 },
    { name: 'Apr', value: 95, compareValue: 90 },
    { name: 'May', value: 96, compareValue: 92 }
  ];

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  // Executive Metrics Matrix
  const executiveMetrics = [
    { label: 'Corporate MTD Revenue', val: '₹4.20Cr', trend: '+14.2%', prev: 'vs last month', forecast: '₹4.55Cr (Q2 est)', type: 'up' },
    { label: 'Operating Net Margin', val: '28.6%', trend: '+3.2%', prev: 'vs last month', forecast: '29.1% (est)', type: 'up' },
    { label: 'Quarterly Expenditures', val: '₹1.12Cr', trend: '-2.4%', prev: 'vs target', forecast: '₹1.08Cr (target)', type: 'down' },
    { label: 'Active Staff Headcount', val: '1,284', trend: '+12 hires', prev: 'this month', forecast: '1,310 (forecast)', type: 'up' },
    { label: 'Inventory Assets Health', val: '96.2%', trend: 'Optimal', prev: 'in all hubs', forecast: '98.0% (target)', type: 'up' },
    { label: 'Cyber Security Operations', val: '0 Active Threats', trend: 'Secure', prev: 'All IP gateways active', forecast: 'SOC 2 compliant', type: 'up' }
  ];

  // Org Health map telemetry
  const departmentHealth = [
    { name: 'Finance & Accounts', health: 98, status: 'Optimal', activity: 'Ledger Audit Sync complete', risk: 'Low' },
    { name: 'Human Resources', health: 94, status: 'Optimal', activity: 'Finalizing June Payroll registry', risk: 'Low' },
    { name: 'Supply Chain & SCM', health: 82, status: 'Warning', activity: 'Reorder triggered for SKU-2847', risk: 'Medium' },
    { name: 'Sales & CRM', health: 95, status: 'Optimal', activity: 'New enterprise client onboarded', risk: 'Low' },
    { name: 'Identity & Security', health: 88, status: 'Alert', activity: 'Suspicious IP blocked on gateway Node 4', risk: 'Medium' },
    { name: 'Compliance & Audits', health: 100, status: 'Optimal', activity: 'SOC 2 renewal mapping verified', risk: 'Low' }
  ];

  // Live activities
  const activities = [
    { id: 1, event: "Invoice SN-INV-1092 generated for Reliance Retail", dept: "Finance", time: "Just now" },
    { id: 2, event: "SLA alert: CFO approval pending for Purchase Request PO-991", dept: "Procurement", time: "12m ago" },
    { id: 3, event: "Completed onboarding workflow for 4 Engineering hires", dept: "HRMS", time: "30m ago" },
    { id: 4, event: "SKU-2847 restock purchase order dispatched to Supplier B", dept: "Inventory", time: "1h ago" }
  ];

  const handleAICommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCommandInput.trim()) return;

    setAiLoading(true);
    setAiCommandResponse(null);
    
    setTimeout(() => {
      setAiLoading(false);
      const query = aiCommandInput.toLowerCase();
      if (query.includes('revenue') || query.includes('sales')) {
        setAiCommandResponse("AI Projection: Revenue is on track to hit ₹4.55Cr in Q2, driven by a 14.2% month-on-month expansion in the manufacturing vertical. No significant financial bottlenecks are forecasted.");
      } else if (query.includes('risk') || query.includes('warning') || query.includes('sla')) {
        setAiCommandResponse("AI Risk Report: 1 SLA Warning found. Purchase Order PO-991 (Office Equipments, ₹3.20L) has exceeded the 48-hour approval threshold. Recommendation: escalate automatically to VP Operations.");
      } else if (query.includes('hire') || query.includes('hr')) {
        setAiCommandResponse("AI HR Insight: 12 hires completed this quarter with a utilization rate of 91.3%. June payroll database calibration matches SOC 2 safety targets.");
      } else {
        setAiCommandResponse("AI Command executed successfully. Workspace operational databases are fully synced with zero compliance warnings. Recommended action: maintain active stock thresholds.");
      }
    }, 1000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left view-accent-home">
      
      {/* ── MISSION CONTROL HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5 text-left">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <Activity className="text-white h-5 w-5 animate-pulse" />
            Executive Command Center
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
            Sentinel mission operations are active. Workspace: <strong className="text-white">{user?.orgName || 'Sentinel Cloud'}</strong> • Industry focus: <strong className="text-white">{user?.industry || 'General Enterprise'}</strong>.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs font-semibold text-white/70">{currentDate}</div>
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">SLA SYNC STATUS: 100% ONLINE</div>
        </div>
      </div>

      {/* AI Daily Briefing Banner */}
      <div className="bg-white/3 border border-white/5 rounded-2xl p-5 text-left flex flex-col md:flex-row items-start gap-4 relative overflow-hidden">
        <div className="absolute right-3 top-3 text-white/5">
          <Sparkles size={40} className="animate-pulse" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-white/10">
          <Sparkles size={16} className="text-black" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">AI Operations Intelligence Briefing</span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            <span className="text-[9px] font-semibold text-amber-300 border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 rounded">Action Recommended</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed max-w-3xl">
            Autonomous audit scans report safe stock level drops in SCM unit (SKU-2847). We suggest initiating a procurement RFQ with Tata Manufacturing. Security operations successfully neutralized 1 gateway IP threat log on gateway Node 4.
          </p>
          <div className="flex items-center gap-4 pt-1">
            <button 
              onClick={() => setAiPanelOpen(true)}
              className="text-[10px] font-bold text-white hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Launch AI Audits Drawer</span>
              <ArrowRight size={10} />
            </button>
          </div>
        </div>
      </div>

      {/* ── DATA-RICH STRATEGIC METRICS MATRIX ── */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {executiveMetrics.map((metric, i) => (
          <motion.div 
            key={i}
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
            }}
            whileHover={{ 
              y: -4, 
              borderColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.8), 0 0 15px rgba(255,255,255,0.01)'
            }}
            className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 text-left space-y-4 transition-all cursor-pointer group premium-card"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{metric.label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                metric.type === 'up' 
                  ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' 
                  : 'border-rose-500/10 bg-rose-500/5 text-rose-400'
              }`}>
                {metric.trend}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight text-white group-hover:translate-x-0.5 transition-transform duration-200">{metric.val}</div>
              <div className="text-[10px] text-white/40">{metric.prev}</div>
            </div>

            <div className="border-t border-white/5 pt-3 flex items-center justify-between">
              <div className="text-[10px] text-white/50">
                Forecast: <strong className="text-white/80">{metric.forecast}</strong>
              </div>
              <ArrowUpRight size={12} className="text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── VISUAL FORECAST ENGINE & AI COMMAND CENTER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Forecast Engine (Filled Bands SVG Chart) */}
        <div className="lg:col-span-2 bg-neutral-950/40 border border-white/5 rounded-2xl p-5 text-left flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} />
                Corporate Performance &amp; Forecast Bands
              </h3>
              <p className="text-[10px] text-white/40">Visualized predictive cash flow and efficiency indices</p>
            </div>
            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
              <button 
                onClick={() => setActiveMetricTab('revenue')}
                className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                  activeMetricTab === 'revenue' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Revenue Flow
              </button>
              <button 
                onClick={() => setActiveMetricTab('efficiency')}
                className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                  activeMetricTab === 'efficiency' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Ops Efficiency
              </button>
            </div>
          </div>

          {/* SVG Custom Graph Line */}
          <div className="h-44 w-full relative">
            <EnterpriseChart 
              type="forecast"
              data={activeMetricTab === 'revenue' ? revenueChartData : efficiencyChartData}
              height="176px"
              colorTheme={activeMetricTab === 'revenue' ? 'admin' : 'hr'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block font-bold">Estimated Q2 Limits</span>
              <div className="text-sm font-bold text-white">
                {activeMetricTab === 'revenue' ? '₹4.55Cr (+18.4%)' : '98.4% (Optimal)'}
              </div>
            </div>
            <div className="space-y-1 border-l border-white/5 pl-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block font-bold">Workspace Health Sync</span>
              <div className="text-sm font-bold text-emerald-400">100% Secure Node Active</div>
            </div>
          </div>
        </div>

        {/* AI Command Center Card */}
        <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 text-left flex flex-col justify-between space-y-4">
          <div className="space-y-1.5 border-b border-white/5 pb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-white" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Command Terminal</h3>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">Interrogate operational datasets using plain language queries.</p>
          </div>

          {/* AI Response output sandbox */}
          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 min-h-[140px] flex flex-col justify-center text-left">
            {aiLoading ? (
              <div className="flex items-center space-x-2 text-white/40 text-xs">
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></span>
                <span>Interrogating databases...</span>
              </div>
            ) : aiCommandResponse ? (
              <p className="text-xs text-white/80 leading-relaxed font-sans">{aiCommandResponse}</p>
            ) : (
              <p className="text-[11px] text-white/30 leading-relaxed italic">
                Ask a prompt like "predict next quarter growth" or "identify operational bottleneck risks".
              </p>
            )}
          </div>

          {/* Input block */}
          <form onSubmit={handleAICommandSubmit} className="flex gap-2">
            <input 
              type="text"
              value={aiCommandInput}
              onChange={(e) => setAiCommandInput(e.target.value)}
              placeholder="Query ledgers or workforce..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-white/20 focus:ring-1 focus:ring-white/10 h-9"
            />
            <button 
              type="submit"
              className="h-9 w-9 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center shrink-0 cursor-pointer border border-white/10"
            >
              <Send size={12} />
            </button>
          </form>
        </div>

      </div>

      {/* ── LIVE DEPARTMENTS HEALTH MAP & ACTIVITY FEED ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Map Panel */}
        <div className="lg:col-span-2 bg-neutral-950/40 border border-white/5 rounded-2xl p-5 text-left space-y-4">
          <div className="space-y-1 border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live System Health telemetry</h3>
            <p className="text-[10px] text-white/40">Real-time status grid of active business modules</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departmentHealth.map((dept, i) => (
              <div 
                key={i} 
                className="p-3 bg-white/3 border border-white/5 rounded-xl flex items-center justify-between text-left hover:border-white/10 transition-colors"
              >
                <div className="space-y-1 truncate">
                  <div className="text-xs font-semibold text-white/90 truncate">{dept.name}</div>
                  <div className="text-[9px] text-white/40 truncate flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      dept.status === 'Optimal' ? 'bg-emerald-400' : dept.status === 'Warning' ? 'bg-amber-400' : 'bg-rose-500'
                    }`}></span>
                    <span>{dept.activity}</span>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-white">{dept.health}%</div>
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    dept.risk === 'Low' 
                      ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400' 
                      : 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                  }`}>
                    {dept.risk} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Activity Feed Panel */}
        <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 text-left flex flex-col justify-between space-y-4">
          <div className="space-y-1 border-b border-white/5 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Workspace Activity Feed</h3>
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
            </div>
            <p className="text-[10px] text-white/40">Live ticking log of enterprise actions</p>
          </div>

          <div className="flex-1 space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
            {activities.map(act => (
              <div key={act.id} className="flex items-start gap-3 text-left">
                <div className="h-6 w-1 bg-white/10 shrink-0 mt-0.5"></div>
                <div className="space-y-0.5">
                  <p className="text-xs text-white/70 leading-relaxed font-sans">{act.event}</p>
                  <div className="flex items-center gap-2 text-[9px] text-white/45">
                    <span className="font-semibold uppercase">{act.dept}</span>
                    <span>•</span>
                    <span className="font-mono">{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── STRATEGIC DECISION RECOMMENDATIONS ── */}
      <div className="space-y-4 text-left">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
          <Sparkles size={14} className="text-white/70 animate-pulse" />
          <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest">Recommended Actions Matrix</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          
          <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-4 text-left relative overflow-hidden hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">SCM Optimization</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                Save ₹4,20,000
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white flex items-center gap-1">
                <Zap size={11} className="text-amber-400" />
                Consolidate Supplier Contracts
              </h4>
              <p className="text-[10px] text-white/50 leading-relaxed font-sans">Combine pending purchase orders for SKU-2847 and SKU-990 to unlock batch discounts.</p>
            </div>
            <div className="pt-2 flex justify-between items-center text-[10px]">
              <span className="text-white/40">Confidence Index: <strong className="text-white/80">94%</strong></span>
              <button className="text-white hover:underline flex items-center gap-0.5 font-bold cursor-pointer">
                <span>Apply Advice</span>
                <ChevronRight size={10} />
              </button>
            </div>
          </div>

          <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-4 text-left relative overflow-hidden hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Workforce Planning</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-400">
                High Impact
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white flex items-center gap-1">
                <CheckCircle size={11} className="text-emerald-400" />
                Redistribute Operations Staff
              </h4>
              <p className="text-[10px] text-white/50 leading-relaxed font-sans">Move 3 staff members from Backlog to Q3 Budget Review to clear pending milestone delays.</p>
            </div>
            <div className="pt-2 flex justify-between items-center text-[10px]">
              <span className="text-white/40">Confidence Index: <strong className="text-white/80">88%</strong></span>
              <button className="text-white hover:underline flex items-center gap-0.5 font-bold cursor-pointer">
                <span>Re-assign Staff</span>
                <ChevronRight size={10} />
              </button>
            </div>
          </div>

          <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-4 text-left relative overflow-hidden hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Security Audit</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400">
                Action Required
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white flex items-center gap-1">
                <AlertOctagon size={11} className="text-rose-400" />
                Enforce Access Key Rotation
              </h4>
              <p className="text-[10px] text-white/50 leading-relaxed font-sans">Enforce credentials update for active VPN operators since a gateway IP threat log was flagged.</p>
            </div>
            <div className="pt-2 flex justify-between items-center text-[10px]">
              <span className="text-white/40">Confidence Index: <strong className="text-white/80">99%</strong></span>
              <button className="text-white hover:underline flex items-center gap-0.5 font-bold cursor-pointer">
                <Shield size={10} />
                <span>Audit IP Nodes</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
