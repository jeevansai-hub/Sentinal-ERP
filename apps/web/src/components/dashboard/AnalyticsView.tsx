import { useState, useMemo } from 'react';
import { 
  Search, 
  Layers, 
  Activity, 
  Plus, 
  Check, 
  X,
  PieChart 
} from 'lucide-react';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';
import EnterpriseChart from '../common/EnterpriseChart';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';

interface AnalyticsViewProps {
  user: any;
}

interface BiMetric {
  id: string;
  name: string;
  category: string;
  currentVal: string;
  trend: string;
  addedToGrid: boolean;
}

interface DepartmentComparison {
  id: number;
  name: string;
  healthIdx: number;
  slaBreachCount: number;
  budgetUtilization: number;
  riskCoefficient: number;
}

export default function AnalyticsView({ user: _user }: AnalyticsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading] = useState(false);
  
  // Available BI KPI fields state
  const [metrics, setMetrics] = useState<BiMetric[]>([
    { id: '1', name: 'Corporate MTD Revenue Flow', category: 'Finance', currentVal: '₹4.20Cr', trend: '+14.2%', addedToGrid: true },
    { id: '2', name: 'Operating Margin Quotient', category: 'Finance', currentVal: '28.6%', trend: '+3.2%', addedToGrid: true },
    { id: '3', name: 'SLA Gateway Compliance sync', category: 'Operations', currentVal: '100%', trend: 'Optimal', addedToGrid: true },
    { id: '4', name: 'Identity Gateway Threats block', category: 'Security', currentVal: '0 Active', trend: 'Secure', addedToGrid: false },
    { id: '5', name: 'Average Lead Close Cycle', category: 'Sales', currentVal: '12 Days', trend: '-2.1d', addedToGrid: false },
    { id: '6', name: 'Headcount Utilization index', category: 'HRMS', currentVal: '91.3%', trend: '+1.5%', addedToGrid: false }
  ]);

  // Department comparative reports database
  const [deptComparisons] = useState<DepartmentComparison[]>([
    { id: 1, name: 'Finance & Corporate Accounts', healthIdx: 98, slaBreachCount: 0, budgetUtilization: 74, riskCoefficient: 0.12 },
    { id: 2, name: 'Human Resources & Payroll', healthIdx: 94, slaBreachCount: 0, budgetUtilization: 72, riskCoefficient: 0.15 },
    { id: 3, name: 'Supply Chain & SCM unit', healthIdx: 82, slaBreachCount: 1, budgetUtilization: 94, riskCoefficient: 0.38 },
    { id: 4, name: 'Sales Operations & CRM', healthIdx: 95, slaBreachCount: 0, budgetUtilization: 62, riskCoefficient: 0.18 },
    { id: 5, name: 'Identity, Gateways & Security', healthIdx: 88, slaBreachCount: 0, budgetUtilization: 44, riskCoefficient: 0.25 }
  ]);

  // Toggle metric card in visual BI grid dashboard
  const toggleMetric = (id: string) => {
    setMetrics(prev => prev.map(m => m.id === id ? { ...m, addedToGrid: !m.addedToGrid } : m));
  };

  const filteredMetrics = useMemo(() => {
    return metrics.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [metrics, searchQuery]);

  const columns = [
    { key: 'name', label: 'Department Node', sortable: true },
    {
      key: 'healthIdx',
      label: 'Health Index',
      sortable: true,
      render: (val: number) => (
        <span className={`font-bold ${val >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
          {val}%
        </span>
      )
    },
    {
      key: 'budgetUtilization',
      label: 'Budget Spent',
      sortable: true,
      render: (val: number) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-white/70">{val}%</span>
          <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden shrink-0">
            <div className="h-full bg-white" style={{ width: `${val}%` }} />
          </div>
        </div>
      )
    },
    {
      key: 'riskCoefficient',
      label: 'Risk Quotient',
      sortable: true,
      render: (val: number) => <span className="font-mono">{val.toFixed(2)}</span>
    },
    {
      key: 'slaBreachCount',
      label: 'SLA Breaches',
      sortable: true,
      render: (val: number) => (
        <span className={`font-bold ${val > 0 ? 'text-rose-400' : 'text-white/40'}`}>
          {val} Breaches
        </span>
      )
    }
  ];

  const radarData = [
    { name: 'Financial Allocations', value: 85, radarValues: [90, 80, 75, 85, 95], color: '#3B82F6' },
    { name: 'Operational Capacity', value: 65, radarValues: [70, 85, 80, 60, 70], color: '#10B981' }
  ];

  const radarLabels = ['Finance', 'Logistics', 'Operations', 'Governance', 'Fulfillment'];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left view-accent-analytics">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <PieChart className="text-white h-5 w-5 animate-pulse" />
            BI Analytics &amp; Custom Report Studio
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
            Simulate custom business dashboard configurations. Select KPI modules to compile operational panels and audit cross-department performance indices.
          </p>
        </div>

        {/* Global Summary */}
        <div className="flex gap-4 self-center shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Active BI Cards</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {metrics.filter(m => m.addedToGrid).length} / {metrics.length}
            </div>
          </div>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="chart">
        {/* ── BI BUILDER WORKSPACE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* COLUMN 1: BI METRICS CONSOLE LIST (LEFT) */}
          <div className="lg:col-span-1 bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Layers size={12} />
                BI Metrics Toolbox
              </span>
            </div>

            <div className="relative w-full text-left">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search BI toolbox fields..."
                className="w-full h-8 pl-8 pr-4 text-xs bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
              />
              <div className="absolute left-2.5 top-2 text-white/30">
                <Search size={12} />
              </div>
            </div>

            {/* KPI Toggles */}
            <div className="space-y-2 text-xs">
              {filteredMetrics.map(metric => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    metric.addedToGrid 
                      ? 'border-white/20 bg-white/10 text-white font-semibold' 
                      : 'border-white/5 text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="truncate font-medium">{metric.name}</div>
                    <span className="text-[8px] font-mono text-white/30 uppercase mt-0.5 block">{metric.category}</span>
                  </div>
                  
                  <span className="shrink-0 ml-2">
                    {metric.addedToGrid ? <Check size={12} strokeWidth={3} /> : <Plus size={12} />}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-[9px] leading-relaxed text-white/45 bg-white/3 border border-white/5 p-3 rounded-xl">
              Toggle metric nodes on the left toolbox. They will compile dynamically in the custom dashboard layout matrix on the right panel.
            </div>
          </div>

          {/* COLUMN 2, 3 & 4: DYNAMIC DASHBOARD MATRIX & COMPARATIVE REPORTS */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Dynamic Grid Layout */}
            <div className="space-y-3">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity size={12} />
                  Compiled Dashboard Matrix
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.filter(m => m.addedToGrid).map(metric => (
                  <div 
                    key={metric.id}
                    className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 text-left relative hover:border-white/10 transition-all group"
                  >
                    <button 
                      onClick={() => toggleMetric(metric.id)}
                      className="absolute top-3 right-3 text-white/20 hover:text-white/60 transition-colors text-xs cursor-pointer"
                      title="Remove from custom panel"
                    >
                      <X size={11} />
                    </button>

                    <div className="space-y-4">
                      <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{metric.name}</div>
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="text-2xl font-bold tracking-tight text-white font-mono">{metric.currentVal}</span>
                        <span className="text-[9px] font-bold text-emerald-400 font-mono">{metric.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {metrics.filter(m => m.addedToGrid).length === 0 && (
                  <div className="col-span-3 p-12 text-center text-white/30 italic border border-dashed border-white/5 rounded-2xl">
                    Dashboard canvas is empty. Select fields from the left BI metrics toolbox to compile metrics.
                  </div>
                )}
              </div>
            </div>

            {/* Visual Radar comparisons */}
            <div className="bg-neutral-950/40 border border-white/5 p-5 rounded-2xl text-left space-y-4">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Comparative Performance Profile Web</span>
              <EnterpriseChart type="radar" data={radarData} radarLabels={radarLabels} height="220px" />
            </div>

            {/* Department Comparative Audit Table */}
            <div className="space-y-3">
              <div className="bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
                <EnterpriseDataGrid
                  data={deptComparisons}
                  columns={columns}
                  searchKeys={['name']}
                  searchPlaceholder="Filter departments..."
                />
              </div>
            </div>

          </div>

        </div>
      </WorkspaceStateWrapper>

    </div>
  );
}
