import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  agent: string;
  status: 'completed' | 'active' | 'idle';
  time: string;
  confidence: number;
  reasoning: string;
  x: number;
  y: number;
}

const INITIAL_STEPS: WorkflowStep[] = [
  { id: '1', name: 'Inventory Low', agent: 'Inventory Agent', status: 'completed', time: '1.2s', confidence: 98, reasoning: 'Telemetry alert triggered: safety margin inventory count for raw metals dipped below threshold limit (150 metric tons). Issued purchase requisition.', x: 60, y: 150 },
  { id: '2', name: 'Evaluate Bids', agent: 'Procurement Agent', status: 'completed', time: '2.5s', confidence: 94, reasoning: 'Evaluated Supplier A, B, and C. Selected Supplier B based on pricing efficiency and historical SLA compliance scores.', x: 190, y: 150 },
  { id: '3', name: 'Budget Verification', agent: 'Finance Agent', status: 'completed', time: '1.8s', confidence: 96, reasoning: 'Audited allocation logs. Verified that ₹12.4L expenditure sits within raw materials procurement quarterly cap.', x: 320, y: 150 },
  { id: '4', name: 'Regulatory Audit', agent: 'Compliance Agent', status: 'active', time: '0.8s', confidence: 99, reasoning: 'Scanning transaction details against legal limits and contract agreements. Compliance checks matching standard policy rules.', x: 450, y: 150 },
  { id: '5', name: 'Verify History', agent: 'Memory Agent', status: 'idle', time: '0s', confidence: 97, reasoning: 'Pending execution: retrieve historical transaction outcomes and vendor performance timeline metrics.', x: 580, y: 150 },
  { id: '6', name: 'Strategic Approval', agent: 'Executive Intelligence Agent', status: 'idle', time: '0s', confidence: 98, reasoning: 'Pending execution: run swarm review and sign off final Purchase Order requisition.', x: 710, y: 150 }
];

export default function WorkflowOrchestration() {
  const [steps, setSteps] = useState<WorkflowStep[]>(INITIAL_STEPS);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(INITIAL_STEPS[3]);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('4');

  // Simulated playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSteps(prev => {
        const activeIdx = prev.findIndex(s => s.status === 'active');
        if (activeIdx === -1) {
          // Restart loop
          return prev.map((s, idx) => ({
            ...s,
            status: idx === 0 ? 'active' : 'idle'
          }));
        }
        
        return prev.map((s, idx) => {
          if (idx === activeIdx) {
            return { ...s, status: 'completed' };
          }
          if (idx === (activeIdx + 1) % prev.length) {
            setSelectedStep(prev[idx]);
            setActiveAccordion(prev[idx].id);
            return { ...s, status: 'active' };
          }
          return s;
        });
      });
    }, 4000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleReset = () => {
    setSteps(INITIAL_STEPS);
    setSelectedStep(INITIAL_STEPS[0]);
    setActiveAccordion('1');
    setIsPlaying(false);
  };

  return (
    <div className="p-6 space-y-6 text-left">
      
      {/* ── FLOW CONTROLLER BAR ── */}
      <div className="bg-neutral-950/40 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Active Swarm Flow</span>
          <h3 className="text-sm font-bold text-white/90 mt-0.5">Procurement Automation Pipeline</h3>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="h-8 w-8 bg-white/3 hover:bg-white/8 border border-white/5 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-white/70 hover:text-white"
            title="Reset flow"
          >
            <RotateCcw size={13} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 px-4 bg-white text-black text-xs font-semibold rounded-lg hover:bg-neutral-200 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isPlaying ? <Pause size={11} fill="black" /> : <Play size={11} fill="black" />}
            <span>{isPlaying ? 'Pause simulation' : 'Play flow'}</span>
          </button>
          <button 
            onClick={() => setPlaybackSpeed(prev => prev === 1 ? 2 : prev === 2 ? 4 : 1)}
            className="h-8 px-3 bg-white/3 hover:bg-white/8 border border-white/5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer text-white/70 hover:text-white text-xs font-mono"
            title="Speed multiplier"
          >
            <FastForward size={12} />
            <span>{playbackSpeed}x</span>
          </button>
        </div>
      </div>

      {/* ── FLOWCHART CANVAS CONTAINER ── */}
      <div className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-x-auto min-h-[260px] flex items-center justify-start pr-12 sidebar-scroll">
        <div className="relative w-[840px] h-[200px] shrink-0">
          
          {/* SVG Connection Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" viewBox="0 0 840 200">
            {steps.map((s, idx) => {
              if (idx === steps.length - 1) return null;
              const nextStep = steps[idx + 1];
              const isCompleted = s.status === 'completed';
              const isActive = s.status === 'active' || nextStep.status === 'active';
              return (
                <g key={s.id}>
                  <line
                    x1={s.x + 32}
                    y1={s.y}
                    x2={nextStep.x - 32}
                    y2={nextStep.y}
                    stroke={isCompleted ? '#10B981' : isActive ? '#A855F7' : 'rgba(255, 255, 255, 0.05)'}
                    strokeWidth={isActive ? 2 : 1.5}
                    style={{ transition: 'stroke 0.3s ease' }}
                  />
                  {isActive && (
                    <circle
                      cx={s.x + 32}
                      cy={s.y}
                      r="3"
                      fill="#A855F7"
                      className="animate-pulse"
                      style={{
                        animation: 'flow 2s infinite linear',
                        offsetPath: `path('M ${s.x + 32} ${s.y} L ${nextStep.x - 32} ${nextStep.y}')`
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Node Cards */}
          {steps.map((s) => {
            const isCompleted = s.status === 'completed';
            const isActive = s.status === 'active';
            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStep(s);
                  setActiveAccordion(s.id);
                }}
                className="absolute p-0.5 rounded-xl border cursor-pointer transition-all duration-300 active:scale-95 group focus:outline-none flex flex-col items-center justify-center"
                style={{
                  left: s.x,
                  top: s.y,
                  transform: 'translate(-50%, -50%)',
                  borderColor: isActive ? '#A855F7' : isCompleted ? '#10B981' : 'rgba(255, 255, 255, 0.08)',
                  backgroundColor: isActive ? '#0d0d0d' : isCompleted ? '#050505' : '#030303',
                  boxShadow: isActive ? '0 0 16px rgba(168, 85, 247, 0.25)' : 'none',
                  width: '120px',
                  height: '74px',
                  zIndex: 5
                }}
              >
                <div className="text-center w-full px-2">
                  <div className="text-[10px] font-bold text-white/90 truncate leading-tight">{s.name}</div>
                  <div className="text-[8px] text-white/35 font-semibold mt-1 truncate">{s.agent}</div>
                  {isCompleted && (
                    <div className="flex items-center justify-center gap-1 mt-1.5 text-[8px] text-emerald-400 font-mono">
                      <CheckCircle2 size={9} />
                      <span>{s.time}</span>
                    </div>
                  )}
                  {isActive && (
                    <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[8px] text-purple-400 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-ping"></span>
                      <span>RUNNING</span>
                    </div>
                  )}
                  {s.status === 'idle' && (
                    <div className="text-[8px] text-white/20 mt-1.5">Awaiting queue</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM ACCORDION & LOGS PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Step Accordion list */}
        <div className="lg:col-span-8 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Pipeline Execution Accordion</span>
            <span className="text-[9px] text-white/35 font-mono">STEP-BY-STEP REASONING</span>
          </div>

          <div className="space-y-2">
            {steps.map((s) => {
              const isOpen = activeAccordion === s.id;
              const isCompleted = s.status === 'completed';
              const isActive = s.status === 'active';
              return (
                <div 
                  key={s.id} 
                  className="bg-white/3 border border-white/5 rounded-xl overflow-hidden transition-colors"
                  style={{
                    borderColor: isOpen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <button
                    onClick={() => {
                      setActiveAccordion(isOpen ? null : s.id);
                      setSelectedStep(s);
                    }}
                    className="w-full px-4 py-3 flex justify-between items-center hover:bg-white/2 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-white/20">0{s.id}</span>
                      <span className="text-xs font-bold text-white/95">{s.name}</span>
                      <span className="text-[9px] text-white/30">({s.agent})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-[8px] font-bold uppercase tracking-wider"
                        style={{
                          color: isCompleted ? '#10B981' : isActive ? '#A855F7' : '#a3a3a3'
                        }}
                      >
                        {s.status}
                      </span>
                      {isOpen ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3.5 pt-1.5 text-xs text-white/70 leading-relaxed border-t border-white/5 space-y-2">
                          <p>{s.reasoning}</p>
                          <div className="flex items-center gap-3 pt-2 text-[9px] font-mono text-white/40">
                            <span>Execution Latency: {s.time || 'N/A'}</span>
                            <span>·</span>
                            <span>Confidence Index: {s.confidence}%</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Execution Details Card */}
        <div className="lg:col-span-4 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 text-left flex flex-col justify-between min-h-[300px]">
          <AnimatePresence mode="wait">
            {selectedStep ? (
              <motion.div
                key={selectedStep.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold font-mono text-white/30 uppercase tracking-widest">STEP DETAILED TELEMETRY</span>
                    <h4 className="text-sm font-bold text-white/95 mt-1 leading-tight">{selectedStep.name}</h4>
                    <span className="text-[10px] text-white/40 font-medium block leading-none">{selectedStep.agent}</span>
                  </div>

                  <div className="border-t border-white/5 pt-3 space-y-2 text-xs text-white/70">
                    <div className="flex justify-between">
                      <span className="text-white/40">Status:</span>
                      <span className="font-semibold uppercase text-white font-mono">{selectedStep.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Confidence Score:</span>
                      <span className="font-semibold text-emerald-400 font-mono">{selectedStep.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Processing Duration:</span>
                      <span className="font-semibold text-white font-mono">{selectedStep.time || '0.0s'}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">AGENT EXPLAINABILITY LOG</span>
                    <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                      {selectedStep.reasoning}
                    </p>
                  </div>
                </div>

                <div className="text-[9px] text-white/20 text-center font-mono border-t border-white/5 pt-4">
                  Trace ID: SWM-801-DEC-0{selectedStep.id}
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-white/35">
                Click any workflow node to inspect decision log
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
