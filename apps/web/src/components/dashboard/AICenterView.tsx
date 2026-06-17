import { useState, useMemo } from 'react';
import { 
  Search, 
  Cpu, 
  Activity, 
  Play, 
  FileText 
} from 'lucide-react';

interface AICenterViewProps {
  user: any;
}

interface AutomationNode {
  id: string;
  label: string;
  type: 'Trigger' | 'Action' | 'Condition';
  connectedTo: string[]; // target ids
  status: 'Active' | 'Paused' | 'Config-Required';
}

interface KnowledgeNode {
  id: string;
  label: string;
  category: 'Table' | 'API' | 'IAM';
  x: number;
  y: number;
}

export default function AICenterView({ user: _user }: AICenterViewProps) {
  const [activeTab, setActiveTab] = useState<'workflow' | 'knowledge'>('workflow');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Workflow nodes state
  const [nodes, setNodes] = useState<AutomationNode[]>([
    { id: 'node-1', label: 'Lead Pipeline Change', type: 'Trigger', connectedTo: ['node-2'], status: 'Active' },
    { id: 'node-2', label: 'Draft Client Email via Copilot', type: 'Action', connectedTo: ['node-3'], status: 'Active' },
    { id: 'node-3', label: 'Check SLA Clock < 24h', type: 'Condition', connectedTo: ['node-4', 'node-5'], status: 'Active' },
    { id: 'node-4', label: 'Escalate to VP Growth', type: 'Action', connectedTo: [], status: 'Config-Required' },
    { id: 'node-5', label: 'Log Security Compliance Trail', type: 'Action', connectedTo: [], status: 'Active' }
  ]);

  // Knowledge graph nodes state
  const [knowledgeNodes] = useState<KnowledgeNode[]>([
    { id: 'k-1', label: 'Axis Accounts Ledger', category: 'Table', x: 200, y: 150 },
    { id: 'k-2', label: 'Axis Bank API Gateway', category: 'API', x: 100, y: 80 },
    { id: 'k-3', label: 'CFO Security Policies', category: 'IAM', x: 300, y: 80 },
    { id: 'k-4', label: 'Workforce Payroll records', category: 'Table', x: 100, y: 220 },
    { id: 'k-5', label: 'Onboarding selection matrices', category: 'Table', x: 300, y: 220 }
  ]);

  // System Prompt library index
  const promptTemplates = [
    { title: 'SLA Escalation Prompt', desc: 'Alerts operations when purchase order approval cycles breach 48 hours.', author: 'System' },
    { title: 'Ledger Audit Sync', desc: 'Query database tables to match Axis transaction logs with invoicing.', author: 'System' },
    { title: 'New Onboarding check', desc: 'Compiles background documents for engineering hires automatic filing.', author: 'System' }
  ];

  // Pipeline connection trigger simulator
  const toggleNodeStatus = (id: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === id) {
        const nextStatus = n.status === 'Active' ? 'Paused' : n.status === 'Paused' ? 'Active' : n.status;
        return { ...n, status: nextStatus };
      }
      return n;
    }));
  };

  const filteredNodes = useMemo(() => {
    return nodes.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [nodes, searchQuery]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left view-accent-ai">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <Cpu className="text-white h-5 w-5 animate-pulse" />
            Agentic AI Center &amp; Workflow Studio
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
            Integrate automated AI workflows. Wire trigger nodes on the layout canvas, query system knowledge graphs, and customize enterprise system prompts.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 rounded-xl p-0.5 border border-white/5 shrink-0 self-center">
          <button 
            onClick={() => { setActiveTab('workflow'); setSearchQuery(''); }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'workflow' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Workflow Node Studio
          </button>
          <button 
            onClick={() => { setActiveTab('knowledge'); setSearchQuery(''); }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'knowledge' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Semantic Knowledge Graph
          </button>
        </div>
      </div>

      {/* ── CENTRAL MATRIX GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* COLUMN 1, 2 & 3: INTERACTIVE CANVAS CANVASES */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <Activity size={12} />
              {activeTab === 'workflow' ? 'Visual automation node workspace' : 'Data Node Relationships Schema'}
            </span>

            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search pipeline parameters..."
                className="w-full h-8 pl-8 pr-4 text-xs bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
              />
              <div className="absolute left-2.5 top-2 text-white/30">
                <Search size={12} />
              </div>
            </div>
          </div>

          {activeTab === 'workflow' ? (
            /* Workflow Studio node diagram builder */
            <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4">
              
              <div className="flex flex-wrap gap-4 items-center justify-start py-4">
                {filteredNodes.map(node => (
                  <div key={node.id} className="flex items-center gap-2">
                    {/* Node block */}
                    <div 
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-3.5 rounded-xl border text-xs text-left cursor-pointer transition-all space-y-2 relative min-w-[150px] ${
                        selectedNodeId === node.id 
                          ? 'border-white bg-neutral-950/80 shadow-2xl scale-[1.03]' 
                          : 'border-white/5 bg-neutral-900 hover:border-white/15'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-1 rounded ${
                          node.type === 'Trigger' ? 'bg-indigo-500/10 text-indigo-400' : node.type === 'Condition' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>{node.type}</span>
                        
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          node.status === 'Active' ? 'bg-emerald-400' : node.status === 'Paused' ? 'bg-amber-400' : 'bg-rose-400'
                        }`} />
                      </div>

                      <div className="font-semibold text-white/95 truncate">
                        {node.label}
                      </div>

                      <div className="flex justify-between items-center text-[8px] text-white/30 pt-1 border-t border-white/5">
                        <span>Status: {node.status}</span>
                      </div>
                    </div>

                    {/* Visual branch connector line */}
                    {node.connectedTo.length > 0 && (
                      <span className="text-white/20 font-bold shrink-0 animate-pulse">──►</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-white/45 bg-white/3 border border-white/5 p-3 rounded-xl">
                Click any automation node block above to query node execution rules and toggle operational active states.
              </div>

            </div>
          ) : (
            /* Semantic Knowledge Graph Map branches */
            <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4">
              
              <div className="h-72 w-full relative bg-neutral-950 rounded-xl overflow-hidden border border-white/5">
                <svg className="absolute inset-0 h-full w-full">
                  {/* Connectors to center node k-1 */}
                  {knowledgeNodes.slice(1).map(node => (
                    <line 
                      key={node.id} 
                      x1="200" y1="150" 
                      x2={node.x} y2={node.y} 
                      stroke="rgba(255,255,255,0.08)" 
                      strokeWidth="1.5" 
                    />
                  ))}

                  {/* Draw circles on branches */}
                  {knowledgeNodes.map(node => (
                    <g 
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer group"
                    >
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={node.id === 'k-1' ? '14' : '10'} 
                        fill={node.id === 'k-1' ? '#FFFFFF' : node.category === 'API' ? '#6366F1' : node.category === 'IAM' ? '#F59E0B' : '#10B981'} 
                        className="transition-all group-hover:scale-110"
                      />
                      <text 
                        x={node.x} 
                        y={node.y + 24} 
                        textAnchor="middle" 
                        fill="rgba(255,255,255,0.6)" 
                        fontSize="8px"
                        fontWeight="semibold"
                      >
                        {node.label}
                      </text>
                    </g>
                  ))}
                </svg>

                <div className="absolute top-2 left-2 text-[8px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/40">
                  Semantic Node Branches Visualizer
                </div>
              </div>

              <div className="text-[10px] text-white/45">
                Each circle represents an active database table, system API configuration, or IAM policy definition. Line links represent direct operational dependency hooks.
              </div>

            </div>
          )}

        </div>

        {/* COLUMN 4: CONTROL DETAILS & PROMPTS INDEX (RIGHT) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Node Operations panel */}
          <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                Node Command Console
              </span>
            </div>

            {selectedNodeId ? (
              <div className="space-y-3.5 text-xs text-left">
                {activeTab === 'workflow' ? (
                  (() => {
                    const match = nodes.find(n => n.id === selectedNodeId);
                    if (!match) return null;
                    return (
                      <div className="space-y-3">
                        <div className="font-bold text-white text-sm">{match.label}</div>
                        <div className="text-[10px] text-white/50 space-y-1">
                          <div>Stage Type: <strong className="text-white">{match.type}</strong></div>
                          <div>Direct Linkages: <strong className="text-white font-mono">{match.connectedTo.join(', ') || 'End Node'}</strong></div>
                          <div>Active State: <strong className="text-white">{match.status}</strong></div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => toggleNodeStatus(match.id)}
                            className="flex-1 py-1.5 bg-white text-black font-bold text-[10px] rounded flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Play size={10} />
                            <span>Toggle State</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  (() => {
                    const match = knowledgeNodes.find(n => n.id === selectedNodeId);
                    if (!match) return null;
                    return (
                      <div className="space-y-2">
                        <div className="font-bold text-white text-sm">{match.label}</div>
                        <div className="text-[10px] text-white/50 space-y-1">
                          <div>Registry Category: <strong className="text-white">{match.category}</strong></div>
                          <div>Dependency Matrix: <strong className="text-white">Center sync database hook</strong></div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            ) : (
              <div className="text-xs text-white/30 italic">Click on any workspace node block or circle node to trigger operations query.</div>
            )}
          </div>

          {/* Prompts Index list */}
          <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <FileText size={12} />
                Enterprise Prompts Library
              </span>
            </div>

            <div className="space-y-3 text-xs text-left">
              {promptTemplates.map(prompt => (
                <div key={prompt.title} className="p-2.5 bg-white/3 border border-white/5 rounded-xl space-y-1 hover:border-white/10 transition-colors cursor-pointer">
                  <div className="font-bold text-white/95">{prompt.title}</div>
                  <p className="text-[9px] text-white/40 leading-relaxed">{prompt.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
