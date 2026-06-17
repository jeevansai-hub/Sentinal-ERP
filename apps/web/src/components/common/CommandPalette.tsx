import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Users, DollarSign, Activity, Settings, Cpu } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Workspaces' | 'Actions' | 'Help';
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Define commands index
  const commands: CommandItem[] = [
    { id: '1', category: 'Workspaces', title: 'Command Center', description: 'Go to Executive Command Center', path: '/dashboard', icon: Activity },
    { id: '2', category: 'Workspaces', title: 'HRMS Operations', description: 'Manage employee tree and leave logs', path: '/dashboard/hr', icon: Users },
    { id: '3', category: 'Workspaces', title: 'Finance Ledgers', description: 'View general ledgers & budgets', path: '/dashboard/finance', icon: DollarSign },
    { id: '4', category: 'Workspaces', title: 'CRM Sales Operations', description: 'Revenue and pipeline opportunities', path: '/dashboard/crm', icon: Compass },
    { id: '5', category: 'Workspaces', title: 'Supply Chain SCM', description: 'Procurement and logistics tower', path: '/dashboard/procurement', icon: Compass },
    { id: '6', category: 'Workspaces', title: 'Invoice Registry', description: 'Search and compile invoice payments', path: '/dashboard/invoices', icon: DollarSign },
    { id: '7', category: 'Workspaces', title: 'Approval Hub', description: 'Review pending workflow tasks', path: '/dashboard/approvals', icon: Activity },
    { id: '8', category: 'Workspaces', title: 'Inventory Management', description: 'Warehouse map & SKU tracking', path: '/dashboard/inventory', icon: Activity },
    { id: '9', category: 'Workspaces', title: 'Agentic AI Center', description: 'Ask AI Copilot for audit queries', path: '/dashboard/ai-center', icon: Cpu },
    { id: '10', category: 'Workspaces', title: 'BI Analytics', description: 'Advanced reporting & forecasting', path: '/dashboard/analytics', icon: Activity },
    { id: '11', category: 'Workspaces', title: 'Security & Compliance', description: 'IAM policies and SOC auditing', path: '/dashboard/security', icon: Settings },
    { id: '12', category: 'Workspaces', title: 'Workspace Settings', description: 'Configure system settings', path: '/dashboard/settings', icon: Settings },
    { id: '13', category: 'Actions', title: 'Create New Invoice', description: 'Quickly draft a new CFO ledger invoice', path: '/dashboard/invoices?action=new', icon: DollarSign },
    { id: '14', category: 'Actions', title: 'Launch Workspace Configurator', description: 'Reconfigure ERP modules', path: '/dashboard/settings?action=config', icon: Settings },
    { id: '15', category: 'Help', title: 'Platform Documentation', description: 'Sentinel ERP operation guides', path: '/dashboard/knowledge', icon: Compass }
  ];

  // Filter commands by query
  const filtered = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(filtered.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(filtered.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          navigate(filtered[selectedIndex].path);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-4">
      <div 
        ref={containerRef}
        className="w-full max-w-xl bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[50vh]"
      >
        {/* Search header input */}
        <div className="relative border-b border-white/5 flex items-center h-12 shrink-0">
          <div className="absolute left-4 text-white/40">
            <Search size={14} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Type a workspace name, module path, or action command..."
            className="w-full h-full pl-11 pr-4 bg-transparent text-xs text-white placeholder-white/30 outline-none"
          />
          <div className="absolute right-4 text-[9px] font-mono text-white/30 border border-white/10 rounded px-1.5 py-0.5">
            ESC
          </div>
        </div>

        {/* Search results list */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 text-left">
          {filtered.length > 0 ? (
            // Group filtered items by category
            Object.entries(
              filtered.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              }, {} as Record<string, typeof filtered>)
            ).map(([cat, items]) => (
              <div key={cat} className="space-y-1">
                <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest px-2.5 pt-2 pb-1">
                  {cat}
                </div>
                {items.map((cmd) => {
                  const Icon = cmd.icon;
                  // Find index of this item in global filtered list
                  const globalIdx = filtered.findIndex(f => f.id === cmd.id);
                  const isSelected = globalIdx === selectedIndex;

                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        navigate(cmd.path);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer select-none ${
                        isSelected 
                          ? 'bg-white/10 text-white' 
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
                      }`}>
                        <Icon size={13} />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold">{cmd.title}</div>
                        <div className="text-[10px] text-white/40 truncate">{cmd.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-white/30 italic text-xs leading-relaxed">
              No matching modules or actions found. Try "finance" or "invoice".
            </div>
          )}
        </div>

        {/* Interactive help footer */}
        <div className="h-9 bg-white/[0.02] border-t border-white/5 px-4 flex items-center justify-between shrink-0 text-[9px] font-mono text-white/30">
          <div className="flex gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Sentinel OS Registry Search v2.0</span>
        </div>
      </div>
    </div>
  );
}
