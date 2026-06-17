import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  Activity, 
  Network,
  Award,
  Layers
} from 'lucide-react';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';
import EnterpriseChart from '../common/EnterpriseChart';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';

interface CRMViewProps {
  user: any;
}

interface Deal {
  id: string;
  client: string;
  amount: number;
  stage: 'Lead' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Won';
  closeDate: string;
  owner: string;
  health: 'Optimal' | 'Warning' | 'At Risk';
}

export default function CRMView({ user: _user }: CRMViewProps) {
  const [loading] = useState(false);
  const [selectedHealthFilter, setSelectedHealthFilter] = useState<string>('All');
  const location = useLocation();
  const isSalesMgmt = location.pathname.includes('sales-mgmt');

  const salesGrowthData = [
    { name: 'Q1-25', value: 8500000, compareValue: 8000000 },
    { name: 'Q2-25', value: 12000000, compareValue: 11000000 },
    { name: 'Q3-25', value: 18500000, compareValue: 15000000 },
    { name: 'Q4-25', value: 24200000, compareValue: 22000000 },
    { name: 'Q1-26', value: 29000000, compareValue: 30000000 }
  ];

  const regionalSalesData = [
    { name: 'North Zone Refineries', value: 42, color: 'rgba(245, 158, 11, 0.15)' },
    { name: 'West Zone Metals', value: 28, color: 'rgba(59, 130, 246, 0.15)' },
    { name: 'South Corp Hubs', value: 18, color: 'rgba(16, 185, 129, 0.15)' },
    { name: 'East Grid Rails', value: 12, color: 'rgba(99, 102, 241, 0.15)' }
  ];

  const [deals, setDeals] = useState<Deal[]>([
    { id: 'DEAL-901', client: 'Reliance Industries', amount: 8500000, stage: 'Negotiation', closeDate: '2026-06-30', owner: 'Vikram Malhotra', health: 'Optimal' },
    { id: 'DEAL-902', client: 'Infosys Corp', amount: 4200000, stage: 'Proposal', closeDate: '2026-07-15', owner: 'Vikram Malhotra', health: 'Optimal' },
    { id: 'DEAL-903', client: 'HDFC Bank Ltd', amount: 12000000, stage: 'Lead', closeDate: '2026-08-01', owner: 'Aditi Rao', health: 'Warning' },
    { id: 'DEAL-904', client: 'Zomato Group', amount: 3100000, stage: 'Contacted', closeDate: '2026-06-25', owner: 'Priya Sharma', health: 'Optimal' },
    { id: 'DEAL-905', client: 'Tata Steel', amount: 15000000, stage: 'Won', closeDate: '2026-06-05', owner: 'Vikram Malhotra', health: 'Optimal' },
    { id: 'DEAL-906', client: 'Ola Electric', amount: 6200000, stage: 'Proposal', closeDate: '2026-07-20', owner: 'Alex Sterling', health: 'At Risk' }
  ]);

  const advanceStage = (id: string) => {
    const stages: Deal['stage'][] = ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won'];
    setDeals(prev => prev.map(deal => {
      if (deal.id === id) {
        const idx = stages.indexOf(deal.stage);
        const nextStage = idx < stages.length - 1 ? stages[idx + 1] : deal.stage;
        return { ...deal, stage: nextStage };
      }
      return deal;
    }));
  };

  const demoteStage = (id: string) => {
    const stages: Deal['stage'][] = ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won'];
    setDeals(prev => prev.map(deal => {
      if (deal.id === id) {
        const idx = stages.indexOf(deal.stage);
        const prevStage = idx > 0 ? stages[idx - 1] : deal.stage;
        return { ...deal, stage: prevStage };
      }
      return deal;
    }));
  };

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      return selectedHealthFilter === 'All' || deal.health === selectedHealthFilter;
    });
  }, [deals, selectedHealthFilter]);

  const pipelineMetrics = useMemo(() => {
    const totals = { Lead: 0, Contacted: 0, Proposal: 0, Negotiation: 0, Won: 0 };
    deals.forEach(deal => {
      totals[deal.stage] = totals[deal.stage] + deal.amount;
    });
    return totals;
  }, [deals]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const columns = [
    { 
      key: 'client', 
      label: 'Deal Client', 
      sortable: true,
      render: (_: any, row: Deal) => (
        <div>
          <span className="font-semibold text-white">{row.client}</span>
          <span className="text-[9px] text-white/40 block font-normal font-mono">{row.id}</span>
        </div>
      )
    },
    {
      key: 'stage',
      label: 'Pipeline Stage',
      sortable: true,
      render: (val: string) => (
        <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px]">
          {val}
        </span>
      )
    },
    { 
      key: 'amount', 
      label: 'Valuation Amount', 
      sortable: true,
      render: (val: number) => <span className="font-mono text-white/80">{formatINR(val)}</span>
    },
    { key: 'closeDate', label: 'Close Date', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true }
  ];

  const networkNodes = [
    { name: 'Reliance Industries', value: 100, x: 25, y: 30, color: '#10B981' },
    { name: 'Infosys Corp', value: 100, x: 75, y: 30, color: '#10B981' },
    { name: 'HDFC Bank Ltd', value: 100, x: 25, y: 75, color: '#FBBF24' },
    { name: 'Zomato Group', value: 100, x: 50, y: 75, color: '#3B82F6' },
    { name: 'Ola Electric', value: 100, x: 75, y: 75, color: '#EF4444' }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            {isSalesMgmt ? (
              <>
                <Award className="text-white h-5 w-5 animate-pulse" />
                Sales Performance &amp; Targets
              </>
            ) : (
              <>
                <TrendingUp className="text-white h-5 w-5 animate-pulse" />
                Revenue Command &amp; CRM Pipelines
              </>
            )}
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
            {isSalesMgmt 
              ? "Track sales target completion, regional team quotas, conversion velocities, and deal performance analytics."
              : "Live deal progression nodes, pipeline distribution analysis, customer relationship network topologies, and executive account assignments."
            }
          </p>
        </div>
        
        {/* KPI Summary Block */}
        <div className="flex gap-4 self-center shrink-0">
          <div className="text-right border-r border-white/10 pr-4">
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
              {isSalesMgmt ? "MTD Closed Quota" : "Total Pipeline Value"}
            </div>
            <div className="text-sm font-bold text-white mt-0.5 font-mono">
              {isSalesMgmt 
                ? formatINR(deals.filter(d => d.stage === 'Won').reduce((acc, curr) => acc + curr.amount, 0))
                : formatINR(deals.reduce((acc, curr) => acc + curr.amount, 0))
              }
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
              {isSalesMgmt ? "Next Qtr Target" : "Closed Won Target"}
            </div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
              {isSalesMgmt 
                ? "₹3.50Cr"
                : formatINR(deals.filter(d => d.stage === 'Won').reduce((acc, curr) => acc + curr.amount, 0))
              }
            </div>
          </div>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="grid">
        {/* ── DEAL PIPELINE KANBAN BOARD ── */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <Activity size={12} />
              Pipeline Stages
            </span>
            <span className="text-[9px] text-white/50 border border-white/5 bg-white/3 px-2 py-0.5 rounded">
              Use arrows to advance or regress deal stages
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won'] as Deal['stage'][]).map(stage => {
              const stageDeals = deals.filter(d => d.stage === stage);
              
              return (
                <div key={stage} className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-4 min-h-[300px]">
                  
                  {/* Stage Header */}
                  <div className="border-b border-white/5 pb-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-white/80">{stage}</span>
                    <span className="font-mono text-[9px] text-white/40 bg-white/5 px-2 py-0.5 rounded">
                      {stageDeals.length}
                    </span>
                  </div>

                  {/* Stage Cards Body */}
                  <div className="flex-1 space-y-3 overflow-y-auto mt-2">
                    {stageDeals.map(deal => (
                      <div 
                        key={deal.id}
                        className="bg-neutral-900 border border-white/5 rounded-xl p-3 text-left space-y-2 hover:border-white/20 transition-all group relative"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-mono text-white/30">{deal.id}</span>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            deal.health === 'Optimal' ? 'bg-emerald-400' : deal.health === 'Warning' ? 'bg-amber-400' : 'bg-rose-400'
                          }`} />
                        </div>

                        <div className="font-semibold text-xs text-white/95 truncate">
                          {deal.client}
                        </div>

                        <div className="font-mono text-[10px] font-bold text-white/85">
                          {formatINR(deal.amount)}
                        </div>

                        {/* Interactive Advance/Regress Buttons */}
                        <div className="flex justify-end gap-1.5 pt-2 border-t border-white/5">
                          {stage !== 'Lead' && (
                            <button 
                              onClick={() => demoteStage(deal.id)}
                              className="text-[9px] text-white/40 hover:text-white px-1.5 py-0.5 border border-white/5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              ←
                            </button>
                          )}
                          {stage !== 'Won' && (
                            <button 
                              onClick={() => advanceStage(deal.id)}
                              className="text-[9px] text-black bg-white font-bold hover:bg-neutral-200 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="text-[10px] text-white/25 italic py-8 text-center">
                        No active deals
                      </div>
                    )}
                  </div>

                  {/* Stage Footer Value Sum */}
                  <div className="border-t border-white/5 pt-2 text-right">
                    <div className="text-[8px] text-white/45 font-mono">Valuation</div>
                    <div className="text-[10px] font-bold text-white/70 font-mono">
                      {formatINR(pipelineMetrics[stage])}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ── RELATIONSHIP GRAPHS & DETAILED GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          
          {/* Visual Analytics Column (Left 1 col) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {isSalesMgmt ? (
              <>
                {/* Sales growth chart */}
                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers size={12} />
                      Sales Target Progression
                    </span>
                  </div>
                  <div className="bg-neutral-950/20 border border-white/5 rounded-xl p-2.5">
                    <EnterpriseChart type="comparative" data={salesGrowthData} height="130px" colorTheme="finance" />
                  </div>
                  <p className="text-[10px] leading-relaxed text-white/50">
                    Cumulative sales growth vs target baseline curve.
                  </p>
                </div>

                {/* Regional Treemap */}
                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                      <Network size={12} />
                      Regional Sales Share
                    </span>
                  </div>
                  <div className="bg-neutral-950/20 border border-white/5 rounded-xl p-2">
                    <EnterpriseChart type="treemap" data={regionalSalesData} height="130px" />
                  </div>
                  <p className="text-[10px] leading-relaxed text-white/50">
                    Sales performance segments proportional to regions.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                      <Network size={12} />
                      Key Client Connection Map
                    </span>
                  </div>
                  <div className="bg-neutral-950/20 border border-white/5 rounded-xl p-2.5">
                    <EnterpriseChart type="orbit" data={networkNodes} height="220px" />
                  </div>
                </div>
                <p className="text-[10px] leading-relaxed text-white/50">
                  Connection topology mapping out strategic lead allocations and referral loops.
                </p>
              </div>
            )}
          </div>

          {/* Opportunities List Table (Right 2 cols) */}
          <div className="lg:col-span-2 bg-neutral-950/20 border border-white/5 p-4 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Deals Registry</span>

              <div className="flex bg-white/3 border border-white/5 rounded-lg p-0.5 w-full sm:w-auto shrink-0 justify-end">
                {['All', 'Optimal', 'Warning', 'At Risk'].map(filterVal => (
                  <button
                    key={filterVal}
                    onClick={() => setSelectedHealthFilter(filterVal)}
                    className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                      selectedHealthFilter === filterVal ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {filterVal}
                  </button>
                ))}
              </div>
            </div>

            <EnterpriseDataGrid
              data={filteredDeals}
              columns={columns}
              searchKeys={['client', 'owner', 'id']}
              searchPlaceholder="Search deal registries..."
            />
          </div>

        </div>
      </WorkspaceStateWrapper>

    </div>
  );
}
