import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, ZoomIn, ZoomOut, RefreshCw, HelpCircle, Server } from 'lucide-react';

interface TwinNode {
  id: string;
  label: string;
  category: 'org' | 'dept' | 'emp' | 'asset' | 'agent';
  details: string;
  metric: string;
  x: number;
  y: number;
  connections: string[];
}

const INITIAL_NODES: TwinNode[] = [
  { id: "sentinel", label: "Sentinel ERP Node", category: "org", details: "Acme Corporate Master Instance", metric: "Uptime: 99.99%", x: 250, y: 50, connections: ["dept-fin", "dept-hr", "dept-scm"] },
  { id: "dept-fin", label: "Finance Dept", category: "dept", details: "Core Ledger Ledger Vertical", metric: "Health: 98%", x: 100, y: 150, connections: ["emp-raj", "agent-fin"] },
  { id: "dept-hr", label: "HRMS Dept", category: "dept", details: "Staff Lifecycle & Payroll", metric: "Health: 94%", x: 250, y: 150, connections: ["emp-priya", "agent-hr"] },
  { id: "dept-scm", label: "SCM Dept", category: "dept", details: "Procurement & Warehousing", metric: "Health: 82%", x: 400, y: 150, connections: ["emp-kavya", "agent-scm"] },
  { id: "emp-raj", label: "Rajesh Mehta", category: "emp", details: "VP Operations - Tata Mfg", metric: "Utilization: 85%", x: 50, y: 250, connections: [] },
  { id: "emp-priya", label: "Priya Nair", category: "emp", details: "CHRO - Apollo Healthcare", metric: "Utilization: 78%", x: 210, y: 250, connections: [] },
  { id: "emp-kavya", label: "Kavya Sharma", category: "emp", details: "Supply Chain Director", metric: "Utilization: 92%", x: 370, y: 250, connections: [] },
  { id: "agent-fin", label: "Finance Agent", category: "agent", details: "CFOSwarm Ledger Auditor", metric: "Confidence: 96%", x: 150, y: 320, connections: [] },
  { id: "agent-hr", label: "HR Agent", category: "agent", details: "Virtual HR Operations", metric: "Confidence: 95%", x: 290, y: 320, connections: [] },
  { id: "agent-scm", label: "Procurement Agent", category: "agent", details: "SCM Dispatcher Swarm", metric: "Confidence: 94%", x: 430, y: 320, connections: [] }
];

export default function EnterpriseDigitalTwin() {
  const [nodes, setNodes] = useState<TwinNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<TwinNode | null>(INITIAL_NODES[0]);
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div className="p-6 space-y-6 text-left font-sans">
      
      {/* ── CONTROLLER TOOLBAR ── */}
      <div className="bg-neutral-950/40 backdrop-blur-md border border-white/5 p-4 rounded-xl flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block font-mono">Virtual DTO Map</span>
          <h3 className="text-sm font-bold text-white/90 mt-0.5">Live Digital Twin of the Organization (DTO)</h3>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.15))}
            className="h-8 w-8 bg-white/3 hover:bg-white/8 border border-white/5 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-white/70 hover:text-white"
          >
            <ZoomOut size={13} />
          </button>
          <span className="text-xs text-white/40 font-mono select-none">{Math.round(zoomLevel * 100)}%</span>
          <button 
            onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.15))}
            className="h-8 w-8 bg-white/3 hover:bg-white/8 border border-white/5 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-white/70 hover:text-white"
          >
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      {/* ── HIERARCHICAL GRAPH VIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: SVG Canvas Graph */}
        <div className="lg:col-span-8 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center min-h-[480px]">
          <div className="absolute top-4 left-6 z-10 space-y-1">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block font-mono">Node Graph Canvas</span>
            <span className="text-[10px] text-white/40 leading-none block">Hover/Click nodes to explore company hierarchies</span>
          </div>

          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center self-center overflow-auto mt-6">
            <motion.div
              animate={{ scale: zoomLevel }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-[500px] h-[400px] shrink-0"
            >
              {/* Dynamic Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" viewBox="0 0 500 400">
                {nodes.map((n) => {
                  return n.connections.map((connId, cidx) => {
                    const target = nodes.find(targetNode => targetNode.id === connId);
                    if (!target) return null;
                    const isSelectedPath = selectedNode?.id === n.id || selectedNode?.id === target.id;
                    return (
                      <line
                        key={cidx}
                        x1={n.x}
                        y1={n.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={isSelectedPath ? 'rgba(168, 85, 247, 0.45)' : 'rgba(255, 255, 255, 0.04)'}
                        strokeWidth={isSelectedPath ? 1.5 : 1}
                        style={{ transition: 'stroke 0.3s ease' }}
                      />
                    );
                  });
                })}
              </svg>

              {/* Node Cards */}
              {nodes.map((n) => {
                const isSelected = selectedNode?.id === n.id;
                let catColor = '#a3a3a3';
                if (n.category === 'org') catColor = '#A855F7';
                if (n.category === 'dept') catColor = '#3B82F6';
                if (n.category === 'emp') catColor = '#10B981';
                if (n.category === 'agent') catColor = '#EC4899';

                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className="absolute p-0.5 rounded-lg border cursor-pointer bg-neutral-950 transition-all z-10"
                    style={{
                      left: n.x,
                      top: n.y,
                      transform: 'translate(-50%, -50%)',
                      borderColor: isSelected ? catColor : 'rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? `0 0 12px ${catColor}33` : 'none',
                      width: '90px',
                      height: '42px'
                    }}
                  >
                    <div className="text-center flex flex-col justify-center h-full px-1">
                      <span className="text-[8px] font-bold text-white/95 truncate leading-tight">{n.label}</span>
                      <span className="text-[7px] text-white/40 mt-0.5 truncate font-mono">{n.metric}</span>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Right: Inspection details */}
        <div className="lg:col-span-4 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 text-left flex flex-col justify-between min-h-[480px]">
          
          <div className="space-y-4 flex-1 flex flex-col justify-start">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Entity Inspector</span>
              <span className="text-[9px] text-purple-400 font-mono font-bold">LIVE TELEMETRY</span>
            </div>

            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block font-mono">0x{selectedNode.id.toUpperCase()} · DTO PROFILE</span>
                    <h4 className="text-sm font-bold text-white/95 leading-tight mt-1">{selectedNode.label}</h4>
                    <span className="text-[10px] text-white/40 font-medium block leading-none">{selectedNode.details}</span>
                  </div>

                  <div className="border-t border-white/5 pt-3 space-y-2 text-xs text-white/70">
                    <div className="flex justify-between">
                      <span className="text-white/40">Category:</span>
                      <span className="font-semibold uppercase text-white font-mono">{selectedNode.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Metric status:</span>
                      <span className="font-semibold text-purple-400 font-mono">{selectedNode.metric}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">DTO RELATIONAL CONTEXT</span>
                    <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                      This node is synchronized with Sentinel's memory layer. Changes in SCM/Finance domains automatically backpropagate weights adjustment indexes to this node's registry keys.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-xs text-white/35 py-12 text-center">
                  Select a node on the canvas to inspect.
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[9px] text-white/20 text-center border-t border-white/5 pt-3 font-mono">
            Graph Type: Relational Topology · Sync rate: 100ms
          </div>
        </div>

      </div>

    </div>
  );
}
