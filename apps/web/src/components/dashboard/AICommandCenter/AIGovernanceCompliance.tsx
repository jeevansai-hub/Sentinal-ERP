import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Search, AlertCircle, FileCheck, RefreshCw } from 'lucide-react';

interface AuthorityRule {
  agent: string;
  scope: string;
  limit: string;
  requirement: string;
}

const RULES: AuthorityRule[] = [
  { agent: "Executive Intelligence Agent", scope: "Strategic Decisions, Swarms", limit: "Unlimited", requirement: "Self-Audit & Board Log" },
  { agent: "Finance Agent", scope: "Budget Validation, Invoices", limit: "₹10,00,000", requirement: "Escalate to CFO if exceeded" },
  { agent: "Procurement Agent", scope: "RFQ Dispatches, Supplier Choice", limit: "₹25,00,000", requirement: "Swarm validation required" },
  { agent: "HR Agent", scope: "Leave reviews, Onboarding setup", limit: "₹0", requirement: "Auto-provisioning rules" },
  { agent: "Compliance Agent", scope: "Security check, Audit signing", limit: "₹0", requirement: "MFA challenge threshold" }
];

export default function AIGovernanceCompliance() {
  const [transactionId, setTransactionId] = useState('');
  const [traceResult, setTraceResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTraceSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) return;

    setLoading(true);
    setTraceResult(null);

    setTimeout(() => {
      setLoading(false);
      const tid = transactionId.trim().toUpperCase();
      if (tid.includes("801") || tid.includes("SCM")) {
        setTraceResult({
          decision: "Approve Purchase Requisition PO-991",
          reason: "Vendor B pricing is ₹450/unit, matching Q2 budget allocation. Procurement, Finance, and Risk Agents aligned.",
          evidence: "Bid comparison logs (Supplier A: ₹520, Supplier B: ₹450). Budget ledger line raw-metals holds ₹22.4L free allocation.",
          confidence: 96.2,
          alternatives: "Allocate 30% order size to Supplier C to split logistics latency risk.",
          auditLog: "Event code SWM-801-DEC-03 committed to auditing timeline. Decrypted Hash: 0x8a92f1b402e..."
        });
      } else {
        setTraceResult({
          decision: "Standard Ledger Posting Synced",
          reason: "Completed nightly reconciliation cycle. Polled transaction entries match cash gateway receipts exactly.",
          evidence: "186 transactions processed. Anomaly indices returned zero duplication matches.",
          confidence: 99.4,
          alternatives: "No alternative required. Transaction values match 1:1 with bank records.",
          auditLog: "Event code TR-9921-OK committed to ledger log. Decrypted Hash: 0x3d29a4c108e..."
        });
      }
    }, 900);
  };

  return (
    <div className="p-6 space-y-6 text-left font-sans">
      
      {/* ── TOP METRICS ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Policy Compliance Rate", val: "100.0%", desc: "All write actions signed", icon: Shield, color: "text-emerald-500" },
          { label: "AI Audits Completed", val: "1,248 Runs MTD", desc: "Cryptographic hash logs", icon: FileCheck, color: "text-purple-500" },
          { label: "Human Overrides", val: "2 Override Events", desc: "Parameter updates stored", icon: Lock, color: "text-blue-500" },
          { label: "Escalation Queue", val: "0 Active Alerts", desc: "Awaiting administrator", icon: AlertCircle, color: "text-emerald-500" }
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
        
        {/* Left: Authority & Limits Matrix Table */}
        <div className="lg:col-span-7 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Agent Authority & Limits Matrix</span>
            <span className="text-[9px] text-white/35 font-mono">GOVERNANCE PROTOCOLS</span>
          </div>

          <div className="overflow-x-auto select-none sidebar-scroll">
            <table className="w-full text-xs text-white/70 text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/30 uppercase text-[9px] tracking-wider font-bold">
                  <th className="py-2.5 px-3">Agent</th>
                  <th className="py-2.5 px-3">Authority Scope</th>
                  <th className="py-2.5 px-3">Budget Limit</th>
                  <th className="py-2.5 px-3">Override Req.</th>
                </tr>
              </thead>
              <tbody>
                {RULES.map((r, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white/90">{r.agent}</td>
                    <td className="py-3 px-3">{r.scope}</td>
                    <td className="py-3 px-3 font-mono font-medium text-white/60">{r.limit}</td>
                    <td className="py-3 px-3 text-[10px] text-purple-400 font-mono">{r.requirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Traceability Inspector */}
        <div className="lg:col-span-5 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between min-h-[380px]">
          
          <div className="space-y-3 flex-1 flex flex-col justify-start">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Traceability Inspector</span>
              <span className="text-[9px] text-purple-400 font-mono font-bold">XAI TELEMETRY</span>
            </div>

            {/* Trace Search Input */}
            <form onSubmit={handleTraceSearch} className="relative flex items-center rounded-xl bg-white/3 border border-white/8 transition-all duration-300">
              <Search size={14} className="text-white/30 absolute left-4" />
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter Decision ID e.g., SWM-801-DEC-03..."
                className="w-full bg-transparent px-10 py-3 text-xs text-white placeholder-white/20 border-none outline-none h-10 rounded-xl"
              />
              <button 
                type="submit"
                className="h-7 px-3.5 bg-white text-black text-[10px] font-semibold rounded-lg hover:bg-neutral-200 active:scale-95 transition-all absolute right-2 cursor-pointer"
              >
                Trace
              </button>
            </form>

            {/* Trace Results Box */}
            <div className="flex-grow min-h-[140px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="load"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2 text-xs text-white/30 font-mono"
                  >
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Decrypting cryptographic audit trail...</span>
                  </motion.div>
                ) : traceResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 w-full text-xs text-white/70 text-left"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block font-mono">EXPLAINABILITY DATA REPORT</span>
                      <h4 className="text-xs font-bold text-white/95 leading-tight">{traceResult.decision}</h4>
                    </div>

                    <div className="border-t border-white/5 pt-2 space-y-1.5 leading-relaxed">
                      <p className="text-[10px] text-white/50"><strong className="text-white/75 font-semibold">Reasoning:</strong> {traceResult.reason}</p>
                      <p className="text-[10px] text-white/50"><strong className="text-white/75 font-semibold">Evidence:</strong> {traceResult.evidence}</p>
                      <p className="text-[10px] text-white/50"><strong className="text-white/75 font-semibold">Rejected Alternatives:</strong> {traceResult.alternatives}</p>
                      <p className="text-[10px] text-emerald-400 font-mono"><strong className="text-white/70 font-semibold font-sans">Confidence:</strong> {traceResult.confidence}%</p>
                    </div>

                    <div className="text-[8px] font-mono text-purple-400 border-t border-white/5 pt-2">
                      {traceResult.auditLog}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-xs text-white/35 py-12 text-center max-w-[240px]">
                    Enter a transaction Decision ID above (e.g. `SWM-801-DEC-03`) to audit agent explanation logs.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="text-[9px] text-white/20 text-center border-t border-white/5 pt-3 font-mono">
            Cryptography standard: SHA-256 Event Chain
          </div>
        </div>

      </div>

    </div>
  );
}
