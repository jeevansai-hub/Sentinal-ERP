import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Play, AlertCircle, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

interface SwarmPipeline {
  id: string;
  name: string;
  status: 'Running' | 'Completed' | 'Pending' | 'Failed';
  currentStep: number;
  steps: Array<{ name: string; status: 'completed' | 'running' | 'pending' | 'failed'; reasoning: string }>;
}

const INITIAL_SWARMS: SwarmPipeline[] = [
  {
    id: "SWM-801",
    name: "SCM Procurement Swarm",
    status: "Running",
    currentStep: 2,
    steps: [
      { name: "Inventory Analysis", status: "completed", reasoning: "Identified low safety margin count for SKU-2847 in Warehouse A (84% normal cap)." },
      { name: "Vendor Selection", status: "completed", reasoning: "Filtered bids from Supplier A, B, and C. Selected Supplier B based on SLA rating (97% accuracy)." },
      { name: "Budget Validation", status: "running", reasoning: "Checking ledger line availability against Q2 Procurement allocations cap (₹25,00,000 threshold)." },
      { name: "Compliance Check", status: "pending", reasoning: "Awaiting policy confirmation matching regulatory guidelines." }
    ]
  },
  {
    id: "SWM-802",
    name: "HR Onboarding Swarm",
    status: "Running",
    currentStep: 1,
    steps: [
      { name: "Applicant Screening", status: "completed", reasoning: "Indexed 18 engineering portfolios. Pre-screened candidates matching technical stack requirements." },
      { name: "Resume Grading", status: "running", reasoning: "Scoring qualification matrices, coding challenges, and historical project contributions." },
      { name: "Contract Drafting", status: "pending", reasoning: "Generating standardized legal templates with automated compensation schedules." },
      { name: "System Provisioning", status: "pending", reasoning: "Preparing isolated workspace developer environment credentials." }
    ]
  },
  {
    id: "SWM-803",
    name: "Audit Verification Swarm",
    status: "Completed",
    currentStep: 3,
    steps: [
      { name: "Transaction Ingestion", status: "completed", reasoning: "Polled bank API. Fetched 186 transaction records for the last 24-hour cycle." },
      { name: "Anomaly Scan", status: "completed", reasoning: "Checked ledger indexes. Zero suspicious duplications or out-of-boundary limits flagged." },
      { name: "Ledger Posting", status: "completed", reasoning: "Committed transaction records to production database. Synced Command Center snapshots." }
    ]
  }
];

export default function OperationsHub() {
  const [swarms, setSwarms] = useState<SwarmPipeline[]>(INITIAL_SWARMS);
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: "APV-991", title: "Office Equipment Purchase Order", amount: "₹3,20,000", requester: "Procurement Agent", reason: "Budget threshold exceeds autonomous cap limit" },
    { id: "APV-992", title: "Priya Sharma Contract Signoff", amount: "N/A", requester: "HR Agent", reason: "Standard onboarding governance check required" }
  ]);

  const handleApprove = (id: string) => {
    setPendingApprovals(prev => prev.filter(a => a.id !== id));
  };

  const triggerNewSwarm = () => {
    const newSwarm: SwarmPipeline = {
      id: `SWM-${Math.floor(Math.random() * 100) + 810}`,
      name: "Custom Risk Assessment Swarm",
      status: "Running",
      currentStep: 0,
      steps: [
        { name: "Database Scrape", status: "running", reasoning: "Scanning compliance logs and access attempts across all integrated endpoints." },
        { name: "Policy Evaluation", status: "pending", reasoning: "Awaiting compliance policy validations." },
        { name: "Report Draft", status: "pending", reasoning: "Compiling strategic executive document templates." }
      ]
    };
    setSwarms(prev => [newSwarm, ...prev]);
  };

  return (
    <div className="p-6 space-y-6 text-left">
      
      {/* ── TOP HEADLINE METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active AI Swarms", val: swarms.filter(s => s.status === 'Running').length, desc: "Processing jobs live", color: "border-purple-500/25 text-purple-400" },
          { label: "Tasks Running Today", val: 47, desc: "Swarm queues active", color: "border-blue-500/25 text-blue-400" },
          { label: "Active Workflows", val: 12, desc: "Process maps running", color: "border-yellow-500/25 text-yellow-400" },
          { label: "Pending Approvals", val: pendingApprovals.length, desc: "Awaiting human-in-the-loop", color: "border-emerald-500/25 text-emerald-400" }
        ].map((item, idx) => (
          <div key={idx} className={`bg-neutral-950/40 backdrop-blur-md border ${item.color} p-5 rounded-2xl`}>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">{item.label}</span>
            <div className="text-3xl font-bold font-mono tracking-tight mt-1 text-white">{item.val}</div>
            <span className="text-[9px] text-white/30 font-medium block mt-1">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Pipeline Swarms List */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex justify-between items-center bg-neutral-950/40 backdrop-blur-md border border-white/5 px-5 py-4 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">ACTIVE PIPELINES</span>
            <button 
              onClick={triggerNewSwarm}
              className="px-3.5 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play size={11} fill="black" />
              <span>Trigger Custom Swarm</span>
            </button>
          </div>

          <div className="space-y-4">
            {swarms.map((swarm) => (
              <div key={swarm.id} className="bg-neutral-950/40 backdrop-blur-md border border-white/5 p-5 rounded-2xl space-y-4 hover:border-white/10 transition-colors">
                
                {/* Pipeline Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold font-mono text-white/30 tracking-wider block">{swarm.id}</span>
                    <h3 className="text-sm font-bold text-white/95 mt-1 block">{swarm.name}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
                      swarm.status === 'Completed' 
                        ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' 
                        : 'text-purple-400 border-purple-500/20 bg-purple-500/5'
                    }`}
                  >
                    {swarm.status}
                  </span>
                </div>

                {/* Pipeline Steps Tracker */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border-t border-white/5 pt-4">
                  {swarm.steps.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isRunning = step.status === 'running';
                    return (
                      <div key={idx} className="p-3 bg-white/3 border border-white/5 rounded-xl flex flex-col justify-between min-h-[90px] relative overflow-hidden">
                        {isRunning && (
                          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 animate-pulse" />
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            {isCompleted ? (
                              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                            ) : isRunning ? (
                              <div className="h-2 w-2 rounded-full bg-purple-500 animate-ping shrink-0" />
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-white/10 shrink-0" />
                            )}
                            <span className="text-[10px] font-bold text-white/90 truncate">{step.name}</span>
                          </div>
                          <p className="text-[9px] text-white/40 leading-relaxed mt-1.5 line-clamp-3">
                            {step.reasoning}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Human Approvals Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-950/40 backdrop-blur-md border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">HUMAN DECISION GATES</span>
              <span className="text-[10px] text-yellow-500 font-mono font-bold">{pendingApprovals.length} GATES</span>
            </div>

            <div className="space-y-3">
              {pendingApprovals.length === 0 ? (
                <div className="text-xs text-white/35 py-8 text-center">
                  All approvals cleared. Swarm autonomous run active.
                </div>
              ) : (
                pendingApprovals.map((app) => (
                  <div key={app.id} className="p-3.5 bg-white/3 border border-white/5 rounded-xl space-y-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold font-mono text-white/30 uppercase tracking-widest">{app.id} · {app.requester}</span>
                      <h4 className="text-xs font-bold text-white/90 leading-tight mt-1">{app.title}</h4>
                      {app.amount !== 'N/A' && (
                        <span className="text-xs font-mono font-semibold text-white/50 block mt-0.5">{app.amount}</span>
                      )}
                    </div>
                    <div className="text-[9px] text-white/40 leading-normal flex items-start gap-1">
                      <AlertCircle size={10} className="text-yellow-500 shrink-0 mt-0.5" />
                      <span>{app.reason}</span>
                    </div>
                    <div className="flex gap-2 pt-1.5 border-t border-white/5">
                      <button 
                        onClick={() => handleApprove(app.id)}
                        className="flex-1 py-1.5 bg-white text-black text-[10px] font-bold rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer text-center"
                      >
                        Approve Action
                      </button>
                      <button 
                        onClick={() => handleApprove(app.id)}
                        className="flex-1 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-white/75 text-[10px] font-semibold rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Escalate
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
