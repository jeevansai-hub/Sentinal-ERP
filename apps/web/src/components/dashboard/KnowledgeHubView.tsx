import { useState } from 'react';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import { HelpCircle, Search, BookOpen, Compass, ChevronRight } from 'lucide-react';

interface WikiArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  lastUpdated: string;
}

export default function KnowledgeHubView() {
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState('1');
  const [articles] = useState<WikiArticle[]>([
    {
      id: '1',
      title: 'ERP Procurement Sign-off Matrices',
      category: 'Finance Rules',
      summary: 'Details workflow hierarchies and thresholds governing capital purchase requisition approvals.',
      content: 'Under corporate compliance index framework v2, all financial ledger write-outs exceeding ₹5,00,000 must route through both the primary Operations lead and the CFO escalation queue. Any items marked "Critical" priority trigger automatic alerts in the Decision & Approval Hub.',
      lastUpdated: '2026-04-12'
    },
    {
      id: '2',
      title: 'Information Security & Data Protection Policies',
      category: 'Governance Protocols',
      summary: 'Outlines cryptographic requirements and user authorization levels inside Sentinel ERP.',
      content: 'Sentinel uses zero-knowledge token signing for all active workspaces. User session logs are aggregated into SOC tracking networks inside the Security Center module. Employees are forbidden from sharing API keys or caching private tenant keys outside authorized systems.',
      lastUpdated: '2026-06-02'
    },
    {
      id: '3',
      title: 'Warehouse Standard Operating Procedures (SOP)',
      category: 'Logistics Handbooks',
      summary: 'Standard operating manual governing inventory receipts, loading bay procedures, and dispatch sequences.',
      content: 'Inbound raw component items must be scanned at Warehouse Hub 1 within 4 hours of receipt. If capacity logs exceed 85% load thresholds, stock managers must immediately coordinate shipment routing via supply-chain networks or trigger space reallocation algorithms.',
      lastUpdated: '2026-05-28'
    }
  ]);

  const filtered = articles.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedArticle = articles.find(art => art.id === selectedArticleId) || articles[0];

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <BookOpen size={12} />
            <span>Knowledge & Document Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Wiki Hub & Policy Navigator</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            Reading-first knowledge workspace. Access corporate policies, step-by-step guides, and engineering logs.
          </p>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="list">
        
        {/* ── SEARCH NAVIGATOR CONTROL ── */}
        <div className="relative text-left w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search knowledge hub by keywords or categories..."
            className="w-full h-11 pl-11 pr-4 text-xs bg-white/5 border border-white/10 rounded-2xl outline-none text-white focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
          />
          <div className="absolute left-4 top-3.5 text-white/30">
            <Search size={14} />
          </div>
        </div>

        {/* ── TWO-COLUMN WIKI LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: LIST INDEX */}
          <div className="lg:col-span-4 space-y-2 text-left">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-1">Articles index</span>
            <div className="space-y-1">
              {filtered.map(art => (
                <button
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-colors cursor-pointer select-none ${
                    selectedArticleId === art.id
                      ? 'bg-white/10 border-white/10 text-white font-medium'
                      : 'bg-white/3 border-white/5 text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="truncate pr-4 space-y-1">
                    <span className="text-[8px] font-mono tracking-wider text-white/40 uppercase block">{art.category}</span>
                    <div className="text-xs font-semibold truncate">{art.title}</div>
                  </div>
                  <ChevronRight size={12} className="shrink-0 text-white/30" />
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="p-8 text-center text-white/30 italic text-xs border border-white/5 rounded-2xl">
                  No articles matched query.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: READING VIEW */}
          <div className="lg:col-span-8 bg-neutral-950/40 border border-white/5 p-6 rounded-2xl text-left space-y-6">
            
            <div className="border-b border-white/5 pb-4 space-y-2">
              <div className="flex justify-between items-center text-[9px] font-mono text-white/35">
                <span className="flex items-center gap-1"><Compass size={11} /> {selectedArticle.category}</span>
                <span>Last Updated: {selectedArticle.lastUpdated}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedArticle.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed italic">{selectedArticle.summary}</p>
            </div>

            <div className="text-xs text-white/70 leading-relaxed space-y-4 font-sans max-w-none">
              <p className="whitespace-pre-line">{selectedArticle.content}</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 font-mono">
              <span>Sentinel Knowledge System v1.4</span>
              <button 
                onClick={() => alert('Article feedback logged.')}
                className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors"
              >
                <HelpCircle size={12} />
                <span>Request Revision</span>
              </button>
            </div>

          </div>

        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
