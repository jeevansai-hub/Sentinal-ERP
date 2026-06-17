import { useState } from 'react';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import { Folder, FileText, Download, History, Eye } from 'lucide-react';

interface DocItem {
  id: string;
  name: string;
  category: 'Policies' | 'Contracts' | 'Engineering' | 'Financials';
  version: string;
  modifiedDate: string;
  size: string;
  signedStatus: 'Signed' | 'Unsigned' | 'External Review';
}

export default function DocumentCenterView() {
  const [loading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [docs] = useState<DocItem[]>([
    { id: '1', name: 'Global Information Security Policy v4.pdf', category: 'Policies', version: '4.2', modifiedDate: '2026-05-18', size: '1.4 MB', signedStatus: 'Signed' },
    { id: '2', name: 'Vertex Systems MSA - Executed Copy.pdf', category: 'Contracts', version: '2.0', modifiedDate: '2026-06-01', size: '4.8 MB', signedStatus: 'Signed' },
    { id: '3', name: 'SCM Warehouse Floor Layout Draft.dwg', category: 'Engineering', version: '1.8-alpha', modifiedDate: '2026-06-11', size: '14.2 MB', signedStatus: 'External Review' },
    { id: '4', name: 'Q1 Balance Sheet & Ledger Report.xlsx', category: 'Financials', version: '1.0', modifiedDate: '2026-04-10', size: '2.5 MB', signedStatus: 'Signed' },
    { id: '5', name: 'Workforce NDA Template - Standard.docx', category: 'Contracts', version: '3.1', modifiedDate: '2025-12-05', size: '320 KB', signedStatus: 'Unsigned' }
  ]);

  const categories = ['All', 'Policies', 'Contracts', 'Engineering', 'Financials'];

  const filteredDocs = activeCategory === 'All' 
    ? docs 
    : docs.filter(d => d.category === activeCategory);

  const handleDownload = (name: string) => {
    alert(`Initiating download for file resource: ${name}`);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Folder size={12} />
            <span>Knowledge & Document Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Document Registry & File Vault</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            Enterprise document management repository. Search indexed templates, audit file versioning, and confirm legal execution status.
          </p>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="list">
        
        {/* ── FOLDER / CATEGORY NAVIGATOR ROW ── */}
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 border rounded-xl transition-all cursor-pointer font-semibold uppercase tracking-wider text-[10px] ${
                activeCategory === cat 
                  ? 'bg-white text-black border-white' 
                  : 'bg-white/3 text-white/50 border-white/5 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── HIGH FIDELITY FILE EXPLORER LIST ── */}
        <div className="space-y-3 text-left">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[9px] font-bold text-white/35 uppercase tracking-wider border-b border-white/5">
            <div className="col-span-6">Resource Name</div>
            <div className="col-span-2">Revision v#</div>
            <div className="col-span-2">Legal Seal</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="space-y-2">
            {filteredDocs.map(doc => (
              <div 
                key={doc.id}
                className="grid grid-cols-12 gap-4 items-center p-3.5 bg-neutral-950/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
              >
                <div className="col-span-6 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 shrink-0">
                    <FileText size={14} />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">{doc.name}</div>
                    <span className="text-[9px] text-white/30 font-mono">{doc.size} | Modified {doc.modifiedDate}</span>
                  </div>
                </div>

                <div className="col-span-2 flex items-center gap-1.5 text-xs text-white/70 font-mono">
                  <History size={11} className="text-white/40" />
                  <span>v{doc.version}</span>
                </div>

                <div className="col-span-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                    doc.signedStatus === 'Signed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : doc.signedStatus === 'Unsigned'
                      ? 'bg-white/5 text-white/30 border-white/10'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                  }`}>
                    {doc.signedStatus}
                  </span>
                </div>

                <div className="col-span-2 flex justify-end gap-1.5">
                  <button 
                    onClick={() => handleDownload(doc.name)}
                    className="h-8 w-8 rounded-lg border border-white/5 hover:border-white/20 bg-white/3 hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                    title="Download File"
                  >
                    <Download size={12} />
                  </button>
                  <button 
                    className="h-8 w-8 rounded-lg border border-white/5 hover:border-white/20 bg-white/3 hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                    title="Audit Details"
                  >
                    <Eye size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
