import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Command, Shield, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UniversalCommandBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMAND_SUGGESTIONS = [
  { text: "Show vendors with declining SLA", category: "SCM & Procurement" },
  { text: "Generate procurement report", category: "Analytics & Finance" },
  { text: "Analyze budget risks", category: "Finance" },
  { text: "Create onboarding workflow", category: "HRMS" },
  { text: "Show active agent swarms", category: "Operations" }
];

export default function UniversalCommandBar({ isOpen, onClose }: UniversalCommandBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResult(null);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const handleCommandSelect = (cmdText: string) => {
    setLoading(true);
    setResult(null);
    setQuery(cmdText);

    setTimeout(() => {
      setLoading(false);
      const lower = cmdText.toLowerCase();
      if (lower.includes("sla") || lower.includes("vendor")) {
        setResult("SCM Agent: Flagged Supplier C (SLA compliance 74%) and Supplier D (delivery delay 4.2 days). Recommended action: initiate secondary bid RFQ in Operations Hub.");
      } else if (lower.includes("procurement") || lower.includes("report")) {
        setResult("Executive Agent: Prepared Q2 Procurement audit dataset. Total spend: ₹1.24Cr. Automation savings realized: ₹4.85L. Open file in Strategic Intelligence Center.");
      } else if (lower.includes("budget") || lower.includes("risk")) {
        setResult("Finance Agent: Identified 1 cost overrun liability in IT equipment allocations (exceeded cap by 18%). Traceability profile ready in AI Governance & Compliance.");
      } else if (lower.includes("onboarding") || lower.includes("workflow")) {
        setResult("Orchestrator Agent: Initialized new HR workflow blueprint. HR Agent screening queued, Risk Agent verification active. Active pipeline in Workflow Orchestration.");
      } else if (lower.includes("swarm")) {
        setResult("Orchestrator Agent: Active Swarm Swarms: [Risk Swarm #482 (Running), Finance Ledger Audit (Completed), SCM Proposal Evaluation (Pending)]. Check Operations Hub.");
      } else {
        setResult(`Sentinel AI: Core processed "${cmdText}". Ledger databases synchronized with 100% trace compliance. Operational status: Nominal.`);
      }
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      if (query && !loading && !result) {
        handleCommandSelect(query);
      } else if (!query) {
        handleCommandSelect(COMMAND_SUGGESTIONS[selectedIndex].text);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % COMMAND_SUGGESTIONS.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + COMMAND_SUGGESTIONS.length) % COMMAND_SUGGESTIONS.length);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col min-h-[360px]"
            onKeyDown={handleKeyDown}
          >
            {/* Input Row */}
            <div className="flex items-center px-4 border-b border-white/5 h-14 shrink-0">
              <Search className="text-white/30 mr-3 shrink-0" size={18} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setResult(null);
                }}
                placeholder="Type a command or ask Sentinel agents..."
                className="w-full bg-transparent text-sm text-white placeholder-white/20 outline-none border-none h-full"
              />
              <div className="flex items-center gap-1.5 ml-3 shrink-0 text-white/30 text-[10px] font-mono border border-white/10 px-2 py-1 rounded-lg">
                <Command size={10} />
                <span>K</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-4 overflow-y-auto min-h-0 text-left">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="h-6 w-6 rounded-full border-2 border-t-white border-white/10 animate-spin" />
                  <span className="text-xs text-white/40 font-mono">Routing query across synthetic swarm...</span>
                </div>
              )}

              {!loading && result && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 py-3"
                >
                  <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase font-bold tracking-widest">
                    <Sparkles size={12} className="text-white" />
                    <span>SWARM RESPONSE CHANNEL</span>
                  </div>
                  <div className="p-4 bg-white/3 border border-white/5 rounded-xl text-xs leading-relaxed text-white/95">
                    {result}
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setResult(null);
                        setQuery('');
                        setTimeout(() => inputRef.current?.focus(), 50);
                      }}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      Clear Command
                    </button>
                    <button
                      onClick={onClose}
                      className="px-3 py-1.5 bg-white text-black rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      Close Overlay
                    </button>
                  </div>
                </motion.div>
              )}

              {!loading && !result && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/30 text-[9px] uppercase font-bold tracking-widest pl-1">
                    <Command size={11} />
                    <span>SUGGESTED ENTERPRISE COMMANDS</span>
                  </div>
                  <div className="space-y-1">
                    {COMMAND_SUGGESTIONS.map((cmd, index) => {
                      const isSelected = index === selectedIndex && !query;
                      return (
                        <button
                          key={index}
                          onClick={() => handleCommandSelect(cmd.text)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group border ${
                            isSelected 
                              ? 'bg-white/10 border-white/10' 
                              : 'bg-white/3 border-transparent hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded bg-white/5 flex items-center justify-center shrink-0">
                              <Sparkles size={11} className="text-white/40 group-hover:text-white" />
                            </div>
                            <span className="text-xs text-white/80 group-hover:text-white font-medium">{cmd.text}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/30 uppercase tracking-wide font-medium bg-white/5 px-2 py-0.5 rounded border border-white/5">
                              {cmd.category}
                            </span>
                            {isSelected && (
                              <CornerDownLeft size={11} className="text-white/40" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Row */}
            <div className="h-10 border-t border-white/5 bg-neutral-950 px-4 flex items-center justify-between text-[10px] text-white/30 shrink-0 font-medium tracking-wide uppercase select-none">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Exit</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={10} />
                <span>Sentinel Swarm Console v1.0.0</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
