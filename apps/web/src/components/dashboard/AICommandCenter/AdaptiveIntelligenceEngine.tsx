import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCw, CheckCircle2, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

interface LearningEvent {
  id: string;
  agent: string;
  parameter: string;
  change: string;
  reason: string;
  beforeVal: string;
  afterVal: string;
  trend: 'down' | 'up';
}

const LEARNING_EVENTS: LearningEvent[] = [
  { id: "LRN-501", agent: "Procurement Agent", parameter: "Supplier C Reliability Score", change: "-17%", reason: "Late order dispatch delivery delay exceeding 4 days in SCM cycle.", beforeVal: "95%", afterVal: "78%", trend: "down" },
  { id: "LRN-502", agent: "Finance Agent", parameter: "Auto-Approval Spending Cap", change: "-20%", reason: "Budget overrun anomaly flagged in Q2 departmental spending analysis.", beforeVal: "₹5,00,000", afterVal: "₹4,00,000", trend: "down" },
  { id: "LRN-503", agent: "HR Agent", parameter: "Attrition Score Weight", change: "+12%", reason: "Detected early attrition signal sequence matching junior developer profiles.", beforeVal: "0.45", afterVal: "0.57", trend: "up" },
  { id: "LRN-504", agent: "Sales Agent", parameter: "Contract Close Win Probability", change: "+8%", reason: "Refined heuristics match based on recent enterprise closing trends.", beforeVal: "68%", afterVal: "76%", trend: "up" }
];

export default function AdaptiveIntelligenceEngine() {
  const [events, setEvents] = useState<LearningEvent[]>(LEARNING_EVENTS);
  const [activeLoopStep, setActiveLoopStep] = useState(2);

  const loopSteps = [
    { label: "Decision", desc: "Agent makes recommendation" },
    { label: "Outcome", desc: "Action executes & evaluates" },
    { label: "Evaluation", desc: "Heuristics identify discrepancies" },
    { label: "Feedback", desc: "Operator updates logic weights" },
    { label: "Reinforcement", desc: "Model parameters calibrate" }
  ];

  return (
    <div className="p-6 space-y-6 text-left font-sans">
      
      {/* ── TOP HEADING BLOCK ── */}
      <div className="bg-neutral-950/40 backdrop-blur-md border border-white/5 p-4 rounded-xl flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Continuous Tuning System</span>
          <h3 className="text-sm font-bold text-white/90 mt-0.5">Self-Improving Heuristics & Weights Matrix</h3>
        </div>

        <button 
          onClick={() => setActiveLoopStep(prev => (prev + 1) % loopSteps.length)}
          className="h-8 px-3.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCw size={11} className="animate-spin" style={{ animationDuration: '6s' }} />
          <span>Step Learning Loop</span>
        </button>
      </div>

      {/* ── REINFORCEMENT LEARNING TIMELINE LOOP ── */}
      <div className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-center min-h-[160px] overflow-x-auto sidebar-scroll">
        <div className="flex items-center justify-between w-full min-w-[760px] relative px-4">
          {loopSteps.map((step, idx) => {
            const isActive = idx === activeLoopStep;
            const isCompleted = idx < activeLoopStep;
            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center text-center space-y-2 relative z-10 max-w-[120px]">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isActive 
                        ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]' 
                        : isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-white/3 border-white/5 text-white/30'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={14} /> : <span className="text-xs font-bold font-mono">{idx + 1}</span>}
                  </div>
                  <div className="space-y-0.5">
                    <span className={`text-[10px] font-bold tracking-wide uppercase ${isActive ? 'text-white' : isCompleted ? 'text-white/70' : 'text-white/35'}`}>{step.label}</span>
                    <span className="text-[8px] text-white/25 leading-normal block">{step.desc}</span>
                  </div>
                </div>

                {idx < loopSteps.length - 1 && (
                  <ArrowRight 
                    size={14} 
                    className={`shrink-0 ${
                      isCompleted ? 'text-emerald-500' : isActive ? 'text-purple-400' : 'text-white/10'
                    }`} 
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── MAIN GRID: COMPARISONS & WEIGHT LOGS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Scorecard Adjustments list */}
        <div className="lg:col-span-8 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Learning Events Log</span>
            <span className="text-[9px] text-white/35 font-mono">MODEL TUNING HISTORY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((e) => (
              <div key={e.id} className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-3 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-bold font-mono text-white/30 uppercase tracking-widest">{e.id} · {e.agent}</span>
                    <h4 className="text-xs font-bold text-white/90 leading-tight mt-1">{e.parameter}</h4>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-mono font-bold ${e.trend === 'down' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {e.trend === 'down' ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                    <span>{e.change}</span>
                  </div>
                </div>

                <p className="text-[10px] text-white/45 leading-relaxed font-mono bg-black/40 p-2.5 rounded border border-white/5">
                  {e.reason}
                </p>

                <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/5 pt-2 text-white/40">
                  <span>Prior Weight: {e.beforeVal}</span>
                  <ArrowRight size={10} className="text-white/20" />
                  <span>Adjusted Weight: <strong className="text-white font-semibold">{e.afterVal}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Heuristic Weights Panel */}
        <div className="lg:col-span-4 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 space-y-4 text-left flex flex-col justify-between min-h-[360px]">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Agent Performance Index</span>
              <span className="text-[9px] text-purple-400 font-mono">TUNING FACTOR</span>
            </div>

            <div className="space-y-3 text-xs text-white/70">
              {[
                { name: "Procurement Agent", efficiency: 94, color: "bg-emerald-500" },
                { name: "Finance Agent", efficiency: 96, color: "bg-emerald-500" },
                { name: "HR Agent", efficiency: 91, color: "bg-purple-500" },
                { name: "Sales Agent", efficiency: 88, color: "bg-purple-500" }
              ].map((agent, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>{agent.name}</span>
                    <span className="font-semibold font-mono text-white">{agent.efficiency}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${agent.color}`}
                      style={{ width: `${agent.efficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-3 space-y-2">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">LEARNING CORE SPECIFICATION</span>
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-[10px] text-white/50 leading-relaxed font-mono flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400 shrink-0" />
                <span>Heuristic optimization model recalculates parameter routing weights once per 24 hours.</span>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-white/20 text-center font-mono border-t border-white/5 pt-3">
            Optimization Model: Reinforcement Learning Loop (Q-Tuning)
          </div>
        </div>

      </div>

    </div>
  );
}
