import { useState, useEffect, useRef } from 'react';
import { useNavigate, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { resolveUserRole } from '../../App';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Bell, 
  Calendar, 
  LogOut, 
  Sparkles, 
  Send, 
  User,
  Search
} from 'lucide-react';

import { ALL_ERP_REGISTRY } from '../../core/modules/registry';
import CommandPalette from '../common/CommandPalette';
import HomeView from './HomeView';
import UniversalCommandBar from './AICommandCenter/UniversalCommandBar';
import EnterpriseCommandCenter from './AICommandCenter/EnterpriseCommandCenter';
import React from 'react';

const AGENT_SIDEBAR_CATEGORIES = [
  { id: 'ai-command-center', label: 'AI Command Center' }
] as const;

// Autoscrolling Agent Activity Ribbon component
function AgentActivityRibbon() {
  const activityItems = [
    "● Finance Agent processing invoices MTD",
    "● Procurement Agent evaluating vendor SLA compliance",
    "● Risk Agent detected anomaly on logistics node",
    "● Learning Engine updated pricing confidence model parameters",
    "● Executive Agent compiled Q2 balance sheet projections",
    "● Health Agent checking API gateway response latency",
    "● Recovery Agent verified standby container replicas state"
  ];

  return (
    <div className="w-full bg-neutral-950 border-b border-white/5 h-8 flex items-center overflow-hidden relative select-none shrink-0">
      <div className="flex whitespace-nowrap animate-marquee font-mono text-[9px] uppercase tracking-wider text-purple-400 gap-16 py-1 select-none pointer-events-none">
        {[1, 2, 3].map((set) => (
          <React.Fragment key={set}>
            {activityItems.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1.5 shrink-0">
                <span className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                <span>{item}</span>
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  orgName?: string;
  industry?: string;
}

interface DashboardLayoutProps {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
}

const SIDEBAR_CATEGORIES = [
  { id: 'core', label: 'Platform Core' },
  { id: 'executive', label: 'Executive Suite' },
  { id: 'finance', label: 'Financial Ops' },
  { id: 'operations', label: 'Logistics & Ops' },
  { id: 'kb', label: 'Knowledge Hub' },
  { id: 'intelligence', label: 'AI & Automation' },
  { id: 'governance', label: 'Governance & Security' }
] as const;

export default function DashboardLayout({ user, setUser }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll main view container to top upon navigation to prevent scroll leakage
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [location.pathname]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  // AI Copilot state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { sender: 'bot', text: 'Sentinel AI Core initialized. Ask me to query financial ledgers, verify SLA compliance, or audit workforce allocations.', time: '12:00 PM' }
  ]);
  const [chatTyping, setChatTyping] = useState(false);

  // Command palette keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = () => {
    setUser(null);
    navigate('/');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatTyping) return;

    const queryText = chatInput.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [...prev, { sender: 'user', text: queryText, time: now }]);
    setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      let reply = '';
      if (queryText.toLowerCase().includes('invoice') || queryText.toLowerCase().includes('billing')) {
        reply = 'Audited accounts ledger: Found 3 unpaid invoices exceeding 30 days total (₹12,40,000). Suggested action: dispatch an automated payment notification follow-up via SCM channel.';
      } else if (queryText.toLowerCase().includes('hr') || queryText.toLowerCase().includes('employee')) {
        reply = 'Total active headcount stands at 1,284 staff. Utilization rate sits at 91.3%. No compliance anomalies detected in the active payroll matrix.';
      } else if (queryText.toLowerCase().includes('risk') || queryText.toLowerCase().includes('security')) {
        reply = 'Identified 1 active security alert: Unauthorized IP logged from workspace gateway nodes. Recommended action: refresh IAM verification credentials.';
      } else {
        reply = `Natural query received. Scanning ERP database for "${queryText}"... Systems are normal. Ledgers are aligned with 100% compliance audit match.`;
      }
      setChatHistory(prev => [...prev, { sender: 'bot', text: reply, time: now }]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row font-sans selection:bg-white/20 overflow-hidden">
      
      {/* ── LEFT SIDEBAR ── */}
      <aside 
        className={`bg-neutral-950/90 border-r border-white/5 flex flex-col justify-between shrink-0 h-screen sticky top-0 transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="space-y-6 pt-5 px-3 flex flex-col flex-1 min-h-0">
          
          {/* Logo element & Collapse Button */}
          <div className="flex items-center justify-between px-2 shrink-0">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shrink-0">
                <span className="text-black font-black text-xs">S</span>
              </div>
              {!sidebarCollapsed && (
                <span className="text-sm font-bold tracking-tight text-white uppercase whitespace-nowrap">Sentinel ERP</span>
              )}
            </div>
            
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-white/40 hover:text-white transition-colors cursor-pointer hidden lg:block"
            >
              <Menu size={16} />
            </button>
          </div>

          {/* Active Workspace / Switcher Node */}
          <div className="px-1 shrink-0">
            <div className={`flex items-center gap-3 p-2.5 bg-white/3 border border-white/5 rounded-xl text-left overflow-hidden ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}>
              <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 font-bold text-xs">
                {user?.orgName?.[0] || 'A'}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-white/90 truncate">{user?.orgName || 'Acme Industries'}</div>
                  <div className="text-[10px] text-white/45 truncate">Workspace Operator</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Modules List - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 sidebar-scroll">
            {(user?.email === 'agent@gmail.com' ? AGENT_SIDEBAR_CATEGORIES : SIDEBAR_CATEGORIES).map(category => {
              const categoryModules = ALL_ERP_REGISTRY.filter(mod => mod.category === category.id);
              if (categoryModules.length === 0) return null;

              return (
                <div key={category.id} className="space-y-1">
                  {!sidebarCollapsed && (
                    <div className="text-[8px] font-bold text-white/25 uppercase tracking-wider px-3 pt-2 pb-1 text-left">
                      {category.label}
                    </div>
                  )}
                  <nav className="space-y-0.5">
                    {categoryModules.map(mod => {
                      const IconComp = mod.icon;
                      const isActive = location.pathname === mod.route || 
                        (user?.email === 'agent@gmail.com' && mod.id === 'ai_ecc' && location.pathname === '/dashboard');
                      
                      return (
                        <Link
                          key={mod.id}
                          to={mod.route}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
                            isActive 
                              ? 'bg-white/10 text-white font-semibold' 
                              : 'text-white/40 hover:text-white hover:bg-white/5'
                          } ${sidebarCollapsed ? 'justify-center' : ''}`}
                        >
                          <IconComp size={14} className={isActive ? 'text-white' : 'text-white/40 group-hover:text-white'} />
                          {!sidebarCollapsed && (
                            <span className="text-[10px] font-medium tracking-wide uppercase truncate">{mod.title}</span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Session and Sign Out */}
        <div className="p-4 space-y-3 shrink-0 bg-neutral-950 border-t border-white/5">
          {!sidebarCollapsed && (
            <Link 
              to="/dashboard/profile"
              className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                <User size={14} />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-semibold text-white/90 truncate">{user?.displayName || 'Administrator'}</div>
                <div className="text-[9px] font-mono text-white/40 truncate">{user?.email}</div>
              </div>
            </Link>
          )}

          <button
            onClick={handleSignOut}
            className={`w-full py-2.5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 ${
              sidebarCollapsed ? 'px-0' : ''
            }`}
            title="Sign out of workspace"
          >
            <LogOut size={13} />
            {!sidebarCollapsed && <span>Exit Workspace</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-neutral-900/20">
        
        {/* ── TOP HEADER ── */}
        <header className="h-14 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest bg-white/3 px-2.5 py-0.5 rounded border border-white/5">
              Secure Node Active
            </span>
            <span className="h-4 w-px bg-white/10" />
            <div className="flex items-center space-x-1.5 text-xs text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% Sync</span>
            </div>
            <span className="h-4 w-px bg-white/10 hidden md:inline" />
            
            {/* Quick search launcher */}
            <button 
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/3 border border-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-[10px] cursor-pointer"
            >
              <Search size={11} />
              <span>Search workspaces...</span>
              <span className="px-1 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[8px] tracking-wide">Ctrl K</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Global Calendar shortcut */}
            <button className="h-9 w-9 bg-white/3 border border-white/8 rounded-xl flex items-center justify-center hover:bg-white/8 transition-colors text-white/70 hover:text-white cursor-pointer">
              <Calendar size={14} />
            </button>

            {/* Notifications panel toggle */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="h-9 w-9 bg-white/3 border border-white/8 rounded-xl flex items-center justify-center hover:bg-white/8 transition-colors text-white/70 hover:text-white cursor-pointer relative"
              >
                <Bell size={14} />
                <span className="absolute top-1 right-1.5 h-1.5 w-1.5 bg-white rounded-full"></span>
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-neutral-950 border border-white/10 rounded-2xl p-4 shadow-2xl z-50 space-y-3"
                    >
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Alert Center</span>
                        <span className="text-[10px] text-white/30">3 pending</span>
                      </div>
                      
                      <div className="space-y-2 text-left text-xs max-h-[220px] overflow-y-auto">
                        <div className="p-2.5 bg-white/3 rounded-xl border border-white/5 space-y-1">
                          <div className="font-semibold text-white/90">SLA Breach Warning</div>
                          <div className="text-[10px] text-white/40 leading-relaxed">Purchase Order approvals are pending over 48 hours in the CFO queue.</div>
                        </div>
                        <div className="p-2.5 bg-white/3 rounded-xl border border-white/5 space-y-1">
                          <div className="font-semibold text-white/90">Anomaly Flagged</div>
                          <div className="text-[10px] text-white/40 leading-relaxed">SKU-2847 in Warehouse A has dropped below safe margin counts.</div>
                        </div>
                        <div className="p-2.5 bg-white/3 rounded-xl border border-white/5 space-y-1">
                          <div className="font-semibold text-white/90">Payroll Ready</div>
                          <div className="text-[10px] text-white/40 leading-relaxed">Workforce salary registers for June are finalized. Review required.</div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* AI Copilot toggle button */}
            <button 
              onClick={() => setAiPanelOpen(true)}
              className="h-9 px-3.5 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={13} />
              <span>AI Copilot</span>
            </button>
          </div>
        </header>

        {/* ── AGENT ACTIVITY RIBBON ── */}
        {user?.email === 'agent@gmail.com' && <AgentActivityRibbon />}

        {/* ── VIEWS INNER ROUTING ── */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative z-10">
          <Routes>
            {ALL_ERP_REGISTRY.map(mod => {
              const relativePath = mod.route.replace('/dashboard', '') || '/';
              const ElementView = mod.component;
              const isHome = mod.id === 'home';
              
              const role = resolveUserRole(user);
              const isAgentOnly = mod.category === 'ai-command-center';
              
              if (role === 'AGENT' && !isAgentOnly && mod.id !== 'home') {
                return <Route key={mod.id} path={relativePath} element={<Navigate to="/dashboard/ecc" replace />} />;
              }
              if (role === 'USER' && isAgentOnly) {
                return <Route key={mod.id} path={relativePath} element={<Navigate to="/dashboard" replace />} />;
              }

              return (
                <Route
                  key={mod.id}
                  path={relativePath}
                  element={
                    isHome 
                      ? (role === 'AGENT' 
                          ? <EnterpriseCommandCenter /> 
                          : <ElementView user={user} setAiPanelOpen={setAiPanelOpen} />)
                      : <ElementView user={user} />
                  }
                />
              );
            })}
            
            {/* Fallbacks for routes in progress or disabled to show a polished dashboard home */}
            <Route path="*" element={
              resolveUserRole(user) === 'AGENT' 
                ? <Navigate to="/dashboard/ecc" replace /> 
                : <HomeView user={user} setAiPanelOpen={setAiPanelOpen} />
            } />
          </Routes>
        </div>
      </div>

      {/* ── COLLAPSIBLE RIGHT-SIDE AI COPILOT PANEL ── */}
      <AnimatePresence>
        {aiPanelOpen && (
          <>
            {/* Drawer Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiPanelOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Conversational Sidebar Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-96 bg-neutral-950 border-l border-white/10 z-50 shadow-2xl p-5 flex flex-col justify-between"
            >
              <div className="flex flex-col h-full justify-between">
                
                {/* Panel Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center">
                      <Sparkles size={13} className="text-black" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Sentinel AI Assistant</span>
                  </div>
                  <button 
                    onClick={() => setAiPanelOpen(false)}
                    className="text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Conversation flow */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 text-left">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-white text-black font-medium' 
                          : 'bg-white/5 border border-white/5 text-white/90'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-white/20 mt-1 px-1 font-mono">{msg.time}</span>
                    </div>
                  ))}
                  {chatTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/5 rounded-2xl py-3 px-4 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Prompts Suggestions */}
                <div className="border-t border-white/5 pt-3 mb-2 flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest text-left">SUGGESTED COMMANDS</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button 
                      onClick={() => {
                        setChatInput('Generate invoice audit report');
                      }}
                      className="px-2.5 py-1 text-[10px] bg-white/3 border border-white/8 hover:border-white/20 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Audit open invoices
                    </button>
                    <button 
                      onClick={() => {
                        setChatInput('Show operational risks for the current quarter');
                      }}
                      className="px-2.5 py-1 text-[10px] bg-white/3 border border-white/8 hover:border-white/20 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Check operational risks
                    </button>
                  </div>
                </div>

                {/* Chat input box */}
                <form onSubmit={handleSendMessage} className="pt-2 border-t border-white/5 flex items-center gap-2">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI Copilot..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none text-white focus:border-white/20 focus:ring-1 focus:ring-white/10 h-10"
                  />
                  <button 
                    type="submit"
                    className="h-10 w-10 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {user?.email === 'agent@gmail.com' ? (
        <UniversalCommandBar 
          isOpen={commandPaletteOpen} 
          onClose={() => setCommandPaletteOpen(false)} 
        />
      ) : (
        <CommandPalette 
          isOpen={commandPaletteOpen} 
          onClose={() => setCommandPaletteOpen(false)} 
        />
      )}

    </div>
  );
}
