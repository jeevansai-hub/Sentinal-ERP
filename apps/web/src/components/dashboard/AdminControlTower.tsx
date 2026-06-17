import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Users,
  Shield,
  Cpu,
  Zap,
  Network,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sparkles,
  Send,
  Plus,
  DollarSign,
  AlertTriangle,
  Clock,
  Globe,
  BarChart2,
  Lock,
  Layers,
  FileText
} from 'lucide-react';

import EnterpriseChart from '../common/EnterpriseChart';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';

// ── TYPES ──
interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  orgName?: string;
  industry?: string;
}

interface AdminControlTowerProps {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
}

interface UserRecord {
  id: string;
  avatar: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Pending';
  lastLogin: string;
  createdDate: string;
}

interface AgentRecord {
  id: string;
  name: string;
  department: string;
  status: 'Running' | 'Paused' | 'Stopped' | 'Failed';
  tasksCompleted: number;
  successRate: number;
  cost: string;
  lastExecution: string;
  model: string;
  memorySize: string;
  tools: string[];
}

interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  module: string;
  status: 'Success' | 'Failed' | 'Warning';
  ip: string;
  device: string;
}

// ── SIDEBAR SECTIONS ──
const MENU_ITEMS = [
  { id: 'overview', label: 'Dashboard Overview', category: 'General', icon: Activity },
  { id: 'users', label: 'User Management', category: 'Organization', icon: Users },
  { id: 'rbac', label: 'Roles & Permissions', category: 'Organization', icon: Lock },
  { id: 'departments', label: 'Departments', category: 'Organization', icon: Network },
  { id: 'agents', label: 'Agent Registry', category: 'AI Workforce', icon: Cpu },
  { id: 'observability', label: 'Agent Observability', category: 'AI Workforce', icon: BarChart2 },
  { id: 'governance', label: 'Agent Governance', category: 'AI Workforce', icon: Shield },
  { id: 'twin', label: 'System Digital Twin', category: 'Operations', icon: Layers },
  { id: 'workflows', label: 'Workflow Studio', category: 'Automation', icon: GitBranchIcon },
  { id: 'integrations', label: 'Integration Hub', category: 'Platform', icon: Zap },
  { id: 'security', label: 'Security Center', category: 'Governance', icon: ShieldAlertIcon },
  { id: 'audit', label: 'Audit Center', category: 'Governance', icon: FileText },
  { id: 'monitoring', label: 'System Monitoring', category: 'Operations', icon: Activity },
  { id: 'billing', label: 'Billing & Usage', category: 'Operations', icon: DollarSign },
  { id: 'settings', label: 'Workspace Settings', category: 'Platform', icon: Settings },
] as const;

function GitBranchIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="6" y1="3" x2="6" y2="15"></line>
      <circle cx="18" cy="6" r="3"></circle>
      <circle cx="6" cy="18" r="3"></circle>
      <path d="M18 9a9 9 0 0 1-9 9"></path>
    </svg>
  );
}

function ShieldAlertIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}

export default function AdminControlTower({ user, setUser }: AdminControlTowerProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [systemAlerts, setSystemAlerts] = useState([
    { id: '1', title: 'Unauthorized IP Blocked', desc: 'Node gateway blocked suspicious request from region RU-NET.', time: 'Just Now', severity: 'high' },
    { id: '2', title: 'Token Limit Approaching', desc: 'SCM Proposal Agent consumed 82% of its hourly budget.', time: '12m ago', severity: 'med' },
    { id: '3', title: 'Database Backup Completed', desc: 'Master transactional shard backed up to AWS Glacier storage.', time: '1h ago', severity: 'low' }
  ]);

  // Command palette state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setNotificationsOpen(false);
        setProfileDropdownOpen(false);
        setWorkspaceOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // AI Assistant Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { sender: 'bot', text: 'Welcome back, Admin. System Control Tower fully loaded. I have indexed all logs, agents, user matrix permissions, and network nodes. Ask me to query health status, optimize agent budgets, or draft organizational reports.', time: '12:00 PM' }
  ]);
  const [chatTyping, setChatTyping] = useState(false);

  // Auto AI helper texts depending on tab
  const tabHelperPrompts = useMemo(() => {
    switch (activeTab) {
      case 'overview':
        return ['Explain health anomalies', 'Analyze current efficiency', 'Run full SOC compliance audit'];
      case 'users':
        return ['List suspended accounts', 'Create Super Admin user', 'Audit last logins'];
      case 'rbac':
        return ['Compare Admin vs Supervisor roles', 'Reset Viewer permission set', 'Lock integrated AWS configurations'];
      case 'departments':
        return ['Show department budget efficiency', 'Inspect Engineering head counts', 'Audit Sales department metrics'];
      case 'agents':
        return ['Optimize SCM Agent model configurations', 'View proposal agent logic history', 'Restart halted agent pipelines'];
      case 'observability':
        return ['Explain token spikes in Sales agent', 'Generate system latency reports', 'Compare model cost efficiency'];
      case 'governance':
        return ['Set SCM Agent budget threshold to ₹10,000', 'Force human authorization on Finance Agent', 'Apply restricted tool array'];
      case 'twin':
        return ['Audit department relational map', 'Inspect agent connections graph', 'Track invoice validation flow'];
      case 'workflows':
        return ['Create invoice check chain', 'Inspect failed run in procurement', 'Rollback SCM logic version'];
      case 'integrations':
        return ['Show Stripe API errors', 'Audit WhatsApp webhook latency', 'Connect Anthropic Claude API key'];
      case 'security':
        return ['Threat level analysis', 'Audit MFA compliance ratio', 'Show active blocked regions map'];
      case 'audit':
        return ['Search SCM edits from User 1', 'Flag failing transactions', 'Export compliance log to CSV'];
      case 'monitoring':
        return ['Show CPU spike metrics', 'Verify database health cluster', 'Audit queue latencies'];
      case 'billing':
        return ['Explain AI token spending', 'Forecast billing for Q3', 'Optimize storage consumption'];
      case 'settings':
        return ['Show API tenant credentials', 'Edit primary workspace configuration', 'Rotate master security signature'];
      default:
        return ['Query system log anomalies', 'Inspect active agents', 'Report server health status'];
    }
  }, [activeTab]);

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || chatInput;
    if (!query.trim() || chatTyping) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [...prev, { sender: 'user', text: query, time }]);
    setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      let reply = '';
      const lowerQ = query.toLowerCase();

      if (lowerQ.includes('anomal') || lowerQ.includes('health')) {
        reply = 'Observing: Master cluster database response latency returned to nominal state (0.9ms). All agents are in active sync. Suspicious authentication attempt from RU-NET has been blocked successfully.';
      } else if (lowerQ.includes('user') || lowerQ.includes('suspend') || lowerQ.includes('logins')) {
        reply = 'Audited active sessions: Suspend action applied successfully to Operator User index: "mock-user-4". Reset link forwarded to HR node.';
      } else if (lowerQ.includes('agent') || lowerQ.includes('budget') || lowerQ.includes('token')) {
        reply = 'Orchestrating agent parameters: Proposal Agent token configuration limit adjusted to 1,200,000 max. SCM budget set successfully at ₹10,000 monthly cap.';
      } else if (lowerQ.includes('security') || lowerQ.includes('mfa') || lowerQ.includes('threat')) {
        reply = 'SOC security index evaluated: 2FA Compliance stands at 98.4%. Blocked IP pool expanded by 4 addresses. No critical memory leak detected.';
      } else {
        reply = `Admin Query processed: Executing scan on "${query}"... Relational node trees are healthy. System operates under active SOC 2 governance.`;
      }

      setChatHistory(prev => [...prev, { sender: 'bot', text: reply, time }]);
    }, 1100);
  };

  const handleSignOut = () => {
    setUser(null);
    navigate('/');
  };

  // ── MOCK DATA STORES ──
  const [usersList, setUsersList] = useState<UserRecord[]>([
    { id: '1', avatar: 'AS', name: 'Alexander Sterling', email: 'admin@gmail.com', department: 'Operations', role: 'Super Admin', status: 'Active', lastLogin: 'Just Now', createdDate: '2026-01-10' },
    { id: '2', avatar: 'PM', name: 'Priya Mehta', email: 'priya.m@company.com', department: 'Finance', role: 'Finance Manager', status: 'Active', lastLogin: '12m ago', createdDate: '2026-02-14' },
    { id: '3', avatar: 'RV', name: 'Rahul Varma', email: 'rahul.v@company.com', department: 'HR', role: 'HR Manager', status: 'Active', lastLogin: '2h ago', createdDate: '2026-01-18' },
    { id: '4', avatar: 'JD', name: 'Jane Doe', email: 'jane.doe@company.com', department: 'Engineering', role: 'Super Admin', status: 'Suspended', lastLogin: '3d ago', createdDate: '2026-03-01' },
    { id: '5', avatar: 'VM', name: 'Vikram Malhotra', email: 'vikram.m@company.com', department: 'Sales', role: 'Sales Manager', status: 'Active', lastLogin: '1h ago', createdDate: '2026-02-28' },
    { id: '6', avatar: 'RS', name: 'Rohan Sen', email: 'rohan.s@company.com', department: 'Engineering', role: 'Employee', status: 'Active', lastLogin: '4h ago', createdDate: '2026-04-12' },
    { id: '7', avatar: 'AR', name: 'Aditi Rao', email: 'aditi.r@company.com', department: 'HR', role: 'Viewer', status: 'Pending', lastLogin: 'Never', createdDate: '2026-05-20' },
  ]);

  const [agentsList, setAgentsList] = useState<AgentRecord[]>([
    { id: '1', name: 'Lead Qualification Agent', department: 'Sales', status: 'Running', tasksCompleted: 14820, successRate: 98.4, cost: '₹2,450', lastExecution: 'Just Now', model: 'GPT-4o', memorySize: '1.4 MB', tools: ['CRM Sync', 'Email Gateway', 'Vector Search'] },
    { id: '2', name: 'Sales Closer Agent', department: 'Sales', status: 'Running', tasksCompleted: 9431, successRate: 97.2, cost: '₹4,120', lastExecution: '2m ago', model: 'Claude 3.5 Sonnet', memorySize: '4.8 MB', tools: ['Stripe Gateway', 'Slack Webhook', 'Proposal Engine'] },
    { id: '3', name: 'Proposal Builder Agent', department: 'Operations', status: 'Running', tasksCompleted: 4208, successRate: 95.8, cost: '₹1,980', lastExecution: '5m ago', model: 'GPT-4o-mini', memorySize: '512 KB', tools: ['Doc Templates', 'Google Drive'] },
    { id: '4', name: 'Audit Compliance Agent', department: 'Finance', status: 'Paused', tasksCompleted: 1205, successRate: 99.9, cost: '₹5,620', lastExecution: '1h ago', model: 'Claude 3 Opus', memorySize: '12 MB', tools: ['Ledger Audit', 'MFA Status', 'IP Registry'] },
    { id: '5', name: 'Invoice Processing Agent', department: 'Finance', status: 'Running', tasksCompleted: 24821, successRate: 99.1, cost: '₹840', lastExecution: '1m ago', model: 'GPT-4o-mini', memorySize: '256 KB', tools: ['ERP Ledger', 'Razorpay Sync', 'Email Gateway'] },
    { id: '6', name: 'Supplier SCM Negotiator', department: 'Operations', status: 'Failed', tasksCompleted: 341, successRate: 72.4, cost: '₹4,300', lastExecution: '12h ago', model: 'GPT-4o', memorySize: '2.5 MB', tools: ['Vendor APIs', 'Email Gateway'] },
  ]);

  const [auditLogs] = useState<AuditRecord[]>([
    { id: '1', timestamp: '2026-06-11 23:40:12', actor: 'Alexander Sterling', action: 'Modified Permission Set: Admin', module: 'Roles & Permissions', status: 'Success', ip: '192.168.1.104', device: 'macOS Chrome' },
    { id: '2', timestamp: '2026-06-11 23:38:05', actor: 'Invoice Processing Agent', action: 'Provisioned Ledger ID #9284', module: 'Finance / Invoices', status: 'Success', ip: '10.0.4.82', device: 'Agent Node 04' },
    { id: '3', timestamp: '2026-06-11 23:25:41', actor: 'System Daemon', action: 'Blocked Connection Attempt from RU-NET', module: 'Security Gateway', status: 'Warning', ip: '185.190.140.23', device: 'SOC Shield' },
    { id: '4', timestamp: '2026-06-11 23:12:09', actor: 'Supplier SCM Negotiator', action: 'API Timeout Failure: Supplier SLA endpoint', module: 'Operations', status: 'Failed', ip: '10.0.5.12', device: 'Agent Node 06' },
    { id: '5', timestamp: '2026-06-11 22:58:14', actor: 'Priya Mehta', action: 'Exported Financial Register CSV', module: 'Finance Ledgers', status: 'Success', ip: '192.168.1.201', device: 'Windows Edge' },
    { id: '6', timestamp: '2026-06-11 22:45:00', actor: 'Alexander Sterling', action: 'Suspended Operator User "Jane Doe"', module: 'User Management', status: 'Success', ip: '192.168.1.104', device: 'macOS Chrome' },
  ]);

  // ── FILTERED COMMANDS ──
  const filteredCommands = useMemo(() => {
    if (!commandSearch.trim()) return MENU_ITEMS;
    return MENU_ITEMS.filter(item => 
      item.label.toLowerCase().includes(commandSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(commandSearch.toLowerCase())
    );
  }, [commandSearch]);

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white flex flex-col font-sans selection:bg-white/20 select-none overflow-hidden relative view-accent-admin">
      
      {/* Dynamic Ambient Glows (21st.dev / React Bits Design) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-radial from-neutral-800/10 via-transparent to-transparent blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-radial from-neutral-900/15 via-transparent to-transparent blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-85" />
      </div>

      {/* ── STICKY EXECUTIVE COMMAND HEADER ── */}
      <header className="h-16 border-b border-white/5 bg-neutral-950/60 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 z-35 relative">
        <div className="flex items-center space-x-4">
          <div 
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex items-center space-x-2.5 cursor-pointer bg-white/5 border border-white/8 hover:border-white/20 px-3 py-1.5 rounded-xl transition-all select-none"
          >
            <div className="h-5 w-5 rounded-lg bg-white flex items-center justify-center font-black text-black text-xs">S</div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">{user?.orgName || 'SENTINEL CORP'}</div>
              <div className="text-[8px] font-mono text-white/40 mt-0.5">ADMIN SECTOR</div>
            </div>
            <ChevronDown size={11} className="text-white/40" />
          </div>

          <span className="h-5 w-px bg-white/10" />

          {/* Environment Tag */}
          <div className="flex items-center space-x-2">
            <span className="text-[8px] font-bold uppercase tracking-widest bg-white/5 text-white/70 border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-white animate-pulse"></span>
              PRODUCTION
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
              ONLINE
            </span>
          </div>
        </div>

        {/* Global Search & Middle Info */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2.5 px-4 h-9 w-64 bg-white/3 border border-white/5 hover:border-white/15 rounded-xl text-white/30 hover:text-white transition-all text-xs cursor-pointer text-left"
          >
            <Search size={12} />
            <span className="flex-1">Global Command Console...</span>
            <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[9px] tracking-wide text-white/45">Ctrl K</span>
          </button>

          {/* Time & Timezone */}
          <div className="flex items-center space-x-1.5 text-xs text-white/50 font-mono bg-white/3 px-3 py-1.5 rounded-xl border border-white/5">
            <Clock size={12} />
            <span>{currentTime || '23:52:05'}</span>
            <span className="text-white/30">|</span>
            <Globe size={11} className="text-white/30" />
            <span className="text-[9px] uppercase">IST</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Notifications Drawer */}
          <div className="relative">
            <button 
              onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileDropdownOpen(false); }}
              className="h-9 w-9 bg-white/3 border border-white/8 hover:border-white/25 rounded-xl flex items-center justify-center hover:bg-white/8 transition-colors text-white/70 hover:text-white cursor-pointer relative"
            >
              <Bell size={13} />
              <span className="absolute top-1 right-1.5 h-1.5 w-1.5 bg-white rounded-full animate-ping"></span>
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2.5 w-80 bg-neutral-950/95 border border-white/10 rounded-2xl p-4 shadow-2xl z-50 space-y-3 backdrop-blur-2xl"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Active Alerts ({systemAlerts.length})</span>
                      <button onClick={() => setSystemAlerts([])} className="text-[9px] text-white/30 hover:text-white transition-colors">Clear All</button>
                    </div>

                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {systemAlerts.map(alert => (
                        <div key={alert.id} className="p-3 bg-white/3 border border-white/5 rounded-xl text-left space-y-1.5 relative overflow-hidden group hover:border-white/15 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-white flex items-center gap-1">
                              {alert.severity === 'high' ? <AlertTriangle size={12} className="text-rose-500" /> : <Sparkles size={11} className="text-white/60" />}
                              {alert.title}
                            </span>
                            <span className="text-[8px] font-mono text-white/30">{alert.time}</span>
                          </div>
                          <p className="text-[10px] text-white/50 leading-relaxed">{alert.desc}</p>
                        </div>
                      ))}
                      {systemAlerts.length === 0 && (
                        <div className="text-[10px] text-white/30 italic text-center py-6">No pending warning alerts.</div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); setNotificationsOpen(false); }}
              className="flex items-center gap-2 bg-white/5 border border-white/8 hover:border-white/20 p-1 pr-2 rounded-xl transition-all cursor-pointer select-none"
            >
              <div className="h-7 w-7 rounded-lg bg-neutral-800 text-white flex items-center justify-center font-bold text-[11px] shrink-0 border border-white/10">
                AS
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">{user?.displayName || 'Admin'}</span>
              <ChevronDown size={11} className="text-white/40" />
            </button>

            <AnimatePresence>
              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2.5 w-56 bg-neutral-950 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-white/5 text-left mb-1">
                      <div className="text-xs font-semibold text-white truncate">{user?.displayName || 'Administrator'}</div>
                      <div className="text-[9px] font-mono text-white/45 truncate mt-0.5">{user?.email || 'admin@gmail.com'}</div>
                    </div>

                    <button 
                      onClick={() => { setProfileDropdownOpen(false); setActiveTab('settings'); }} 
                      className="w-full text-left px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Settings size={12} />
                      <span>Workspace Settings</span>
                    </button>
                    <button 
                      onClick={handleSignOut} 
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-colors flex items-center gap-2 border-t border-white/5 mt-1 pt-2"
                    >
                      <LogOut size={12} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* ── THREE COLUMN ARCHITECTURE ── */}
      <div className="flex-1 flex overflow-hidden z-10 relative">
        
        {/* ── LEFT: COMMAND NAVIGATION (Persistent Sidebar) ── */}
        <aside 
          className={`bg-neutral-950/80 border-r border-white/5 flex flex-col justify-between shrink-0 h-[calc(100vh-64px)] transition-all duration-300 z-20 relative select-none ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          }`}
        >
          <div className="space-y-4 pt-4 px-2 flex flex-col h-full overflow-hidden">
            
            {/* Quick Collapse Arrow */}
            <div className="flex justify-end px-2 shrink-0">
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/5 rounded flex items-center justify-center transition-all cursor-pointer"
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <ChevronRight size={13} className={`transform transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {/* Sidebar Modules List - Categorized */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 sidebar-scroll text-left">
              {Object.entries(
                MENU_ITEMS.reduce<Record<string, typeof MENU_ITEMS[number][]>>((acc, item) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item);
                  return acc;
                }, {})
              ).map(([category, items]) => (
                <div key={category} className="space-y-0.5">
                  {!sidebarCollapsed && (
                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest px-3 pt-2 pb-1 font-mono">
                      {category}
                    </div>
                  )}
                  <nav className="space-y-0.5">
                    {items.map(item => {
                      const IconComp = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group relative cursor-pointer ${
                            isActive 
                              ? 'bg-white/10 text-white font-semibold shadow-inner border-l-2 border-white' 
                              : 'text-white/40 hover:text-white hover:bg-white/5'
                          } ${sidebarCollapsed ? 'justify-center' : ''}`}
                        >
                          <IconComp size={14} className={isActive ? 'text-white' : 'text-white/40 group-hover:text-white'} />
                          {!sidebarCollapsed && (
                            <span className="text-[10px] font-medium uppercase tracking-wider truncate">{item.label}</span>
                          )}
                          
                          {/* Hover Previews/Tooltips when collapsed */}
                          {sidebarCollapsed && (
                            <div className="absolute left-16 top-1 bg-neutral-950 border border-white/10 px-2 py-1 rounded text-[8px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-mono">
                              {item.label}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            {/* Quick Favorites Bar */}
            {!sidebarCollapsed && (
              <div className="p-3 bg-white/3 border border-white/5 rounded-2xl text-left shrink-0 mb-4 space-y-2">
                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block font-mono">Quick Launch</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {['overview', 'agents', 'twin', 'security'].map(fav => {
                    const item = MENU_ITEMS.find(i => i.id === fav);
                    if (!item) return null;
                    const FavIcon = item.icon;
                    return (
                      <button 
                        key={fav}
                        onClick={() => setActiveTab(fav)}
                        className="h-8 rounded-lg bg-neutral-900 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
                        title={item.label}
                      >
                        <FavIcon size={12} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* ── CENTER: OPERATIONAL WORKSPACE (Main Surface) ── */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col space-y-8 select-none text-left relative z-10 scrollbar-thin">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              
              {/* TAB 1: OVERVIEW DASHBOARD */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Executive Header */}
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">MISSION CONTROL CENTRAL</h1>
                    <p className="text-xs text-white/45">Strategic intelligence cockpit coordinating biological and synthetic workforce stacks.</p>
                  </div>

                  {/* Executive KPI Section (Mission Status Board) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Organization Health Score', val: '98.6%', trend: '+0.4%', status: 'nominal', values: [95, 96, 97, 98, 98.6] },
                      { label: 'AI Workforce Efficiency', val: '94.2%', trend: '+2.1%', status: 'optimal', values: [82, 85, 89, 91, 94.2] },
                      { label: 'Workflow Success Rate', val: '99.94%', trend: '+0.02%', status: 'nominal', values: [99.8, 99.85, 99.9, 99.94] },
                      { label: 'Security Score Index', val: 'A+', trend: 'Steady', status: 'secured', values: [92, 94, 95, 98, 99] },
                      { label: 'Total Biological Staff', val: '1,284', trend: '+14', status: 'nominal', values: [1220, 1240, 1260, 1284] },
                      { label: 'Synthetic Agents Running', val: '5 Active', trend: 'Steady', status: 'optimal', values: [3, 4, 5, 5] },
                      { label: 'Monthly Transaction Load', val: '₹4.82 Cr', trend: '+12%', status: 'nominal', values: [3.8, 4.1, 4.5, 4.82] },
                      { label: 'Resource Storage Consumed', val: '78.2 TB', trend: '+4.2 TB', status: 'warning', values: [60, 68, 74, 78.2] }
                    ].map((kpi, idx) => (
                      <div key={idx} className="bg-neutral-950/45 border border-white/5 rounded-2xl p-4 space-y-3 relative overflow-hidden group hover:border-white/15 transition-all">
                        <div className="absolute top-0 left-0 w-1 h-full bg-white/20 group-hover:bg-white transition-colors" />
                        <div className="flex justify-between items-center text-[10px] text-white/45 font-bold uppercase tracking-wider pl-1.5">
                          <span>{kpi.label}</span>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            kpi.status === 'optimal' ? 'bg-purple-400' :
                            kpi.status === 'secured' ? 'bg-emerald-400 animate-pulse' :
                            kpi.status === 'warning' ? 'bg-amber-400 animate-pulse' : 'bg-white'
                          }`} />
                        </div>
                        <div className="flex items-baseline justify-between pl-1.5">
                          <span className="text-xl font-bold font-mono tracking-tight text-white">{kpi.val}</span>
                          <span className="text-[9px] font-mono text-white/40">{kpi.trend}</span>
                        </div>
                        
                        {/* Mini Sparkline Chart */}
                        <div className="h-6 flex items-end gap-1 px-1.5">
                          {kpi.values.map((v, vIdx) => {
                            const max = Math.max(...kpi.values);
                            const h = max > 0 ? (v / max) * 100 : 0;
                            return (
                              <div 
                                key={vIdx} 
                                className="flex-1 bg-white/10 rounded-sm" 
                                style={{ height: `${Math.max(h, 10)}%` }} 
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Workforce Overview & Real-Time token ticks */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Cpu size={13} className="text-white/60" />
                          Synthetic Workforce Observatory
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">LIVE SYNC</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-white/3 border border-white/5 rounded-2xl">
                          <div className="text-[9px] text-white/40 uppercase font-bold">Token Utilization</div>
                          <div className="text-lg font-bold font-mono text-white mt-1">42.8M</div>
                        </div>
                        <div className="p-3 bg-white/3 border border-white/5 rounded-2xl">
                          <div className="text-[9px] text-white/40 uppercase font-bold">Execution Cost</div>
                          <div className="text-lg font-bold font-mono text-white mt-1">₹19,290</div>
                        </div>
                        <div className="p-3 bg-white/3 border border-white/5 rounded-2xl">
                          <div className="text-[9px] text-white/40 uppercase font-bold">Synthetic Efficiency</div>
                          <div className="text-lg font-bold font-mono text-purple-400 mt-1">98.2%</div>
                        </div>
                      </div>

                      {/* Sparkline line showing simulated historical cost growth */}
                      <EnterpriseChart 
                        type="line"
                        height="160px"
                        colorTheme="rose"
                        data={[
                          { name: '10:00', value: 140 },
                          { name: '11:00', value: 180 },
                          { name: '12:00', value: 240 },
                          { name: '13:00', value: 210 },
                          { name: '14:00', value: 320 },
                          { name: '15:00', value: 390 }
                        ]}
                      />
                    </div>

                    {/* System Observability Health Gauges */}
                    <div className="lg:col-span-5 bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-4">
                      <div className="border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Activity size={13} className="text-white/60" />
                          System Health Observability
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          { label: 'CPU Shard Load', val: 32, status: 'nominal' },
                          { label: 'Memory Allocation', val: 78, status: 'warning' },
                          { label: 'DB Cluster Connection Latency', val: 14, status: 'nominal' },
                          { label: 'Message Queue Shards', val: 8, status: 'nominal' },
                          { label: 'API Gateway Response Threshold', val: 92, status: 'optimal' }
                        ].map((h, idx) => (
                          <div key={idx} className="space-y-1.5 text-xs">
                            <div className="flex justify-between font-mono">
                              <span className="text-white/60">{h.label}</span>
                              <span className={`font-bold ${h.status === 'warning' ? 'text-amber-400' : 'text-white'}`}>{h.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${
                                  h.status === 'warning' ? 'bg-amber-400' :
                                  h.status === 'optimal' ? 'bg-purple-400' : 'bg-white'
                                }`} 
                                style={{ width: `${h.val}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Multi-Agent Live Orchestration Monitor */}
                  <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={13} className="text-white/60 animate-pulse" />
                        Multi-Agent Operation Orchestrator (Orch-102)
                      </span>
                    </div>

                    {/* Animated Agent Connection Line Pipeline */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6 overflow-x-auto relative">
                      {[
                        { step: 1, name: 'Lead Qualifier Agent', model: 'GPT-4o', task: 'Index prospects' },
                        { step: 2, name: 'Sales Agent', model: 'Claude 3.5 Sonnet', task: 'Dispatch sales pitch' },
                        { step: 3, name: 'Proposal Builder Agent', model: 'GPT-4o-mini', task: 'Draft proposals' },
                        { step: 4, name: 'Finance Auditor Agent', model: 'Claude 3 Opus', task: 'Audit compliance ledger' },
                        { step: 5, name: 'Invoice Processing Agent', model: 'GPT-4o-mini', task: 'Dispatch payment webhook' }
                      ].map((step, idx, arr) => (
                        <React.Fragment key={step.step}>
                          <div className="flex flex-col items-center text-center space-y-2 relative z-10">
                            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center hover:border-white/30 transition-colors cursor-pointer group shadow-2xl relative">
                              <Cpu size={20} className="text-white/70 group-hover:scale-110 transition-transform" />
                              <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-black rounded-full animate-ping" />
                              <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-black rounded-full" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-white tracking-tight">{step.name}</div>
                              <div className="text-[8px] font-mono text-white/40 mt-0.5">{step.model}</div>
                              <div className="text-[8px] font-mono text-purple-400 bg-purple-500/10 px-1 py-0.5 rounded mt-1 inline-block">{step.task}</div>
                            </div>
                          </div>
                          
                          {idx < arr.length - 1 && (
                            <div className="flex-1 h-0.5 bg-dashed border-t border-white/10 hidden md:block relative min-w-[32px]">
                              {/* Pulse effect */}
                              <div className="absolute inset-y-0 left-0 w-2.5 h-0.5 bg-white rounded-full animate-[ping_1.5s_infinite]" style={{ animationDelay: `${idx * 300}ms` }} />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: USER MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <h1 className="text-xl font-bold tracking-tight text-white uppercase">USER REGISTRY MANAGER</h1>
                      <p className="text-xs text-white/45">Configure user access indices, suspend profiles, audit session lifespans, and assign roles.</p>
                    </div>

                    <button 
                      onClick={() => {
                        const newU: UserRecord = {
                          id: String(usersList.length + 1),
                          avatar: 'NN',
                          name: 'New Node Manager',
                          email: 'node.manager@company.com',
                          department: 'Engineering',
                          role: 'HR Manager',
                          status: 'Active',
                          lastLogin: 'Never',
                          createdDate: new Date().toISOString().split('T')[0]
                        };
                        setUsersList(prev => [...prev, newU]);
                      }}
                      className="h-9 px-4 bg-white text-black hover:bg-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Plus size={13} />
                      <span>Provision User Node</span>
                    </button>
                  </div>

                  {/* Users Data Grid */}
                  <EnterpriseDataGrid 
                    data={usersList}
                    searchKeys={['name', 'email', 'department', 'role']}
                    searchPlaceholder="Search operator users..."
                    columns={[
                      { 
                        key: 'name', 
                        label: 'Operator Identity', 
                        sortable: true,
                        render: (_, row) => (
                          <div className="flex items-center gap-2.5 text-left">
                            <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                              {row.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-white/90">{row.name}</div>
                              <div className="text-[9px] font-mono text-white/40">{row.email}</div>
                            </div>
                          </div>
                        )
                      },
                      { key: 'department', label: 'Department', sortable: true },
                      { key: 'role', label: 'RBAC Role Set', sortable: true },
                      { 
                        key: 'status', 
                        label: 'Status Gate', 
                        sortable: true,
                        render: (val) => (
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                            val === 'Active' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' :
                            val === 'Suspended' ? 'border-rose-500/20 bg-rose-500/5 text-rose-400' :
                            'border-amber-500/20 bg-amber-500/5 text-amber-400'
                          }`}>
                            {val}
                          </span>
                        )
                      },
                      { key: 'lastLogin', label: 'Last Login Shard', sortable: true },
                      { key: 'createdDate', label: 'Registered Date' }
                    ]}
                    rowActions={[
                      {
                        label: 'Toggle Gate',
                        action: (row) => {
                          setUsersList(prev => prev.map(u => u.id === row.id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
                        }
                      },
                      {
                        label: 'De-provision',
                        action: (row) => {
                          setUsersList(prev => prev.filter(u => u.id !== row.id));
                        }
                      }
                    ]}
                  />
                </div>
              )}

              {/* TAB 3: ROLE & PERMISSION MANAGEMENT */}
              {activeTab === 'rbac' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">ROLE & PERMISSION MATRIX</h1>
                    <p className="text-xs text-white/45">Configure RBAC authorization rules across biological nodes and synthetic agent operators.</p>
                  </div>

                  {/* Interactive matrix layout */}
                  <div className="bg-neutral-950/45 border border-white/5 rounded-3xl p-5 overflow-x-auto shadow-2xl">
                    <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/5 text-[9px] text-white/40 uppercase tracking-widest font-mono">
                          <th className="py-3 px-2">Access Rule Permission</th>
                          {['Super Admin', 'Admin', 'Finance Manager', 'HR Manager', 'Sales Manager', 'Viewer', 'Agent Supervisor'].map(role => (
                            <th key={role} className="py-3 px-2 text-center">{role}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-white/80">
                        {[
                          { key: 'create', label: 'Create Resources (Users/Data)' },
                          { key: 'read', label: 'Read/View Dashboards & Reports' },
                          { key: 'update', label: 'Update Operations Ledgers' },
                          { key: 'delete', label: 'Delete Records / Deprovision Nodes' },
                          { key: 'approve', label: 'Authorize Financial Escrow approvals' },
                          { key: 'export', label: 'Export Sensitive System Registers CSV' },
                          { key: 'agents', label: 'Configure Agent Core weights & prompts' },
                          { key: 'integrations', label: 'Inject Integration Hub secrets' },
                          { key: 'security', label: 'Administer firewall and IAM signatures' }
                        ].map(perm => (
                          <tr key={perm.key} className="hover:bg-white/[0.01]">
                            <td className="py-3.5 px-2 font-semibold text-white/90 text-left">{perm.label}</td>
                            {['Super Admin', 'Admin', 'Finance Manager', 'HR Manager', 'Sales Manager', 'Viewer', 'Agent Supervisor'].map(role => {
                              // Deterministic defaults
                              const hasPerm = role === 'Super Admin' || 
                                              (role === 'Admin' && perm.key !== 'delete') || 
                                              (role === 'Finance Manager' && ['read', 'update', 'approve', 'export'].includes(perm.key)) ||
                                              (role === 'HR Manager' && ['read', 'update', 'create'].includes(perm.key)) ||
                                              (role === 'Sales Manager' && ['read', 'update'].includes(perm.key)) ||
                                              (role === 'Viewer' && perm.key === 'read') ||
                                              (role === 'Agent Supervisor' && ['read', 'agents', 'update'].includes(perm.key));

                              return (
                                <td key={role} className="py-3.5 px-2 text-center">
                                  <label className="inline-flex items-center justify-center h-4.5 w-4.5 rounded border border-white/10 bg-white/5 hover:border-white/30 cursor-pointer select-none">
                                    <input 
                                      type="checkbox" 
                                      defaultChecked={hasPerm}
                                      className="rounded bg-black border-white/20 text-white accent-white focus:ring-0"
                                    />
                                  </label>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: DEPARTMENTS */}
              {activeTab === 'departments' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">ORGANIZATION STRUCTURE & DEPARTMENTS</h1>
                    <p className="text-xs text-white/45">Visualize internal operations nodes, managers, capital budgets, and execution indexes.</p>
                  </div>

                  {/* Visual tree hierarchy block list */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: 'Operations Node', head: 'Alexander Sterling', budget: '₹14.8 Cr', employees: 584, agents: 2, efficiency: 98.4 },
                      { name: 'Finance Sector', head: 'Priya Mehta', budget: '₹8.2 Cr', employees: 142, agents: 2, efficiency: 97.8 },
                      { name: 'Sales & Growth', head: 'Vikram Malhotra', budget: '₹12.4 Cr', employees: 341, agents: 2, efficiency: 94.2 }
                    ].map((dept, idx) => (
                      <div key={idx} className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-4 text-left relative overflow-hidden group hover:border-white/15 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{dept.name}</h3>
                            <span className="text-[9px] font-mono text-white/40 block mt-0.5">Head: {dept.head}</span>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{dept.efficiency}% Eff</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 font-mono text-[10px]">
                          <div>
                            <span className="text-white/40 block uppercase text-[8px]">Capital Budget</span>
                            <span className="text-white font-semibold">{dept.budget}</span>
                          </div>
                          <div>
                            <span className="text-white/40 block uppercase text-[8px]">Biological Node</span>
                            <span className="text-white font-semibold">{dept.employees} Staff</span>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          <span className="text-white/45">Orchestrated Agents:</span>
                          <span className="font-semibold text-white">{dept.agents} Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: AGENT REGISTRY */}
              {activeTab === 'agents' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <h1 className="text-xl font-bold tracking-tight text-white uppercase">SYNTHETIC WORKFORCE REGISTRY</h1>
                      <p className="text-xs text-white/45">Configure autonomous agents weights, toggle operational cycles, and monitor model memory limits.</p>
                    </div>
                  </div>

                  {/* Agents Data Grid */}
                  <EnterpriseDataGrid 
                    data={agentsList}
                    searchKeys={['name', 'department', 'model']}
                    searchPlaceholder="Filter running agents..."
                    columns={[
                      { 
                        key: 'name', 
                        label: 'Agent Identifier', 
                        sortable: true,
                        render: (_, row) => (
                          <div className="text-left">
                            <div className="font-semibold text-white/95 flex items-center gap-1.5">
                              <Cpu size={12} className="text-white/60" />
                              {row.name}
                            </div>
                            <div className="text-[8px] font-mono text-white/40 mt-0.5">{row.model}</div>
                          </div>
                        )
                      },
                      { key: 'department', label: 'Department', sortable: true },
                      { 
                        key: 'status', 
                        label: 'Status Code', 
                        sortable: true,
                        render: (val) => (
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                            val === 'Running' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' :
                            val === 'Paused' ? 'border-amber-500/20 bg-amber-500/5 text-amber-400' :
                            val === 'Failed' ? 'border-rose-500/20 bg-rose-500/5 text-rose-400 animate-pulse' :
                            'border-white/10 bg-white/5 text-white/50'
                          }`}>
                            {val}
                          </span>
                        )
                      },
                      { key: 'tasksCompleted', label: 'Tasks Executed', sortable: true },
                      { key: 'successRate', label: 'Success Rate', render: (val) => `${val}%` },
                      { key: 'cost', label: 'Resource Expense', sortable: true },
                      { key: 'lastExecution', label: 'Last Active Sync' }
                    ]}
                    rowActions={[
                      {
                        label: 'Cycle Status',
                        action: (row) => {
                          setAgentsList(prev => prev.map(a => a.id === row.id ? { ...a, status: a.status === 'Running' ? 'Paused' : 'Running' } : a));
                        }
                      },
                      {
                        label: 'Configure Weights',
                        action: (row) => {
                          alert(`Configuring prompt values for ${row.name}`);
                        }
                      }
                    ]}
                  />
                </div>
              )}

              {/* TAB 6: AGENT OBSERVABILITY */}
              {activeTab === 'observability' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">SYNTHETIC COGNITIVE OBSERVABILITY</h1>
                    <p className="text-xs text-white/45">Investigate reasoning latency index, context window consumption, and token transaction logs.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Hourly Inference Latency (ms)</h3>
                      <EnterpriseChart 
                        type="bar"
                        height="180px"
                        colorTheme="admin"
                        data={[
                          { name: '10am', value: 120 },
                          { name: '11am', value: 145 },
                          { name: '12pm', value: 210 },
                          { name: '1pm', value: 105 },
                          { name: '2pm', value: 95 },
                          { name: '3pm', value: 140 }
                        ]}
                      />
                    </div>

                    <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Memory Allocation Pool (MB)</h3>
                      <EnterpriseChart 
                        type="donut"
                        height="180px"
                        data={[
                          { name: 'Lead Qualifier', value: 1.4, color: '#FFFFFF' },
                          { name: 'Sales Closer', value: 4.8, color: '#E5E7EB' },
                          { name: 'Finance Agent', value: 12, color: '#9CA3AF' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: AGENT GOVERNANCE */}
              {activeTab === 'governance' && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">AI GOVERNANCE & LIMIT CONFIGURATION</h1>
                    <p className="text-xs text-white/45">Establish execution boundaries, human authority gates, allowed API tools, and budget safety rules.</p>
                  </div>

                  <div className="bg-neutral-950/45 border border-white/5 p-6 rounded-3xl space-y-6 max-w-2xl">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">System Override Auth Threshold</label>
                      <input type="range" className="w-full accent-white" defaultValue="80" />
                      <div className="flex justify-between text-[9px] text-white/40 font-mono">
                        <span>Low Risk Rules (Autopilot)</span>
                        <span>High Risk Rules (Require Admin MFA Approval)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">Allowed Integrations Array</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Stripe Webhook', 'Lead Database', 'Slack Notifications', 'System Ledger Writes'].map(tool => (
                          <label key={tool} className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl cursor-pointer">
                            <span className="text-xs text-white/80">{tool}</span>
                            <input type="checkbox" defaultChecked className="rounded bg-black border-white/20 text-white accent-white focus:ring-0" />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: DIGITAL TWIN */}
              {activeTab === 'twin' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">ENTERPRISE DIGITAL TWIN MAPPING</h1>
                    <p className="text-xs text-white/45">Visual relational node configuration showing structural relationships between employees, departments, and synthetic agents.</p>
                  </div>

                  {/* Custom Relational Twin Map Visual */}
                  <EnterpriseChart 
                    type="network"
                    height="320px"
                    data={[
                      { name: 'Admin', x: 80, y: 50, color: '#FFFFFF', value: 100 },
                      { name: 'Finance Sect', x: 240, y: 50, color: '#9CA3AF', value: 100 },
                      { name: 'Sales Closer', x: 80, y: 180, color: '#333333', value: 100 },
                      { name: 'SCM Negotiator', x: 240, y: 180, color: '#555555', value: 100 }
                    ]}
                  />
                </div>
              )}

              {/* TAB 9: WORKFLOWS */}
              {activeTab === 'workflows' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <h1 className="text-xl font-bold tracking-tight text-white uppercase">WORKFLOW VERSION STUDIO</h1>
                      <p className="text-xs text-white/45">Maintain and roll back automation logic rules across integrated pipelines.</p>
                    </div>
                  </div>

                  {/* List of active workflows */}
                  <div className="space-y-3">
                    {[
                      { name: 'Automated Invoice validation pipeline', status: 'Running', execs: 14022, success: 99.8, lastUpdate: '10m ago', version: 'v1.4' },
                      { name: 'Lead qualification dispatch router', status: 'Running', execs: 9410, success: 98.4, lastUpdate: '1h ago', version: 'v2.1' },
                      { name: 'Vendor supply contract SLA checks', status: 'Halted', execs: 310, success: 82.1, lastUpdate: '1d ago', version: 'v1.0' }
                    ].map((wf, idx) => (
                      <div key={idx} className="p-4 bg-neutral-950/45 border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                        <div className="space-y-1.5 text-left">
                          <h4 className="text-xs font-bold text-white">{wf.name}</h4>
                          <div className="flex gap-2 text-[9px] font-mono text-white/40">
                            <span>Executions: {wf.execs}</span>
                            <span>•</span>
                            <span>Success Rate: {wf.success}%</span>
                            <span>•</span>
                            <span>Active Ver: {wf.version}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button onClick={() => alert(`Reverting to older version of ${wf.name}`)} className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[9px] font-bold text-white border border-white/10 rounded-lg cursor-pointer">
                            Rollback
                          </button>
                          <button className="px-2 py-1 bg-white text-black text-[9px] font-bold rounded-lg cursor-pointer">
                            Publish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 10: INTEGRATIONS */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">CONNECTED SERVICES HUB</h1>
                    <p className="text-xs text-white/45">Integrate platform operations with external SaaS backends, clouds, and LLM APIs.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Google Workspace', status: 'Active', latency: '42ms', calls: '12,480', owner: 'Rahul V' },
                      { name: 'Slack Notifications', status: 'Active', latency: '82ms', calls: '82,109', owner: 'Rahul V' },
                      { name: 'AWS S3 Storage', status: 'Active', latency: '12ms', calls: '480,240', owner: 'A. Sterling' },
                      { name: 'Stripe Gateway', status: 'Active', latency: '98ms', calls: '24,821', owner: 'Priya Mehta' },
                      { name: 'Razorpay Sync', status: 'Active', latency: '110ms', calls: '14,208', owner: 'Priya Mehta' },
                      { name: 'Anthropic Claude API', status: 'Active', latency: '140ms', calls: '8,420', owner: 'A. Sterling' }
                    ].map((intg, idx) => (
                      <div key={idx} className="p-4 bg-neutral-950/45 border border-white/5 rounded-2xl space-y-3 text-left hover:border-white/15 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{intg.name}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-white/50 pt-2 border-t border-white/5">
                          <div>
                            <span>LATENCY</span>
                            <div className="text-white font-semibold">{intg.latency}</div>
                          </div>
                          <div>
                            <span>API CALLS</span>
                            <div className="text-white font-semibold">{intg.calls}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 11: SECURITY CENTER */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">SECURITY GATEWAY OBSERVABILITY</h1>
                    <p className="text-xs text-white/45">Evaluate threat indices, examine blocked IP pools, and check MFA validation metrics.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-3 text-left">
                      <span className="text-[10px] text-white/40 uppercase font-bold">Failed Login Attempts</span>
                      <div className="text-2xl font-bold text-white font-mono">14</div>
                      <span className="text-[9px] text-emerald-400">0.02% of total auths</span>
                    </div>
                    <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-3 text-left">
                      <span className="text-[10px] text-white/40 uppercase font-bold">MFA Compliance Rate</span>
                      <div className="text-2xl font-bold text-white font-mono">98.4%</div>
                      <span className="text-[9px] text-white/40">2 remaining profiles</span>
                    </div>
                    <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-3 text-left">
                      <span className="text-[10px] text-white/40 uppercase font-bold">Active Threat Score</span>
                      <div className="text-2xl font-bold text-emerald-400 font-mono">LOW</div>
                      <span className="text-[9px] text-emerald-400">All gateway modules secured</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 12: AUDIT CENTER */}
              {activeTab === 'audit' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">CENTRAL WORKSPACE AUDIT LOGS</h1>
                    <p className="text-xs text-white/45">Comprehensive audit index recording actor, execution timestamp, module target, and validation status.</p>
                  </div>

                  {/* Audit Logs table */}
                  <EnterpriseDataGrid 
                    data={auditLogs}
                    searchKeys={['actor', 'action', 'module', 'ip']}
                    searchPlaceholder="Filter audit records..."
                    columns={[
                      { key: 'timestamp', label: 'Timestamp (IST)', sortable: true },
                      { key: 'actor', label: 'Actor', sortable: true },
                      { key: 'action', label: 'Action Description', sortable: true },
                      { key: 'module', label: 'Module Node', sortable: true },
                      { 
                        key: 'status', 
                        label: 'Status Code', 
                        sortable: true,
                        render: (val) => (
                          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border ${
                            val === 'Success' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' :
                            val === 'Warning' ? 'border-amber-500/20 bg-amber-500/5 text-amber-400 animate-pulse' :
                            'border-rose-500/20 bg-rose-500/5 text-rose-400'
                          }`}>
                            {val}
                          </span>
                        )
                      },
                      { key: 'ip', label: 'Source IP', sortable: true },
                      { key: 'device', label: 'User Agent' }
                    ]}
                  />
                </div>
              )}

              {/* TAB 13: SYSTEM MONITORING */}
              {activeTab === 'monitoring' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">SERVER & DATABASE OBSERVABILITY</h1>
                    <p className="text-xs text-white/45">Observability panel tracking live database latency (ms) and CPU allocation limits.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Database Read/Write Latency (ms)</h3>
                      <EnterpriseChart 
                        type="line"
                        height="180px"
                        colorTheme="rose"
                        data={[
                          { name: '10s ago', value: 0.8 },
                          { name: '8s ago', value: 1.2 },
                          { name: '6s ago', value: 0.9 },
                          { name: '4s ago', value: 1.4 },
                          { name: '2s ago', value: 0.7 },
                          { name: 'Now', value: 0.9 }
                        ]}
                      />
                    </div>

                    <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Queue Processing Capacity</h3>
                      <EnterpriseChart 
                        type="bar"
                        height="180px"
                        colorTheme="amber"
                        data={[
                          { name: 'Shard A', value: 85 },
                          { name: 'Shard B', value: 92 },
                          { name: 'Shard C', value: 64 },
                          { name: 'Shard D', value: 78 }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 14: BILLING & USAGE */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">BILLING METRICS & USAGE LIMITS</h1>
                    <p className="text-xs text-white/45">Examine billing limits, storage fees, token costs, and predicted Q3 capital expenses.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Resource Limits</h3>
                      <div className="space-y-4 pt-2">
                        {[
                          { label: 'Token Window Quota', val: '42.8M of 100M', percent: 42 },
                          { label: 'Workspace Cloud Storage', val: '78.2 TB of 120 TB', percent: 65 },
                          { label: 'Connected API Gates', val: '6 of 12', percent: 50 }
                        ].map((lim, idx) => (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between text-white/60">
                              <span>{lim.label}</span>
                              <span className="font-semibold text-white">{lim.val}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-white transition-all duration-500" style={{ width: `${lim.percent}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-3 text-left flex flex-col justify-between">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Forecasted Q3 Spend</h3>
                      <div className="py-2">
                        <div className="text-3xl font-mono font-bold text-purple-400">₹8,42,000</div>
                        <p className="text-[10px] text-white/40 mt-1 leading-relaxed">System forecasts an increase in SCM negotiating tokens due to upcoming Q3 manufacturing orders. Recommending model tier shifts to optimize costs.</p>
                      </div>
                      <button className="h-9 w-full bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors">
                        Download Optimization Plan
                      </button>
                    </div>
                  </div>

                  {/* Infrastructure Cost Allocation Treemap */}
                  <div className="bg-neutral-950/45 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Infrastructure Cost Allocation (Treemap)</h3>
                      <p className="text-[10px] text-white/45">Mathematically partitioned resource costs proportional to active runtime utilization load</p>
                    </div>
                    <div className="h-64 w-full">
                      <EnterpriseChart 
                        type="treemap"
                        data={[
                          { name: 'LLM Token Inference', value: 42, color: 'rgba(139, 92, 246, 0.12)' },
                          { name: 'Cloud File Storage', value: 35, color: 'rgba(59, 130, 246, 0.12)' },
                          { name: 'Core Database Clusters', value: 13, color: 'rgba(16, 185, 129, 0.12)' },
                          { name: 'API Integration Webhooks', value: 10, color: 'rgba(99, 102, 241, 0.12)' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 15: WORKSPACE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">WORKSPACE SYSTEM SETTINGS</h1>
                    <p className="text-xs text-white/45">Configure workspace parameters, switch API signing keys, and manage workspace identity profiles.</p>
                  </div>

                  <div className="bg-neutral-950/45 border border-white/5 p-6 rounded-3xl max-w-xl text-left space-y-4">
                    <div className="space-y-1 text-xs">
                      <label className="text-white/60 font-semibold">Workspace Name</label>
                      <input 
                        type="text" 
                        defaultValue={user?.orgName || 'Acme Industries'} 
                        className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-white/20 transition-colors"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-white/60 font-semibold">Primary Industry Domain</label>
                      <input 
                        type="text" 
                        defaultValue={user?.industry || 'Manufacturing'} 
                        className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-white/20 transition-colors"
                      />
                    </div>

                    <div className="pt-2">
                      <button onClick={() => alert("Settings updated successfully.")} className="h-10 px-4 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors">
                        Commit Configurations
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>

        {/* ── RIGHT: AI COPILOT + ACTIVITY FEED PANEL ── */}
        <aside className="w-80 border-l border-white/5 bg-neutral-950/80 p-5 flex flex-col justify-between shrink-0 h-[calc(100vh-64px)] z-20 relative select-none">
          <div className="flex flex-col h-full justify-between space-y-6 overflow-hidden">
            
            {/* Context AI Assistant Title */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center">
                  <Sparkles size={13} className="text-black" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider block">Sentinel Assistant</span>
                  <span className="text-[7px] font-mono text-purple-400 uppercase tracking-widest leading-none">Contextual Awareness</span>
                </div>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-left scrollbar-thin">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[11px] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-white text-black font-semibold' 
                      : 'bg-white/5 border border-white/5 text-white/90'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[7px] font-mono text-white/25 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {chatTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl py-2 px-3 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Context-Driven Quick Suggestion Triggers */}
            <div className="space-y-2 text-left">
              <span className="text-[8px] font-bold text-white/25 uppercase tracking-widest font-mono">Suggested commands</span>
              <div className="flex flex-col gap-1.5">
                {tabHelperPrompts.map((prompt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSendMessage(undefined, prompt)}
                    className="w-full text-left px-3 py-1.5 text-[10px] bg-white/3 border border-white/8 hover:border-white/20 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer truncate"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* User Message Input */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/5 flex items-center gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Admin Assistant..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-white/20 focus:ring-1 focus:ring-white/10 h-9"
              />
              <button 
                type="submit"
                className="h-9 w-9 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send size={12} />
              </button>
            </form>

          </div>
        </aside>

      </div>

      {/* ── GLOBAL INTERACTIVE COMMAND PALETTE OVERLAY (CTRL + K) ── */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommandPaletteOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col"
            >
              <div className="relative border-b border-white/5 p-3 flex items-center gap-2.5">
                <Search size={14} className="text-white/40" />
                <input 
                  type="text"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder="Type a command or module page to navigate..."
                  className="flex-1 bg-transparent text-sm outline-none text-white placeholder-white/25 h-8"
                  autoFocus
                />
                <button 
                  onClick={() => setCommandPaletteOpen(false)}
                  className="text-[10px] font-mono text-white/30 border border-white/10 px-2 py-0.5 rounded"
                >
                  ESC
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2 text-left space-y-1.5">
                <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest px-2.5 pt-1.5">MODULE NAVIGATION</div>
                {filteredCommands.map(item => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setCommandPaletteOpen(false);
                        setCommandSearch('');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={12} className="text-white/40" />
                        <span>{item.label}</span>
                      </span>
                      <span className="text-[8px] font-mono text-white/30 uppercase">{item.category}</span>
                    </button>
                  );
                })}
                {filteredCommands.length === 0 && (
                  <div className="text-[10px] text-white/30 italic px-3 py-6 text-center">No matching commands found.</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
