import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Network, Database, ChevronRight, HelpCircle, FileText } from 'lucide-react';

interface MemoryItem {
  id: string;
  category: 'Procurement' | 'HR' | 'Finance' | 'Compliance';
  summary: string;
  timestamp: string;
  vectorId: string;
  score: number;
}

const MEMORIES: MemoryItem[] = [
  { id: "MEM-401", category: "Procurement", summary: "Supplier C rating degraded by 12% due to late steel delivery (delay of 4 days, incident code SCM-9281). Recommendations updated.", timestamp: "2026-06-12", vectorId: "v_scm_0921_12", score: 0.94 },
  { id: "MEM-402", category: "Finance", summary: "Overspending warning logged in IT equipment budget. Dept exceeded cap limit by ₹3,20,000. Variance validated.", timestamp: "2026-06-11", vectorId: "v_fin_4821_04", score: 0.88 },
  { id: "MEM-403", category: "HR", summary: "Attrition risk threshold flagged for junior developers in Engineering Dept. Burnout forecast metrics updated.", timestamp: "2026-06-10", vectorId: "v_hr_8921_15", score: 0.91 },
  { id: "MEM-404", category: "Compliance", summary: "Audit verification profile compiled for SOC 2 security framework requirements. Universal credentials checked.", timestamp: "2026-06-08", vectorId: "v_gov_3921_01", score: 0.99 },
  { id: "MEM-405", category: "Procurement", summary: "Supplier B bid selected for bulk component orders. Best price matching metric: ₹450 per unit vs average ₹510.", timestamp: "2026-06-05", vectorId: "v_scm_1032_88", score: 0.95 }
];

export default function EnterpriseKnowledgeGraph() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<MemoryItem[]>(MEMORIES);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setItems(MEMORIES);
      return;
    }
    const lower = text.toLowerCase();
    setItems(MEMORIES.filter(m => 
      m.summary.toLowerCase().includes(lower) || 
      m.category.toLowerCase().includes(lower) ||
      m.id.toLowerCase().includes(lower)
    ));
  };

  return (
    <div className="p-6 space-y-6 text-left font-sans">
      
      {/* ── TOP METRICS ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Memories Indexed", val: "18,492 Nodes", desc: "Long-term Vector DB active", icon: Database, color: "text-emerald-500" },
          { label: "Vendor Intelligence Index", val: "94.8% Accurate", desc: "Performance histories synced", icon: Network, color: "text-purple-500" },
          { label: "Project Intelligence", val: "100% Retained", desc: "Completed boards stored", icon: FileText, color: "text-blue-500" },
          { label: "Knowledge Growth", val: "+14.2% MTD", desc: "Decisions backpropagated", icon: HelpCircle, color: "text-yellow-500" }
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

      {/* ── CENTRAL SPLIT PANELS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive Memory Map Graph */}
        <div className="lg:col-span-7 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          <div className="space-y-1 z-10 text-left">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/70">Knowledge Linkage Diagram</h3>
            <p className="text-[10px] text-white/30 leading-none">Hover over vertices to inspect entity relationships</p>
          </div>

          {/* SVG-based node-map */}
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center self-center my-6">
            <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" viewBox="0 0 400 400">
              {/* Connection linkages */}
              <line x1="200" y1="200" x2="100" y2="100" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              <line x1="200" y1="200" x2="300" y2="100" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              <line x1="200" y1="200" x2="100" y2="300" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              <line x1="200" y1="200" x2="300" y2="300" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              <line x1="100" y1="100" x2="300" y2="100" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              <line x1="100" y1="300" x2="300" y2="300" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
            </svg>

            {/* Core Memory Hub Node */}
            <button
              onClick={() => setSelectedNode('hub')}
              className="absolute p-0.5 rounded-full border cursor-pointer bg-neutral-950 transition-all z-10"
              style={{
                left: '200px',
                top: '200px',
                transform: 'translate(-50%, -50%)',
                borderColor: selectedNode === 'hub' ? '#A855F7' : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="h-12 w-12 rounded-full flex flex-col items-center justify-center text-[8px] font-bold text-white/80">
                <Network size={14} className="text-purple-400 mb-0.5" />
                <span>CORE</span>
              </div>
            </button>

            {/* Orbiting Entities */}
            {[
              { id: 'emp', label: 'Employees', x: 100, y: 100, color: '#3B82F6' },
              { id: 'proj', label: 'Projects', x: 300, y: 100, color: '#10B981' },
              { id: 'vend', label: 'Vendors', x: 100, y: 300, color: '#F59E0B' },
              { id: 'dec', label: 'Decisions', x: 300, y: 300, color: '#EC4899' }
            ].map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className="absolute p-0.5 rounded-full border cursor-pointer bg-neutral-950 transition-all z-10"
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)',
                  borderColor: selectedNode === node.id ? node.color : 'rgba(255, 255, 255, 0.08)'
                }}
              >
                <div className="h-10 w-10 rounded-full flex flex-col items-center justify-center text-[7px] font-bold text-white/50 hover:text-white transition-colors">
                  <span style={{ color: node.color }}>●</span>
                  <span>{node.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-white/5 pt-3 text-[10px] text-white/40 leading-relaxed min-h-[48px]">
            {selectedNode === 'emp' && "Employees Linkage: Maps operator keystrokes, decision logs, and department roles to audit indices."}
            {selectedNode === 'proj' && "Projects Linkage: Keeps logs of completed sprint tasks, delivery durations, and resource gaps."}
            {selectedNode === 'vend' && "Vendors Linkage: Archives performance telemetry, delay records, and pricing catalogs."}
            {selectedNode === 'dec' && "Decisions Linkage: Stores explainability logs and override histories from human coordinators."}
            {(!selectedNode || selectedNode === 'hub') && "Select an orbiting entity to display relationship logic details."}
          </div>
        </div>

        {/* Right Side: Semantic Memory Searcher */}
        <div className="lg:col-span-5 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between min-h-[480px]">
          
          <div className="space-y-3 flex-1 flex flex-col justify-start">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Semantic Memory Search</span>
              <span className="text-[9px] text-emerald-400 font-mono">RETRIEVAL CHANNELS</span>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center rounded-xl bg-white/3 border border-white/8 transition-all duration-300">
              <Search size={14} className="text-white/30 absolute left-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search index e.g., failed procurement..."
                className="w-full bg-transparent px-10 py-3 text-xs text-white placeholder-white/20 border-none outline-none h-10 rounded-xl"
              />
            </div>

            {/* Dynamic Results list */}
            <div className="space-y-2.5 overflow-y-auto max-h-[280px] pr-1 mt-2 sidebar-scroll text-left">
              {items.length === 0 ? (
                <div className="text-xs text-white/30 text-center py-12">
                  No memory records match search filters.
                </div>
              ) : (
                items.map((m) => (
                  <div key={m.id} className="p-3 bg-white/3 border border-white/5 rounded-xl space-y-2 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold font-mono text-white/30 uppercase tracking-widest">{m.id} · {m.category}</span>
                        <p className="text-[11px] text-white/85 leading-relaxed mt-1">{m.summary}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/5 pt-1.5 text-[8px] font-mono text-white/45">
                      <span>Vector ID: {m.vectorId}</span>
                      <span className="text-emerald-400 font-semibold">Match Score: {Math.floor(m.score * 100)}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-[9px] text-white/20 text-center border-t border-white/5 pt-3 font-mono">
            Vector Dimensions: 1536 · Ingestion Frequency: Real-Time
          </div>
        </div>

      </div>

    </div>
  );
}
