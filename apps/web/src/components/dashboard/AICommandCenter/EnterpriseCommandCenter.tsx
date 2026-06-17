import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Shield, 
  Cpu, 
  Users, 
  Zap, 
  Landmark, 
  Wrench, 
  ShieldAlert, 
  Sparkles, 
  ShoppingCart, 
  Briefcase, 
  Package, 
  CheckSquare,
  Workflow,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Globe,
  Radio
} from 'lucide-react';

// ── TYPES FOR THE REDESIGNED NEURAL MAP ──
interface Agent {
  name: string;
  task: string;
  confidence: number;
  memory: string;
  tools: string[];
}

interface DeptNode {
  id: string;
  name: string;
  label: string;
  icon: any;
  status: 'healthy' | 'warning' | 'critical' | 'processing';
  workload: number;
  aiCount: number;
  riskScore: number;
  pendingApprovals: number;
  activeWorkflows: string[];
  color: string;
  angle: number; // circular layout angle in degrees
  agents: Agent[];
}

const DEPARTMENTS: DeptNode[] = [
  {
    id: 'finance',
    name: 'Finance Ledger Agent',
    label: 'Finance',
    icon: Landmark,
    status: 'healthy',
    workload: 68,
    aiCount: 3,
    riskScore: 8,
    pendingApprovals: 1,
    activeWorkflows: ['MTD Ledger Reconciliation', 'Invoice Fraud Scan'],
    color: '#10B981', // Emerald
    angle: -90,
    agents: [
      { name: 'Audit Agent', task: 'Reviewing ledger accounts', confidence: 98, memory: '4.8 MB', tools: ['Ledger Database', 'Regex Check'] },
      { name: 'Budget Agent', task: 'Analyzing monthly variance', confidence: 97, memory: '3.2 MB', tools: ['Predictive Regress'] },
      { name: 'Forecast Agent', task: 'Forecasting cash flow constraints', confidence: 99, memory: '2.5 MB', tools: ['Time Series Shard'] }
    ]
  },
  {
    id: 'hr',
    name: 'Human Capital Operations',
    label: 'Human Resources',
    icon: Users,
    status: 'processing',
    workload: 42,
    aiCount: 3,
    riskScore: 5,
    pendingApprovals: 0,
    activeWorkflows: ['Onboarding Flow (4 Engineers)', 'Leave Accrual Recalibration'],
    color: '#3B82F6', // Electric Blue
    angle: -54,
    agents: [
      { name: 'Recruitment Agent', task: 'Parsing applicant resumes', confidence: 94, memory: '6.4 MB', tools: ['LinkedIn API', 'CV Parser'] },
      { name: 'Training Agent', task: 'Matching skill modules to employee profiles', confidence: 96, memory: '3.1 MB', tools: ['LMS Engine'] },
      { name: 'Performance Agent', task: 'Evaluating annual OKR targets', confidence: 98, memory: '2.2 MB', tools: ['OKR Sync API'] }
    ]
  },
  {
    id: 'procure',
    name: 'Autonomous Procurement',
    label: 'Procurement',
    icon: ShoppingCart,
    status: 'critical',
    workload: 85,
    aiCount: 3,
    riskScore: 72,
    pendingApprovals: 3,
    activeWorkflows: ['Steel Sourcing RFQ Bidding', 'Logistics SLA Compliance review'],
    color: '#EF4444', // Red
    angle: -18,
    agents: [
      { name: 'Vendor Agent', task: 'Monitoring vendor SLA alerts', confidence: 91, memory: '8.2 MB', tools: ['SCM Registry', 'SLA Evaluator'] },
      { name: 'Contract Agent', task: 'Scanning contract penalty triggers', confidence: 93, memory: '5.1 MB', tools: ['Legal Classifier'] },
      { name: 'Purchase Agent', task: 'Evaluating PO budget ceilings', confidence: 95, memory: '3.4 MB', tools: ['Purchase ledger'] }
    ]
  },
  {
    id: 'ops',
    name: 'Operations & Dispatch Control',
    label: 'Operations',
    icon: Activity,
    status: 'processing',
    workload: 74,
    aiCount: 3,
    riskScore: 28,
    pendingApprovals: 2,
    activeWorkflows: ['Dynamic Route Optimization', 'Fulfillment Queue Calibration'],
    color: '#3B82F6', // Electric Blue
    angle: 18,
    agents: [
      { name: 'Dispatch Agent', task: 'Scheduling delivery slots', confidence: 96, memory: '5.2 MB', tools: ['Mapbox API', 'Weather API'] },
      { name: 'Fleet Agent', task: 'Tracking vehicle sensor warnings', confidence: 97, memory: '4.1 MB', tools: ['IoT Stream Shard'] },
      { name: 'Route Agent', task: 'Re-routing due to freight delays', confidence: 95, memory: '3.9 MB', tools: ['Traffic Engine'] }
    ]
  },
  {
    id: 'compliance',
    name: 'Corporate Policy Compliance',
    label: 'Compliance',
    icon: Shield,
    status: 'healthy',
    workload: 30,
    aiCount: 3,
    riskScore: 4,
    pendingApprovals: 0,
    activeWorkflows: ['GDPR Personal Data Audit'],
    color: '#10B981', // Emerald
    angle: 54,
    agents: [
      { name: 'Policy Agent', task: 'Scanning database for PII leaks', confidence: 99, memory: '12.0 MB', tools: ['PII Lexicon', 'Query Audit'] },
      { name: 'Audit Agent', task: 'Validating IAM group rules', confidence: 99, memory: '3.2 MB', tools: ['AD Registry', 'MFA Status'] },
      { name: 'Ethics Agent', task: 'Checking bias weights in LLMs', confidence: 98, memory: '2.4 MB', tools: ['Model Evaluator'] }
    ]
  },
  {
    id: 'risk',
    name: 'Systemic Exposure Risk Analytics',
    label: 'Risk Center',
    icon: ShieldAlert,
    status: 'warning',
    workload: 55,
    aiCount: 3,
    riskScore: 45,
    pendingApprovals: 1,
    activeWorkflows: ['Firewall Intrusion Mitigation'],
    color: '#F59E0B', // Amber
    angle: 90,
    agents: [
      { name: 'Threat Agent', task: 'Analyzing RU-NET login attempt', confidence: 92, memory: '10.0 MB', tools: ['IP Lookup API', 'Geo Block'] },
      { name: 'Credit Agent', task: 'Evaluating buyer credit solvency', confidence: 95, memory: '4.1 MB', tools: ['Credit Registry'] },
      { name: 'Limit Agent', task: 'Tracking total transaction caps', confidence: 97, memory: '2.1 MB', tools: ['Ledger Controller'] }
    ]
  },
  {
    id: 'sales',
    name: 'Sales Intelligence & CRM',
    label: 'Sales',
    icon: Briefcase,
    status: 'healthy',
    workload: 48,
    aiCount: 3,
    riskScore: 12,
    pendingApprovals: 0,
    activeWorkflows: ['Acme Enterprise Deal Setup'],
    color: '#10B981', // Emerald
    angle: 126,
    agents: [
      { name: 'Lead Agent', task: 'Scoring inbound registrations', confidence: 95, memory: '3.5 MB', tools: ['HubSpot Sync', 'Scoring Model'] },
      { name: 'Closer Agent', task: 'Drafting custom proposal bounds', confidence: 94, memory: '4.8 MB', tools: ['Pricing Engine'] },
      { name: 'Promo Agent', task: 'Recommending pricing updates', confidence: 96, memory: '3.1 MB', tools: ['Competitor Scanner'] }
    ]
  },
  {
    id: 'mfg',
    name: 'Manufacturing & Shop Floor AI',
    label: 'Manufacturing',
    icon: Wrench,
    status: 'warning',
    workload: 62,
    aiCount: 3,
    riskScore: 38,
    pendingApprovals: 2,
    activeWorkflows: ['CNC Machine Vibration Review'],
    color: '#F59E0B', // Amber
    angle: 162,
    agents: [
      { name: 'BOM Agent', task: 'Optimizing Bill of Materials config', confidence: 97, memory: '2.9 MB', tools: ['PLM Database'] },
      { name: 'Machine Agent', task: 'Evaluating telemetry sensors', confidence: 94, memory: '5.4 MB', tools: ['Vibration Stream'] },
      { name: 'Quality Agent', task: 'Running camera defect scan', confidence: 98, memory: '6.2 MB', tools: ['Image Model'] }
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory & Stock Logistics',
    label: 'Inventory',
    icon: Package,
    status: 'critical',
    workload: 88,
    aiCount: 3,
    riskScore: 65,
    pendingApprovals: 1,
    activeWorkflows: ['Warehouse A Restocking Sync'],
    color: '#EF4444', // Red
    angle: 198,
    agents: [
      { name: 'Stock Agent', task: 'Comparing barcode counts in ERP', confidence: 96, memory: '3.8 MB', tools: ['Barcode API'] },
      { name: 'Reorder Agent', task: 'Triggering RFQ thresholds', confidence: 97, memory: '2.7 MB', tools: ['Margin Calculator'] },
      { name: 'Space Agent', task: 'Planning warehouse volume usage', confidence: 95, memory: '4.5 MB', tools: ['Warehouse API'] }
    ]
  },
  {
    id: 'projects',
    name: 'Delivery Operations Control',
    label: 'Projects',
    icon: CheckSquare,
    status: 'healthy',
    workload: 30,
    aiCount: 3,
    riskScore: 15,
    pendingApprovals: 0,
    activeWorkflows: ['Acme Milestone Delivery Verification'],
    color: '#10B981', // Emerald
    angle: 234,
    agents: [
      { name: 'Timeline Agent', task: 'Estimating task completion odds', confidence: 98, memory: '2.2 MB', tools: ['Jira API'] },
      { name: 'Resource Agent', task: 'Assigning engineers to tasks', confidence: 96, memory: '3.6 MB', tools: ['Skills Database'] },
      { name: 'Task Agent', task: 'Mapping project timeline delays', confidence: 99, memory: '1.8 MB', tools: ['Gantt Controller'] }
    ]
  }
];

// ── LAYER 6: SUBTLE KNOWLEDGE GRAPH BACKGROUND DATA ──
const KNOWLEDGE_GRAPH_NODES = [
  { label: 'Employee #491', x: 80, y: 120 },
  { label: 'Invoice #SN-102', x: 520, y: 90 },
  { label: 'Vendor Tata Mfg', x: 140, y: 480 },
  { label: 'Customer Reliance', x: 440, y: 520 },
  { label: 'Asset Server Node', x: 380, y: 80 },
  { label: 'Policy SOC2-v3', x: 90, y: 380 },
  { label: 'Project Onboard', x: 510, y: 410 },
  { label: 'Contract SCM-92', x: 60, y: 220 },
  { label: 'Invoice SN-109', x: 540, y: 280 },
  { label: 'Asset Machine A', x: 100, y: 520 },
  { label: 'Policy CCPA-v1', x: 480, y: 200 },
  { label: 'Employee Priya M', x: 230, y: 130 },
  { label: 'Employee Rohan S', x: 280, y: 480 },
  { label: 'Vendor Apollo HC', x: 490, y: 150 },
  { label: 'Customer BlueDart', x: 50, y: 310 },
  { label: 'Contract FIN-14', x: 400, y: 440 },
  { label: 'Asset Truck B', x: 340, y: 180 },
  { label: 'Invoice SN-110', x: 150, y: 240 },
  { label: 'Employee Aditi R', x: 200, y: 400 },
  { label: 'Policy GDPR-v2', x: 430, y: 110 }
];

// ── LAYER 5: WORKFLOW SIMULATION PATHS ──
interface WorkflowRoute {
  name: string;
  steps: string[]; // Ordered list of department IDs
}

const SIMULATED_WORKFLOWS: WorkflowRoute[] = [
  { name: 'Purchase Request: Procurement → Finance → Approval Agent → Compliance → Execution', steps: ['procure', 'finance', 'compliance', 'risk'] },
  { name: 'Candidate Onboarding Contract Flow: HR → Compliance → Projects', steps: ['hr', 'compliance', 'projects'] },
  { name: 'Warehouse Stock Reorder Flow: Inventory → Procurement → Finance', steps: ['inventory', 'procure', 'finance'] },
  { name: 'Sales Deal Closed Pipeline: Sales → Finance → Compliance → Operations', steps: ['sales', 'finance', 'compliance', 'ops'] }
];

// ── REAL-TIME EVENT INTERFACE ──
interface LiveEvent {
  id: string;
  type: 'invoice' | 'vendor' | 'risk' | 'workflow' | 'employee';
  title: string;
  description: string;
  deptId: string;
  timestamp: string;
}

const EVENT_POOL: Omit<LiveEvent, 'id' | 'timestamp'>[] = [
  { type: 'invoice', title: 'Invoice Approved', description: 'Finance Agent verified PO-982 ($12,400)', deptId: 'finance' },
  { type: 'vendor', title: 'Vendor Added', description: 'Procurement swarm validated supplier compliance credentials', deptId: 'procure' },
  { type: 'risk', title: 'SLA Threat Flagged', description: 'Risk Agent detected latency spike on shipping API gateway', deptId: 'risk' },
  { type: 'workflow', title: 'Workflow Triggered', description: 'Automated warehouse replenishment stream initialized', deptId: 'inventory' },
  { type: 'employee', title: 'Employee Onboarded', description: 'HR Agent automatically generated AD credentials and NDA', deptId: 'hr' },
  { type: 'invoice', title: 'Ledger Audit Pass', description: 'Reconciliation Agent finalized monthly compliance review', deptId: 'finance' },
  { type: 'risk', title: 'Anomaly Blocked', description: 'SecOps Agent isolated unauthorized endpoint access request', deptId: 'risk' },
  { type: 'vendor', title: 'Contract Finalized', description: 'Legal Swarm completed draft reviews with Acme Corp', deptId: 'procure' }
];

export default function EnterpriseCommandCenter() {
  const [healthScore, setHealthScore] = useState(98.79);
  const [decisionsToday, setDecisionsToday] = useState(2551);
  const [savings, setSavings] = useState(42855);
  
  // Selection and Interaction states
  const [selectedNode, setSelectedNode] = useState<DeptNode | { id: string; name: string; label: string; confidence: number } | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{
    type: 'dept' | 'agent' | 'connection';
    id: string;
    label: string;
    details: string[];
    x: number;
    y: number;
  } | null>(null);

  // Mouse Parallax coordinates (Layer 6, 2, 1 depths)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Layer 5 Workflow Sim state
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState(0);
  const [workflowStep, setWorkflowStep] = useState(-1); // -1 = idle

  // Layer 7 Global Digital Twin Pulse state
  const [twinPulse, setTwinPulse] = useState(false);

  // Live System Events state
  const [liveEvent, setLiveEvent] = useState<LiveEvent | null>(null);
  const [recentEvents, setRecentEvents] = useState<LiveEvent[]>([]);

  // Set initial selected node as Executive AI on mount
  useEffect(() => {
    setSelectedNode({
      id: 'exec',
      name: 'EXECUTIVE AI CORE',
      label: 'Executive Core',
      confidence: 98.4
    });
  }, []);

  // Parallax tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  // Heartbeat simulated updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthScore(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
      setDecisionsToday(prev => prev + Math.floor(Math.random() * 2));
      setSavings(prev => prev + Math.floor(Math.random() * 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Layer 5: Workflow Execution Streams simulation loop
  useEffect(() => {
    const startWorkflow = () => {
      setActiveWorkflowIdx(Math.floor(Math.random() * SIMULATED_WORKFLOWS.length));
      setWorkflowStep(0);
    };

    // Run a workflow every 14 seconds
    const loopInterval = setInterval(startWorkflow, 14000);
    // Trigger first workflow after 2 seconds
    const timeout = setTimeout(startWorkflow, 2000);

    return () => {
      clearInterval(loopInterval);
      clearTimeout(timeout);
    };
  }, []);

  // Advance workflow step every 1.5 seconds when active
  useEffect(() => {
    if (workflowStep === -1) return;

    const route = SIMULATED_WORKFLOWS[activeWorkflowIdx];
    if (workflowStep < route.steps.length) {
      const stepTimer = setTimeout(() => {
        setWorkflowStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(stepTimer);
    } else {
      // Completed, return to idle
      const idleTimer = setTimeout(() => {
        setWorkflowStep(-1);
      }, 2000);
      return () => clearTimeout(idleTimer);
    }
  }, [workflowStep, activeWorkflowIdx]);

  // Layer 7: Digital Twin pulse trigger (every 8 seconds)
  useEffect(() => {
    const pulseTimer = setInterval(() => {
      setTwinPulse(true);
      setTimeout(() => setTwinPulse(false), 2500);
    }, 8000);
    return () => clearInterval(pulseTimer);
  }, []);

  // Live Event simulation trigger (every 6 seconds)
  useEffect(() => {
    const triggerEvent = () => {
      const randomBase = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      const id = 'EV-' + Math.floor(100 + Math.random() * 900);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newEvent: LiveEvent = {
        ...randomBase,
        id,
        timestamp: time
      };

      setLiveEvent(newEvent);
      setRecentEvents(prev => [newEvent, ...prev.slice(0, 4)]);

      // Clear the active alert overlay after 3.5s
      setTimeout(() => {
        setLiveEvent(null);
      }, 3500);
    };

    const eventInterval = setInterval(triggerEvent, 6500);
    const initialTimeout = setTimeout(triggerEvent, 4000);

    return () => {
      clearInterval(eventInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  // Dynamic layout constants
  const XC = 300;
  const YC = 300;
  const R = 190; // Circular ring radius

  // Map departments to coordinates
  const computedDepts = useMemo(() => {
    return DEPARTMENTS.map(dept => {
      const theta = (dept.angle * Math.PI) / 180;
      const x = XC + R * Math.cos(theta);
      const y = YC + R * Math.sin(theta);
      return { ...dept, x, y };
    });
  }, [XC, YC, R]);

  const activeWorkflowRoute = useMemo(() => {
    if (workflowStep === -1) return null;
    return SIMULATED_WORKFLOWS[activeWorkflowIdx];
  }, [workflowStep, activeWorkflowIdx]);

  return (
    <div className="p-6 space-y-6 text-left selection:bg-white/20 select-none overflow-hidden" onMouseMove={handleMouseMove}>
      
      {/* ── TOP KPI SECTION ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
        {[
          { label: "Enterprise Health", val: `${healthScore}%`, desc: "System Sync nominal", icon: Activity, color: "text-emerald-400" },
          { label: "Active AI Workforce", val: "30 Agents", desc: "Swarms forming live", icon: Cpu, color: "text-purple-400" },
          { label: "Human Operators", val: "1,284 Mapped", desc: "Roles active", icon: Users, color: "text-blue-400" },
          { label: "Active Workflows", val: "12 Channels", desc: "Automated routing", icon: Zap, color: "text-yellow-400" },
          { label: "Decisions Today", val: decisionsToday.toLocaleString(), desc: "Reinforced learning", icon: Shield, color: "text-cyan-400" },
          { label: "Cumulative Savings", val: `$${savings.toLocaleString()}`, desc: "SLA optimizations MTD", icon: Landmark, color: "text-teal-400" }
        ].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="bg-neutral-950/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-between min-h-[100px] hover:border-white/10 transition-colors">
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

      {/* ── CENTER WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT COLUMN: Redesigned Concentric Graphic Container */}
        <div className="lg:col-span-8 bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[580px] shadow-2xl group/map">
          
          {/* Dashboard HUD Overlays */}
          <div className="absolute top-5 left-6 z-20 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 flex items-center gap-1.5 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              Enterprise Intelligence Matrix
            </h3>
            <p className="text-[10px] text-white/40 leading-none">Living Neural Ecosystem • Autonomous Agent Collaborations</p>
          </div>

          <div className="absolute top-5 right-6 z-20 text-right space-y-1 font-mono text-[9px] text-white/35">
            <div>MODE: AUTONOMOUS OBSERVABILITY</div>
            <div>DECISION CYCLE: 60FPS STABLE</div>
          </div>

          {/* Live System Event Floating Toast Overlay */}
          <AnimatePresence>
            {liveEvent && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-16 left-6 right-6 mx-auto max-w-[420px] bg-neutral-950/90 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] rounded-xl px-4 py-2.5 z-30 backdrop-blur-md flex items-center gap-3"
              >
                <div className="h-7 w-7 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/25">
                  <Radio size={14} className="text-purple-400 animate-pulse" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-white font-mono uppercase tracking-wide">{liveEvent.title}</span>
                    <span className="text-[8px] text-white/40 font-mono">{liveEvent.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-white/70 truncate">{liveEvent.description}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Workflow HUD Progress Banner */}
          {activeWorkflowRoute && (
            <div className="absolute bottom-5 left-6 z-20 bg-neutral-950/80 border border-white/10 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-2xl backdrop-blur-md">
              <Workflow size={13} className="text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
              <div className="text-left font-mono">
                <div className="text-[8px] text-purple-400 font-bold uppercase tracking-widest">ACTIVE EVENT STREAM</div>
                <div className="text-[9px] text-white font-medium mt-0.5 leading-tight">{activeWorkflowRoute.name}</div>
                <div className="flex items-center gap-1 mt-1 text-[8px] text-white/40">
                  <span>Step {Math.min(workflowStep + 1, activeWorkflowRoute.steps.length)}/{activeWorkflowRoute.steps.length}:</span>
                  <span className="text-purple-300 uppercase">
                    {workflowStep < activeWorkflowRoute.steps.length 
                      ? `Propagating to ${activeWorkflowRoute.steps[workflowStep]}`
                      : 'Execution Finalized'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Core Interactive Neural Sandbox */}
          <div className="relative w-full max-w-[560px] aspect-square flex items-center justify-center mt-6 select-none">
            
            {/* SVG CONNECTION LAYER */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" 
              viewBox="0 0 600 600"
              style={{
                // Parallax background layer displacement
                transform: `translate(${mousePos.x * 4}px, ${mousePos.y * 4}px)`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              <defs>
                {/* Neon Glow Filters */}
                <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-event" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Gradients */}
                <radialGradient id="exec-pulse-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.3" />
                  <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ── LAYER 6: BACKGROUND SUBTLE KNOWLEDGE GRAPH OVERLAY ── */}
              <g opacity="0.14" style={{ transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`, transition: 'transform 0.25s ease-out' }}>
                {KNOWLEDGE_GRAPH_NODES.map((kn, idx) => (
                  <g key={idx}>
                    <circle cx={kn.x} cy={kn.y} r="2.5" fill="#a3a3a3" />
                    <text x={kn.x + 5} y={kn.y + 2.5} className="text-[6px] fill-white/60 font-mono select-none" pointerEvents="none">
                      {kn.label}
                    </text>
                    {/* Connecting faint background lines */}
                    {idx < KNOWLEDGE_GRAPH_NODES.length - 1 && (
                      <line 
                        x1={kn.x} 
                        y1={kn.y} 
                        x2={KNOWLEDGE_GRAPH_NODES[idx + 1].x} 
                        y2={KNOWLEDGE_GRAPH_NODES[idx + 1].y} 
                        stroke="rgba(255, 255, 255, 0.08)" 
                        strokeWidth="0.5" 
                      />
                    )}
                  </g>
                ))}
              </g>

              {/* ── LAYER 7: DIGITAL TWIN GLOBAL RADIAL NETWORK PULSE ── */}
              {twinPulse && (
                <circle cx={XC} cy={YC} r="0" fill="none" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" filter="url(#glow-purple)">
                  <animate attributeName="r" from="15" to="285" dur="3s" repeatCount="1" />
                  <animate attributeName="opacity" from="1" to="0" dur="3s" repeatCount="1" />
                </circle>
              )}

              {/* Live event propagation light wave */}
              {liveEvent && (
                <circle cx={XC} cy={YC} r="0" fill="none" stroke="#a855f7" strokeWidth="2.5" filter="url(#glow-event)">
                  <animate attributeName="r" from="10" to="270" dur="1.8s" repeatCount="1" />
                  <animate attributeName="opacity" from="1" to="0" dur="1.8s" repeatCount="1" />
                </circle>
              )}

              {/* Radar Circular Guidelines */}
              <circle cx={XC} cy={YC} r={R} fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              <circle cx={XC} cy={YC} r="130" fill="none" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="1" />
              <circle cx={XC} cy={YC} r="70" fill="none" stroke="rgba(255, 255, 255, 0.01)" strokeWidth="1" />

              {/* ── LAYER 4: REAL-TIME DATA FLOW LINES ── */}
              {computedDepts.map((d) => {
                const isSelected = selectedNode?.id === d.id || selectedNode?.id === 'exec';
                const isWorkflowStep = activeWorkflowRoute && 
                  workflowStep !== -1 && 
                  workflowStep < activeWorkflowRoute.steps.length &&
                  activeWorkflowRoute.steps[workflowStep] === d.id;

                const isLiveEventTarget = liveEvent && liveEvent.deptId === d.id;

                return (
                  <g key={d.id}>
                    {/* Hoverable wide interactive track */}
                    <line 
                      x1={XC} 
                      y1={YC} 
                      x2={d.x} 
                      y2={d.y} 
                      stroke="transparent" 
                      strokeWidth="12" 
                      className="cursor-pointer pointer-events-auto"
                      onMouseEnter={() => {
                        setHoveredItem({
                          type: 'connection',
                          id: `conn-${d.id}`,
                          label: `Executive Core ↔ ${d.label}`,
                          details: [
                            `Telemetry Exchange Rate: ${(d.workload * 1.5).toFixed(0)} msg/s`,
                            `Transactions Processed MTD: ${(d.workload * 42).toLocaleString()}`,
                            `Channel Integrity Level: 100% nominal`
                          ],
                          x: (XC + d.x) / 2,
                          y: (YC + d.y) / 2
                        });
                      }}
                      onMouseLeave={() => setHoveredItem(null)}
                    />

                    {/* Radial connection path */}
                    <path
                      id={`path-${d.id}`}
                      d={`M ${XC} ${YC} L ${d.x} ${d.y}`}
                      stroke={
                        isLiveEventTarget ? '#c084fc' :
                        isWorkflowStep ? '#c084fc' : 
                        isSelected ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)'
                      }
                      strokeWidth={isLiveEventTarget ? 3.5 : isWorkflowStep ? 3 : isSelected ? 1.5 : 1}
                      fill="none"
                      filter={isLiveEventTarget || isWorkflowStep ? 'url(#glow-purple)' : ''}
                      style={{ transition: 'stroke-width 0.4s ease, stroke 0.4s ease' }}
                    />

                    {/* Dashed autoscrolling flow pulse line */}
                    <path
                      d={`M ${XC} ${YC} L ${d.x} ${d.y}`}
                      stroke={d.color}
                      strokeWidth="1.5"
                      strokeDasharray="6 24"
                      fill="none"
                      opacity={isSelected ? 0.6 : 0.25}
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="-120" dur="2.5s" repeatCount="indefinite" />
                    </path>

                    {/* GPU accelerated moving data particles */}
                    <circle r="3" fill={d.color} filter="url(#glow-cyan)">
                      <animateMotion dur={`${1.8 + Math.random() * 1.5}s`} repeatCount="indefinite" path={`M ${XC} ${YC} L ${d.x} ${d.y}`} />
                    </circle>
                    
                    {/* Live event fast signal particle */}
                    {isLiveEventTarget && (
                      <circle r="5.5" fill="#ffffff" filter="url(#glow-event)">
                        <animateMotion dur="0.6s" repeatCount="3" path={`M ${XC} ${YC} L ${d.x} ${d.y}`} />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* ── LAYER 5: ACTIVE WORKFLOW STREAM ROADS ── */}
              {activeWorkflowRoute && workflowStep !== -1 && (
                <g>
                  {activeWorkflowRoute.steps.map((stepId, idx) => {
                    if (idx === 0) return null;
                    const prevDept = computedDepts.find(d => d.id === activeWorkflowRoute.steps[idx - 1]);
                    const currDept = computedDepts.find(d => d.id === stepId);
                    if (!prevDept || !currDept) return null;

                    const isStepActive = workflowStep === idx;
                    
                    return (
                      <g key={idx}>
                        {/* Highlighted temporary route path */}
                        <path
                          d={`M ${prevDept.x} ${prevDept.y} L ${currDept.x} ${currDept.y}`}
                          stroke={isStepActive ? '#A855F7' : 'rgba(168, 85, 247, 0.4)'}
                          strokeWidth={isStepActive ? 4 : 2}
                          fill="none"
                          filter="url(#glow-purple)"
                          opacity="0.8"
                          style={{ transition: 'all 0.5s ease' }}
                        />
                        {/* Glowing packet moving between stages */}
                        {isStepActive && (
                          <circle r="5.5" fill="#e9d5ff" filter="url(#glow-purple)">
                            <animateMotion dur="1.4s" repeatCount="indefinite" path={`M ${prevDept.x} ${prevDept.y} L ${currDept.x} ${currDept.y}`} />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>

            {/* Orbit Swarm CSS Declarations */}
            <style>{`
              @keyframes spin-cw {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes spin-ccw {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
              }
              @keyframes breath-scale {
                0% { transform: translate(-50%, -50%) scale(0.96); opacity: 0.9; }
                50% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(0.96); opacity: 0.9; }
              }
              .orbit-fast-cw {
                transform-origin: 0px 0px;
                animation: spin-cw 9s linear infinite;
              }
              .orbit-med-ccw {
                transform-origin: 0px 0px;
                animation: spin-ccw 14s linear infinite;
              }
              .orbit-slow-cw {
                transform-origin: 0px 0px;
                animation: spin-cw 20s linear infinite;
              }
              .exec-breath {
                animation: breath-scale 4.5s ease-in-out infinite;
              }
              .dept-node-glow:hover {
                filter: drop-shadow(0 0 8px currentColor);
              }
            `}</style>

            {/* ── LAYER 2: ENTERPRISE DEPARTMENTS RING ── */}
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
                transition: 'transform 0.15s ease-out'
              }}
            >
              {computedDepts.map((d) => {
                const IconComp = d.icon;
                const isSelected = selectedNode?.id === d.id;
                
                // Color state based on node health
                const statusBorderColor = 
                  d.status === 'healthy' ? 'rgba(16, 185, 129, 0.4)' :
                  d.status === 'warning' ? 'rgba(245, 158, 11, 0.4)' :
                  d.status === 'critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)';
                
                const activeWorkflowNode = activeWorkflowRoute && 
                  workflowStep !== -1 && 
                  workflowStep < activeWorkflowRoute.steps.length &&
                  activeWorkflowRoute.steps[workflowStep] === d.id;

                const isLiveEventTarget = liveEvent && liveEvent.deptId === d.id;

                return (
                  <div
                    key={d.id}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${(d.x / 600) * 100}%`,
                      top: `${(d.y / 600) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 30
                    }}
                  >
                    {/* SVG sub-render for orbiting Agent Swarm (Layer 3) */}
                    <svg 
                      width="90" 
                      height="90" 
                      viewBox="-45 -45 90 90" 
                      className="absolute overflow-visible pointer-events-none"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* Swarm orbiting pathways */}
                      <circle r="26" fill="none" stroke={`${d.color}18`} strokeWidth="0.5" strokeDasharray="3 3" />
                      <circle r="34" fill="none" stroke={`${d.color}08`} strokeWidth="0.5" strokeDasharray="1 4" />
                      
                      {/* Orbiting Agent 1 (Fast CW) */}
                      <g className="orbit-fast-cw pointer-events-auto">
                        <line x1="0" y1="0" x2="26" y2="0" stroke={`${d.color}15`} strokeWidth="0.5" />
                        <circle 
                          cx="26" 
                          cy="0" 
                          r="3.5" 
                          fill={d.color} 
                          filter="url(#glow-cyan)"
                          className="cursor-pointer hover:scale-130 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode(d);
                          }}
                          onMouseEnter={() => {
                            setHoveredItem({
                              type: 'agent',
                              id: `${d.id}-agent-0`,
                              label: `${d.agents[0].name} (${d.label})`,
                              details: [
                                `Objective: ${d.agents[0].task}`,
                                `Confidence Level: ${d.agents[0].confidence}%`,
                                `Memory Space: ${d.agents[0].memory}`,
                                `Tools Integrated: ${d.agents[0].tools.join(', ')}`
                              ],
                              x: d.x,
                              y: d.y - 25
                            });
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                        />
                        <circle cx="13" cy="0" r="1.5" fill="#fff" opacity="0.6">
                          <animate attributeName="cx" from="0" to="26" dur="1.2s" repeatCount="indefinite" />
                        </circle>
                      </g>

                      {/* Orbiting Agent 2 (Medium CCW) */}
                      <g className="orbit-med-ccw pointer-events-auto">
                        <line x1="0" y1="0" x2="-34" y2="0" stroke={`${d.color}15`} strokeWidth="0.5" />
                        <circle 
                          cx="-34" 
                          cy="0" 
                          r="3.5" 
                          fill={d.color} 
                          filter="url(#glow-cyan)"
                          className="cursor-pointer hover:scale-130 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode(d);
                          }}
                          onMouseEnter={() => {
                            setHoveredItem({
                              type: 'agent',
                              id: `${d.id}-agent-1`,
                              label: `${d.agents[1].name} (${d.label})`,
                              details: [
                                `Objective: ${d.agents[1].task}`,
                                `Confidence Level: ${d.agents[1].confidence}%`,
                                `Memory Space: ${d.agents[1].memory}`,
                                `Tools Integrated: ${d.agents[1].tools.join(', ')}`
                              ],
                              x: d.x,
                              y: d.y - 25
                            });
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                        />
                        <circle cx="-17" cy="0" r="1.5" fill="#fff" opacity="0.6">
                          <animate attributeName="cx" from="0" to="-34" dur="1.7s" repeatCount="indefinite" />
                        </circle>
                      </g>

                      {/* Orbiting Agent 3 (Slow CW) */}
                      <g className="orbit-slow-cw pointer-events-auto">
                        <line x1="0" y1="0" x2="0" y2="28" stroke={`${d.color}15`} strokeWidth="0.5" />
                        <circle 
                          cx="0" 
                          cy="28" 
                          r="3.5" 
                          fill={d.color} 
                          filter="url(#glow-cyan)"
                          className="cursor-pointer hover:scale-130 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode(d);
                          }}
                          onMouseEnter={() => {
                            setHoveredItem({
                              type: 'agent',
                              id: `${d.id}-agent-2`,
                              label: `${d.agents[2].name} (${d.label})`,
                              details: [
                                `Objective: ${d.agents[2].task}`,
                                `Confidence Level: ${d.agents[2].confidence}%`,
                                `Memory Space: ${d.agents[2].memory}`,
                                `Tools Integrated: ${d.agents[2].tools.join(', ')}`
                              ],
                              x: d.x,
                              y: d.y - 25
                            });
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                        />
                        <circle cx="0" cy="14" r="1.5" fill="#fff" opacity="0.6">
                          <animate attributeName="cy" from="0" to="28" dur="2.2s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    </svg>

                    {/* Department Node Center Button */}
                    <button
                      onClick={() => setSelectedNode(d)}
                      onMouseEnter={() => {
                        setHoveredItem({
                          type: 'dept',
                          id: d.id,
                          label: d.name,
                          details: [
                            `Workload Load: ${d.workload}%`,
                            `Active Agents: ${d.aiCount} swarms`,
                            `Exposure Risk: ${d.riskScore}%`,
                            `Awaiting Approvals: ${d.pendingApprovals}`,
                            `Active Workflows: ${d.activeWorkflows.join(', ')}`
                          ],
                          x: d.x,
                          y: d.y - 25
                        });
                      }}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-all duration-300 relative group cursor-pointer ${
                        isSelected 
                          ? 'bg-neutral-900 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-110' 
                          : 'bg-black/95 border-white/10 text-white/50 hover:text-white hover:border-white/30'
                      } dept-node-glow`}
                      style={{
                        color: isSelected ? d.color : '',
                        boxShadow: isLiveEventTarget ? `0 0 28px #a855f7` : isSelected ? `0 0 16px ${d.color}44` : activeWorkflowNode ? `0 0 24px #A855F7` : 'none',
                        borderColor: isLiveEventTarget ? '#a855f7' : isSelected ? d.color : activeWorkflowNode ? '#c084fc' : statusBorderColor,
                      }}
                    >
                      {/* Status indicator dot */}
                      <span 
                        className={`absolute top-1 right-1 h-1.5 w-1.5 rounded-full ${
                          d.status === 'healthy' ? 'bg-emerald-500' :
                          d.status === 'warning' ? 'bg-amber-500' :
                          d.status === 'critical' ? 'bg-rose-500' : 'bg-blue-400 animate-pulse'
                        }`}
                      />
                      
                      <IconComp size={15} style={{ color: isSelected ? d.color : '' }} />

                      {/* Event notification pulsing circle */}
                      {(activeWorkflowNode || isLiveEventTarget) && (
                        <span className="absolute inset-0 rounded-xl border border-purple-500 animate-ping opacity-75" />
                      )}
                    </button>

                    {/* Department mini badge label */}
                    <div className="absolute top-7 left-0 translate-x-[-50%] whitespace-nowrap bg-neutral-950/90 px-1.5 py-0.5 rounded border border-white/5 text-[7px] uppercase tracking-wider text-white/40 group-hover/map:text-white/60 select-none pointer-events-none font-mono">
                      {d.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── LAYER 1: EXECUTIVE AI CORE ── */}
            <div 
              className="absolute pointer-events-auto exec-breath"
              style={{
                left: `${(XC / 600) * 100}%`,
                top: `${(YC / 600) * 100}%`,
                zIndex: 40,
                transform: `translate(-50%, -50%) translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              {/* Outer halo rotation (Layer 1) */}
              <div 
                className="absolute inset-[-20px] rounded-full border border-dashed border-purple-500/20" 
                style={{ transformOrigin: 'center', animation: 'spin-cw 26s linear infinite' }}
              />
              <div 
                className="absolute inset-[-12px] rounded-full border border-dashed border-cyan-500/30" 
                style={{ transformOrigin: 'center', animation: 'spin-ccw 16s linear infinite' }}
              />

              {/* Concentric scale pulse ring */}
              <div className="absolute inset-[-26px] rounded-full bg-purple-500/5 border border-purple-500/10 animate-ping" style={{ animationDuration: '3.5s' }} />
              
              <button
                onClick={() => setSelectedNode({
                  id: 'exec',
                  name: 'EXECUTIVE AI CORE',
                  label: 'Executive Core',
                  confidence: 98.4
                })}
                onMouseEnter={() => {
                  setHoveredItem({
                    type: 'dept',
                    id: 'exec',
                    label: 'EXECUTIVE AI CORE (Brain)',
                    details: [
                      'Objective: Coordinate biological and synthetic swarms',
                      'Confidence Level: 98.4% (Multi-Agent Consensus)',
                      'Connected Nodes: 10 Operational departments',
                      'Active Agent Substrates: 30 instances',
                      'Global System Sync Status: 100% nominal'
                    ],
                    x: XC,
                    y: YC - 25
                  });
                }}
                onMouseLeave={() => setHoveredItem(null)}
                className="h-16 w-16 rounded-full bg-black border border-purple-500/40 hover:border-cyan-400 flex flex-col items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(168,85,247,0.3)] relative overflow-hidden transition-all duration-300 active:scale-95"
              >
                {/* Purple/Cyan gradient background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/35 via-cyan-950/15 to-purple-950/35 opacity-70" />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-0.5">
                  <Sparkles size={16} className="text-purple-400 animate-pulse" />
                  <span className="text-[7px] font-mono font-bold tracking-widest text-cyan-400 uppercase mt-1">EXEC AI</span>
                  <span className="text-[8px] font-mono text-white/70 font-semibold">98.4%</span>
                </div>
              </button>
            </div>

            {/* ── INTERACTIVE HOVER FLOATING TOOLTIP ── */}
            <AnimatePresence>
              {hoveredItem && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute z-50 bg-neutral-950/95 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-none text-left w-56 space-y-1.5"
                  style={{
                    left: `${(hoveredItem.x / 600) * 100}%`,
                    top: `${(hoveredItem.y / 600) * 100}%`,
                    transform: 'translate(-50%, -105%)'
                  }}
                >
                  <div className="text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/5 pb-1 flex items-center gap-1.5">
                    {hoveredItem.type === 'agent' ? (
                      <Cpu size={10} className="text-purple-400 animate-pulse" />
                    ) : hoveredItem.type === 'connection' ? (
                      <Radio size={10} className="text-cyan-400 animate-pulse" />
                    ) : (
                      <Sparkles size={10} className="text-cyan-400" />
                    )}
                    <span className="truncate">{hoveredItem.label}</span>
                  </div>
                  <div className="space-y-1 text-[8px] font-mono text-white/60 leading-relaxed">
                    {hoveredItem.details.map((d, i) => (
                      <div key={i} className="truncate">{d}</div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Telemetry HUD Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Selected Node Profile (Dynamically Synchronized) */}
          <div className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 text-left flex flex-col justify-between flex-1 min-h-[300px]">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-8 w-8 rounded-xl flex items-center justify-center"
                          style={{ 
                            backgroundColor: selectedNode.id === 'exec' ? 'rgba(168, 85, 247, 0.1)' : `${(selectedNode as DeptNode).color}15`, 
                            border: `1px solid ${selectedNode.id === 'exec' ? 'rgba(168, 85, 247, 0.3)' : `${(selectedNode as DeptNode).color}35`}` 
                          }}
                        >
                          {selectedNode.id === 'exec' ? (
                            <Sparkles size={14} className="text-purple-400" />
                          ) : (
                            React.createElement((selectedNode as DeptNode).icon, { size: 14, style: { color: (selectedNode as DeptNode).color } })
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase text-white tracking-wider leading-none">{selectedNode.name}</h4>
                          <span className="text-[9px] text-white/35 leading-none mt-1 block font-mono">
                            {selectedNode.id === 'exec' ? 'Central Swarm Supervisor' : 'Department Operational Substrate'}
                          </span>
                        </div>
                      </div>

                      <span
                        className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border font-mono"
                        style={{
                          color: selectedNode.id === 'exec' ? '#c084fc' : (selectedNode as DeptNode).status === 'critical' ? '#EF4444' : (selectedNode as DeptNode).status === 'warning' ? '#F59E0B' : '#10B981',
                          borderColor: selectedNode.id === 'exec' ? 'rgba(168, 85, 247, 0.2)' : (selectedNode as DeptNode).status === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          backgroundColor: selectedNode.id === 'exec' ? 'rgba(168, 85, 247, 0.05)' : 'rgba(255, 255, 255, 0.02)'
                        }}
                      >
                        {selectedNode.id === 'exec' ? 'Active' : (selectedNode as DeptNode).status}
                      </span>
                    </div>

                    {selectedNode.id === 'exec' ? (
                      /* Executive AI telemetry details */
                      <div className="space-y-2.5 text-xs text-white/70">
                        <div className="flex justify-between">
                          <span className="text-white/40 font-mono">Consensus Level:</span>
                          <span className="font-mono font-semibold text-purple-400">98.40% (Nominal)</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-purple-500" style={{ width: '98.4%' }} />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Total Active Sub-Swarms:</span>
                          <span className="font-mono font-semibold text-white">30 Agent Nodes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Knowledge Matrix Load:</span>
                          <span className="font-mono font-semibold text-cyan-400 font-mono">4,902 vectors</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Decision Strategy:</span>
                          <span className="text-white font-mono text-[10px]">Recursive Consensus Graph</span>
                        </div>
                      </div>
                    ) : (
                      /* Department-specific telemetry details */
                      <div className="space-y-2.5 text-xs text-white/70">
                        <div className="flex justify-between">
                          <span className="text-white/40">Departmental Workload:</span>
                          <span className="font-mono font-semibold" style={{ color: (selectedNode as DeptNode).color }}>{(selectedNode as DeptNode).workload}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(selectedNode as DeptNode).workload}%`, backgroundColor: (selectedNode as DeptNode).color }}
                          />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Asset Exposure Risk:</span>
                          <span className="font-mono font-semibold text-white">{(selectedNode as DeptNode).riskScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Pending Human Approvals:</span>
                          <span className="font-mono font-semibold text-amber-400">{(selectedNode as DeptNode).pendingApprovals} POs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Active Workflows:</span>
                          <span className="font-semibold text-white text-right max-w-[150px] truncate block">{(selectedNode as DeptNode).activeWorkflows.join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inner Active Swarm List */}
                  <div className="border-t border-white/5 pt-4 space-y-2.5 mt-4">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block font-mono">
                      {selectedNode.id === 'exec' ? 'EXECUTIVE INTELLIGENCE PRINCIPLES' : 'ACTIVE DEPARTMENTAL AGENTS'}
                    </span>
                    <div className="flex flex-col gap-2">
                      {selectedNode.id === 'exec' ? (
                        <>
                          <div className="flex items-start gap-2 text-[10px] text-white/60">
                            <span className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0" />
                            <span>Run continuous recursive checks on business compliance states.</span>
                          </div>
                          <div className="flex items-start gap-2 text-[10px] text-white/60">
                            <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full mt-1.5 shrink-0" />
                            <span>Audit transaction queues and flag suspicious financial anomalies.</span>
                          </div>
                          <div className="flex items-start gap-2 text-[10px] text-white/60">
                            <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full mt-1.5 shrink-0" />
                            <span>Optimize cross-departmental communication data streams autonomously.</span>
                          </div>
                        </>
                      ) : (
                        (selectedNode as DeptNode).agents.map((agent, aIdx) => (
                          <div key={aIdx} className="p-2.5 bg-white/3 border border-white/5 rounded-xl space-y-1 text-left font-mono">
                            <div className="flex justify-between items-center text-[10px] font-bold text-white">
                              <span className="flex items-center gap-1">
                                <Cpu size={10} style={{ color: (selectedNode as DeptNode).color }} />
                                {agent.name}
                              </span>
                              <span className="text-emerald-400">{agent.confidence}% conf</span>
                            </div>
                            <div className="text-[9px] text-white/60 leading-normal mt-0.5">{agent.task}</div>
                            <div className="text-[8px] text-white/30 pt-1 flex justify-between">
                              <span>Memory: {agent.memory}</span>
                              <span className="truncate max-w-[120px]">Tools: {agent.tools.join(', ')}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-white/35">
                  Select a node to inspect system metrics
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Live System Events Monitor */}
          <div className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Live Event Dispatch</span>
              <span className="text-[9px] text-purple-400 font-semibold flex items-center gap-1 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                REAL-TIME STREAM
              </span>
            </div>

            <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
              {recentEvents.length > 0 ? (
                recentEvents.map((ev) => (
                  <div key={ev.id} className="p-2.5 bg-white/3 border border-white/5 rounded-xl space-y-1.5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-bold text-white/30">{ev.id}</span>
                      <span className="text-[8px] text-white/45 font-mono">{ev.timestamp}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-white/95">{ev.title}</div>
                    <p className="text-[9px] text-white/50 leading-relaxed font-mono">{ev.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-[10px] text-white/30">Awaiting system events...</div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ── BOTTOM SECTION: REAL-TIME SWARM RUNS ── */}
      <div className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 text-left space-y-4 relative z-10">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">SWARM ACTIVITY MONITOR</span>
          <span className="text-[9px] text-emerald-400 font-mono">100% SECURE GATEWAY</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1 hover:border-white/10 transition-all cursor-pointer">
            <div className="text-[9px] font-bold text-white/30 font-mono uppercase tracking-wider">Finance Swarm</div>
            <p className="text-xs font-medium text-white/90">Audit checks initiated for 18 invoice listings.</p>
            <div className="text-[9px] text-white/40 font-medium pt-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Finance Agent active</span>
            </div>
          </div>
          <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1 hover:border-white/10 transition-all cursor-pointer">
            <div className="text-[9px] font-bold text-white/30 font-mono uppercase tracking-wider">Procurement Swarm</div>
            <p className="text-xs font-medium text-white/90">Supplier bid validation in progress for raw logistics materials.</p>
            <div className="text-[9px] text-white/40 font-medium pt-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
              <span>Procurement & Risk Agent active</span>
            </div>
          </div>
          <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1 hover:border-white/10 transition-all cursor-pointer">
            <div className="text-[9px] font-bold text-white/30 font-mono uppercase tracking-wider">HR Swarm</div>
            <p className="text-xs font-medium text-white/90">Autonomous onboarding contracts successfully compiled.</p>
            <div className="text-[9px] text-white/40 font-medium pt-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>HR Agent active</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
