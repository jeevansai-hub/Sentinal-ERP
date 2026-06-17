import { useState } from 'react';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import { HelpCircle, Clock, AlertTriangle, User, ArrowRight } from 'lucide-react';

interface TicketItem {
  id: string;
  subject: string;
  client: string;
  priority: 'Urgent' | 'High' | 'Normal';
  slaHours: number;
  stage: 'Backlog' | 'Active' | 'Review' | 'Resolved';
  owner: string;
}

export default function CustomerSupportView() {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<TicketItem[]>([
    { id: 'T-204', subject: 'LDAP Integration sync latency in sandbox', client: 'Oracle Corp', priority: 'Urgent', slaHours: 2, stage: 'Active', owner: 'Devon Webb' },
    { id: 'T-205', subject: 'Invoice generation failing on negative VAT input', client: 'Acme Europe', priority: 'High', slaHours: 8, stage: 'Backlog', owner: 'Unassigned' },
    { id: 'T-206', subject: 'Mobile App crashes on biometric authorization', client: 'Retail Capital', priority: 'Urgent', slaHours: 1, stage: 'Active', owner: 'Jane Doe' },
    { id: 'T-207', subject: 'Export CSV truncation limits exceeding 10k lines', client: 'Vertex India', priority: 'Normal', slaHours: 24, stage: 'Review', owner: 'Sarah Connor' },
    { id: 'T-208', subject: 'Security Policy mapping errors in Audit tab', client: 'Hyperion Corp', priority: 'Normal', slaHours: 48, stage: 'Resolved', owner: 'Devon Webb' }
  ]);

  const handleStageChange = (id: string, nextStage: TicketItem['stage']) => {
    setLoading(true);
    setTimeout(() => {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, stage: nextStage } : t));
      setLoading(false);
    }, 350);
  };

  const urgentCount = tickets.filter(t => t.priority === 'Urgent' && t.stage !== 'Resolved').length;

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <HelpCircle size={12} />
            <span>People Operations Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Client Service & Support Tickets</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            Support Desk workspace. Monitor SLA thresholds, assign engineering resources, and manage escalation workflows.
          </p>
        </div>
        {urgentCount > 0 && (
          <div className="h-10 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 flex items-center gap-2 text-rose-400">
            <AlertTriangle size={14} className="animate-pulse" />
            <span className="text-xs font-mono font-bold">{urgentCount} Urgent SLA Breaches Imminent</span>
          </div>
        )}
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="list">
        
        {/* ── KANBAN TICKET PIPELINE BOARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          
          {/* STAGE: BACKLOG */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Backlog Queue</span>
              <span className="text-xs font-mono font-bold text-white/35">
                {tickets.filter(t => t.stage === 'Backlog').length}
              </span>
            </div>
            <div className="space-y-3">
              {tickets.filter(t => t.stage === 'Backlog').map(ticket => (
                <div key={ticket.id} className="p-4 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-3 relative group">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold text-white/30">{ticket.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      ticket.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-white/40'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">{ticket.subject}</div>
                  <div className="flex justify-between items-center text-[9px] text-white/35 pt-1.5 border-t border-white/5">
                    <span className="flex items-center gap-1"><User size={10} /> {ticket.owner}</span>
                    <span className="flex items-center gap-1 font-mono text-amber-400"><Clock size={10} /> {ticket.slaHours}h</span>
                  </div>
                  <button 
                    onClick={() => handleStageChange(ticket.id, 'Active')}
                    className="absolute right-3 bottom-3 h-6 w-6 rounded-lg bg-white/5 border border-white/5 items-center justify-center flex hover:bg-white text-white hover:text-black opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <ArrowRight size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* STAGE: ACTIVE */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Engineering</span>
              <span className="text-xs font-mono font-bold text-white/35">
                {tickets.filter(t => t.stage === 'Active').length}
              </span>
            </div>
            <div className="space-y-3">
              {tickets.filter(t => t.stage === 'Active').map(ticket => (
                <div key={ticket.id} className="p-4 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-3 relative group">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold text-white/30">{ticket.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      ticket.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-white/40'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">{ticket.subject}</div>
                  <div className="flex justify-between items-center text-[9px] text-white/35 pt-1.5 border-t border-white/5">
                    <span className="flex items-center gap-1"><User size={10} /> {ticket.owner}</span>
                    <span className="flex items-center gap-1 font-mono text-rose-400"><Clock size={10} /> {ticket.slaHours}h</span>
                  </div>
                  <button 
                    onClick={() => handleStageChange(ticket.id, 'Review')}
                    className="absolute right-3 bottom-3 h-6 w-6 rounded-lg bg-white/5 border border-white/5 items-center justify-center flex hover:bg-white text-white hover:text-black opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <ArrowRight size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* STAGE: REVIEW */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">SLA Review</span>
              <span className="text-xs font-mono font-bold text-white/35">
                {tickets.filter(t => t.stage === 'Review').length}
              </span>
            </div>
            <div className="space-y-3">
              {tickets.filter(t => t.stage === 'Review').map(ticket => (
                <div key={ticket.id} className="p-4 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-3 relative group">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold text-white/30">{ticket.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      ticket.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-white/40'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">{ticket.subject}</div>
                  <div className="flex justify-between items-center text-[9px] text-white/35 pt-1.5 border-t border-white/5">
                    <span className="flex items-center gap-1"><User size={10} /> {ticket.owner}</span>
                    <span className="flex items-center gap-1 font-mono text-white/50"><Clock size={10} /> {ticket.slaHours}h</span>
                  </div>
                  <button 
                    onClick={() => handleStageChange(ticket.id, 'Resolved')}
                    className="absolute right-3 bottom-3 h-6 w-6 rounded-lg bg-white/5 border border-white/5 items-center justify-center flex hover:bg-white text-white hover:text-black opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <ArrowRight size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* STAGE: RESOLVED */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Resolved</span>
              <span className="text-xs font-mono font-bold text-white/35">
                {tickets.filter(t => t.stage === 'Resolved').length}
              </span>
            </div>
            <div className="space-y-3">
              {tickets.filter(t => t.stage === 'Resolved').map(ticket => (
                <div key={ticket.id} className="p-4 bg-neutral-950/20 border border-white/5 rounded-2xl space-y-3 opacity-60">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold text-white/20">{ticket.id}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-white/5 text-white/30">
                      Resolved
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white/60 line-through leading-snug">{ticket.subject}</div>
                  <div className="text-[9px] text-white/30 pt-1.5 border-t border-white/5">
                    Closed by {ticket.owner}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
