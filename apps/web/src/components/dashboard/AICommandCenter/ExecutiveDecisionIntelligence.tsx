import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Sparkles, HelpCircle, BarChart2, ShieldAlert } from 'lucide-react';
import EnterpriseChart from '../../common/EnterpriseChart';

export default function ExecutiveDecisionIntelligence() {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [queryResponse, setQueryResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const forecastData = [
    { name: 'Jun', value: 42000000, compareValue: 38000000 },
    { name: 'Jul', value: 45000000, compareValue: 40000000 },
    { name: 'Aug', value: 48000000, compareValue: 42000000 },
    { name: 'Sep', value: 52000000, compareValue: 45000000 },
    { name: 'Oct', value: 50000000, compareValue: 48000000 },
    { name: 'Nov', value: 58000000, compareValue: 51000000 }
  ];

  const handleQueryClick = (q: string) => {
    setActiveQuery(q);
    setLoading(true);
    setQueryResponse(null);

    setTimeout(() => {
      setLoading(false);
      if (q.includes("profits")) {
        setQueryResponse("Executive Agent Analysis: Operating margins are stable at 28.6%, but logistics expenditures rose 7.4% MTD due to freight surcharge hikes. Recommendation: execute vendor RFQ bidding via Operations Hub to re-align bulk transport pricing.");
      } else if (q.includes("underperforming")) {
        setQueryResponse("Executive Agent Analysis: SCM Procurement efficiency index is degraded at 82/100, driven by Supplier C delivery delay trends. All other domains (Finance: 98%, HR: 94%, CRM: 95%) are operating in optimal status.");
      } else if (q.includes("risk")) {
        setQueryResponse("Executive Agent Analysis: Largest liability is contract SLA variance on steel shipments (risk index: 24%). Mitigation strategy: routing 30% safety stock allocation to Warehouse B connector lanes.");
      }
    }, 1100);
  };

  return (
    <div className="p-6 space-y-6 text-left font-sans">
      
      {/* ── BOARDROOM TOP KPIS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Corporate Revenue MTD", val: "₹4.20Cr", trend: "+18.4%", desc: "vs last quarter MTD", color: "text-emerald-500" },
          { label: "Net Operating Margin", val: "28.6%", trend: "+3.2%", desc: "vs last month", color: "text-emerald-500" },
          { label: "Swarm Efficiency Index", val: "94.2%", trend: "Optimal", desc: "Across all active agents", color: "text-purple-500" },
          { label: "Exposure Risk Score", val: "Low (12/100)", trend: "Nominal", desc: "No compliance flags", color: "text-blue-500" },
          { label: "Automation ROI MTD", val: "$42,850", trend: "+14.6%", desc: "Token savings realized", color: "text-teal-500" }
        ].map((item, idx) => (
          <div key={idx} className="bg-neutral-950/40 backdrop-blur-md border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider leading-none block">{item.label}</span>
            <div className="text-xl font-bold font-mono tracking-tight text-white mt-2">{item.val}</div>
            <div className="flex justify-between items-center mt-1 text-[9px] text-white/30">
              <span>{item.desc}</span>
              <span className={`font-mono font-bold ${item.color}`}>{item.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── CENTRAL SPLIT BLOCK ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 6-Month Spline Forecast Chart */}
        <div className="lg:col-span-8 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[380px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block font-mono">Rollout Projections</span>
              <h3 className="text-xs font-bold text-white/95 mt-0.5">Corporate Revenue & Margin Forecast</h3>
            </div>
            <span className="text-[9px] text-white/30 font-mono">UNIT: INR (₹)</span>
          </div>

          <div className="h-[260px] w-full mt-4 relative">
            <EnterpriseChart 
              data={forecastData}
              type="forecast"
              colorTheme="rose"
            />
          </div>
        </div>

        {/* Right: AI Strategic Insights Card */}
        <div className="lg:col-span-4 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 space-y-4 text-left flex flex-col justify-between min-h-[380px]">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">AI Strategic Insight</span>
              <span className="text-[9px] text-purple-400 font-mono flex items-center gap-1">
                <Sparkles size={11} />
                <span>EXECUTIVE Swarm</span>
              </span>
            </div>

            <div className="p-3 bg-white/3 border border-white/5 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                <TrendingUp size={13} className="text-purple-400" />
                <span>Logistics Spend Variance Alert</span>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                MTD Revenue increased by 18%, but raw transport expenditures rose 7.4% above benchmark indices. Transport contracts re-negotiation suggested.
              </p>
            </div>

            <div className="border-t border-white/5 pt-3.5 space-y-2">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">BOARDROOM QUICK ACTIONS</span>
              <div className="flex flex-col gap-1.5 text-[10px] text-white/60">
                <button className="flex items-center justify-between p-2 bg-white/3 hover:bg-white/5 border border-white/5 rounded-lg text-left transition-all cursor-pointer">
                  <span>Draft transport supplier RFQ</span>
                  <ArrowUpRight size={12} className="text-white/40" />
                </button>
                <button className="flex items-center justify-between p-2 bg-white/3 hover:bg-white/5 border border-white/5 rounded-lg text-left transition-all cursor-pointer">
                  <span>Compile Q2 Expenditure review</span>
                  <ArrowUpRight size={12} className="text-white/40" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-white/20 text-center font-mono border-t border-white/5 pt-3">
            Forecast Algorithm: Seasonal Holt-Winters Model
          </div>
        </div>

      </div>

      {/* ── BOTTOM BOARDROOM NATURAL QUERY INTERFACE ── */}
      <div className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 text-left space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider font-mono">Natural Language Boardroom Queries</span>
          <span className="text-[9px] text-white/35 font-mono">EXECUTIVE COGNITIVE LAYER</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { text: "Why are logistics profits decreasing?", desc: "Analyze transport surcharge changes MTD" },
            { text: "What department is underperforming?", desc: "Scan departmental health index scorecards" },
            { text: "What is our largest operational risk?", desc: "Analyze contract SLA variances & inventory logs" }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleQueryClick(item.text)}
              className="p-3.5 bg-white/3 border border-white/5 hover:border-white/10 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between min-h-[80px]"
            >
              <span className="text-xs font-bold text-white/90 leading-tight block">{item.text}</span>
              <span className="text-[9px] text-white/30 leading-none mt-2 block">{item.desc}</span>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {activeQuery && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="border-t border-white/5 pt-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-white/40 text-[9px] uppercase font-bold tracking-widest font-mono">
                <HelpCircle size={12} className="text-purple-400" />
                <span>QUERY INPUT: "{activeQuery}"</span>
              </div>

              {loading ? (
                <div className="flex items-center gap-2.5 text-xs text-white/30 font-mono py-2">
                  <div className="h-4 w-4 rounded-full border-2 border-t-white border-white/10 animate-spin" />
                  <span>Computing boardroom metrics variables...</span>
                </div>
              ) : (
                <div className="p-4 bg-white/3 border border-white/5 rounded-xl text-xs leading-relaxed text-white/90 font-mono">
                  {queryResponse}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
