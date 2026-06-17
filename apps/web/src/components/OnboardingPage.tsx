import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Check, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ChevronDown, 
  BrainCircuit
} from 'lucide-react';
import { saveOnboardingData } from '../services/firebase';


/* ── MODULE DEFINITIONS ── */
interface ModuleItem {
  id: string;
  title: string;
  category: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
}

const ALL_MODULES: ModuleItem[] = [
  // Core default-enabled modules (CRM, Sales Management, Procurement, Purchase Management)
  {
    id: 'crm',
    title: 'CRM',
    category: 'Core Foundation',
    complexity: 'LOW',
    description: 'Manage client communications, sales pipelines, lead tracking, and contact details.'
  },
  {
    id: 'sales_mgmt',
    title: 'Sales Management',
    category: 'Core Foundation',
    complexity: 'MEDIUM',
    description: 'Process customer orders, invoices, sales quotas, pricing matrices, and shipping status.'
  },
  {
    id: 'procurement',
    title: 'Procurement',
    category: 'Core Foundation',
    complexity: 'MEDIUM',
    description: 'Source materials, select vendors, manage request for quotations (RFQs), and purchase agreements.'
  },
  {
    id: 'purchase_mgmt',
    title: 'Purchase Management',
    category: 'Core Foundation',
    complexity: 'MEDIUM',
    description: 'Track purchase orders (POs), inventory receipts, billing validations, and vendor payments.'
  },

  // CATEGORY: Manufacturing & Operations
  {
    id: 'mfg_erp',
    title: 'Manufacturing ERP',
    category: 'Manufacturing & Operations',
    complexity: 'HIGH',
    description: 'Production planning, work orders, quality checks, BOM management, machine monitoring, and shop-floor operations.'
  },
  {
    id: 'scm',
    title: 'Supply Chain Management',
    category: 'Manufacturing & Operations',
    complexity: 'MEDIUM',
    description: 'Demand forecasting, procurement optimization, supplier collaboration, logistics planning.'
  },
  {
    id: 'qms',
    title: 'Quality Management System',
    category: 'Manufacturing & Operations',
    complexity: 'MEDIUM',
    description: 'Inspection workflows, compliance tracking, defect management, and audit readiness.'
  },
  {
    id: 'asset_mgmt',
    title: 'Asset & Equipment Management',
    category: 'Manufacturing & Operations',
    complexity: 'MEDIUM',
    description: 'Maintenance schedules, machine lifecycle management, predictive maintenance, and asset tracking.'
  },
  {
    id: 'prod_intel',
    title: 'Production Intelligence',
    category: 'Manufacturing & Operations',
    complexity: 'HIGH',
    description: 'AI-driven production analytics, efficiency monitoring, bottleneck detection, and predictive insights.'
  },

  // CATEGORY: Retail & Commerce
  {
    id: 'retail_mgmt',
    title: 'Retail Management',
    category: 'Retail & Commerce',
    complexity: 'MEDIUM',
    description: 'POS integration, inventory reconciliation, multi-store management, and retail store operations.'
  },
  {
    id: 'ecommerce_mgmt',
    title: 'E-Commerce Management',
    category: 'Retail & Commerce',
    complexity: 'MEDIUM',
    description: 'Digital storefront sync, shopping cart operations, online payment gateways, and order fulfillment.'
  },
  {
    id: 'dist_mgmt',
    title: 'Distribution Management',
    category: 'Retail & Commerce',
    complexity: 'MEDIUM',
    description: 'Wholesale distribution, supply channels, order dispatch, and channel partner logistics.'
  },
  {
    id: 'loyalty_platform',
    title: 'Customer Loyalty Platform',
    category: 'Retail & Commerce',
    complexity: 'LOW',
    description: 'Reward points programs, customer segmentation, promotional campaigns, and gift card registries.'
  },

  // CATEGORY: Human Capital & Workforce
  {
    id: 'hrms',
    title: 'Human Resource Management',
    category: 'Human Capital & Workforce',
    complexity: 'MEDIUM',
    description: 'Employee lifecycle records, onboarding workflows, leave tracking, and organizational charting.'
  },
  {
    id: 'payroll_compliance',
    title: 'Payroll & Compliance',
    category: 'Human Capital & Workforce',
    complexity: 'HIGH',
    description: 'Automated salary processing, tax compliance, benefits administration, and statutory reporting.'
  },
  {
    id: 'travel_expense',
    title: 'Travel & Expense',
    category: 'Human Capital & Workforce',
    complexity: 'LOW',
    description: 'Business travel bookings, expense reporting, reimbursement pipelines, and policy audits.'
  },
  {
    id: 'performance_mgmt',
    title: 'Performance Management',
    category: 'Human Capital & Workforce',
    complexity: 'LOW',
    description: 'Review cycles, target setting, 360-degree feedback, and performance metrics tracking.'
  },
  {
    id: 'lms',
    title: 'Learning Management System',
    category: 'Human Capital & Workforce',
    complexity: 'LOW',
    description: 'Course catalogs, compliance training, certification logs, and employee skill development.'
  },

  // CATEGORY: AI & Intelligent Automation
  {
    id: 'ai_copilot',
    title: 'AI Business Copilot',
    category: 'AI & Intelligent Automation',
    complexity: 'HIGH',
    description: 'Conversational interface for querying ledgers, provisioning operations, and drafting insights.'
  },
  {
    id: 'predictive_analytics',
    title: 'Predictive Analytics Engine',
    category: 'AI & Intelligent Automation',
    complexity: 'HIGH',
    description: 'Machine learning forecasting for revenue trends, inventory levels, and operational loads.'
  },
  {
    id: 'ai_workflow_builder',
    title: 'AI Workflow Builder',
    category: 'AI & Intelligent Automation',
    complexity: 'HIGH',
    description: 'Drag-and-drop automation designer with time delays, conditional branching, and API actions.'
  },
  {
    id: 'doc_processing',
    title: 'Intelligent Document Processing',
    category: 'AI & Intelligent Automation',
    complexity: 'MEDIUM',
    description: 'OCR-driven scanning for invoices, receipts, purchase orders, and automated document indexing.'
  },
  {
    id: 'ai_knowledge_hub',
    title: 'AI Knowledge Hub',
    category: 'AI & Intelligent Automation',
    complexity: 'MEDIUM',
    description: 'Semantic database linking corporate wikis, historical logs, and standard operating procedures.'
  },
  {
    id: 'autonomous_agents',
    title: 'Autonomous Agents',
    category: 'AI & Intelligent Automation',
    complexity: 'HIGH',
    description: 'Multi-agent system executing recursive audits, supplier follow-ups, and auto-provisioning sequences.'
  },

  // CATEGORY: Security & Governance
  {
    id: 'iam',
    title: 'Identity & Access Management',
    category: 'Security & Governance',
    complexity: 'MEDIUM',
    description: 'Single Sign-On (SSO), multi-factor authentication, role-based access control, and directory sync.'
  },
  {
    id: 'grc',
    title: 'Governance Risk & Compliance',
    category: 'Security & Governance',
    complexity: 'HIGH',
    description: 'Regulatory audits, policy mapping, compliance scorecards, and incident response tracking.'
  },
  {
    id: 'soc',
    title: 'Security Operations Center',
    category: 'Security & Governance',
    complexity: 'HIGH',
    description: 'Threat monitoring, anomaly alerts, security log analysis, and system vulnerability scanning.'
  },
  {
    id: 'data_privacy',
    title: 'Data Privacy Center',
    category: 'Security & Governance',
    complexity: 'MEDIUM',
    description: 'GDPR/CCPA readiness audits, data masking, deletion workflow queues, and consent tracking.'
  },

  // CATEGORY: Enterprise Intelligence
  {
    id: 'exec_command_center',
    title: 'Executive Command Center',
    category: 'Enterprise Intelligence',
    complexity: 'HIGH',
    description: 'Centralized executive cockpit tracking company-wide KPIs, financial status, and strategic goals.'
  },
  {
    id: 'bi_suite',
    title: 'Business Intelligence Suite',
    category: 'Enterprise Intelligence',
    complexity: 'HIGH',
    description: 'Custom dashboard designer, pivot table builders, data modeling tools, and scheduled reports.'
  },
  {
    id: 'data_warehouse',
    title: 'Data Warehouse',
    category: 'Enterprise Intelligence',
    complexity: 'HIGH',
    description: 'High-performance data ingestion pipelines, centralized storage, and historical database queries.'
  },
  {
    id: 'strategic_planning',
    title: 'Strategic Planning Studio',
    category: 'Enterprise Intelligence',
    complexity: 'MEDIUM',
    description: 'OKR trackers, department mapping tools, resource planning tables, and budget simulation.'
  },

  // CATEGORY: INDUSTRY SOLUTIONS - HEALTHCARE
  {
    id: 'hospital_mgmt',
    title: 'Hospital Management',
    category: 'Industry Solutions - Healthcare',
    complexity: 'HIGH',
    description: 'Outpatient queues, bed allocation matrices, department scheduling, and billing coordination.'
  },
  {
    id: 'patient_records',
    title: 'Patient Records',
    category: 'Industry Solutions - Healthcare',
    complexity: 'HIGH',
    description: 'Electronic health records (EHR), medical history logs, prescription notes, and HIPAA compliance.'
  },
  {
    id: 'clinical_ops',
    title: 'Clinical Operations',
    category: 'Industry Solutions - Healthcare',
    complexity: 'MEDIUM',
    description: 'Lab report tracking, pharmacy inventory systems, OT scheduling, and medical equipment logs.'
  },
  {
    id: 'medical_inventory',
    title: 'Medical Inventory',
    category: 'Industry Solutions - Healthcare',
    complexity: 'MEDIUM',
    description: 'Critical medicine tracking, batch expiration alerts, surgical tool logs, and safety stock audits.'
  },

  // CATEGORY: INDUSTRY SOLUTIONS - EDUCATION
  {
    id: 'sis',
    title: 'Student Information System',
    category: 'Industry Solutions - Education',
    complexity: 'MEDIUM',
    description: 'Admission pipelines, registration files, attendance logs, and student profile databases.'
  },
  {
    id: 'lms_edu',
    title: 'Learning Management',
    category: 'Industry Solutions - Education',
    complexity: 'LOW',
    description: 'Virtual classroom creation, assignment grading boards, study syllabus uploads, and progress tracking.'
  },
  {
    id: 'exam_mgmt',
    title: 'Examination Management',
    category: 'Industry Solutions - Education',
    complexity: 'MEDIUM',
    description: 'Exam scheduling, grading matrices, report card printing, and transcript database storage.'
  },
  {
    id: 'campus_ops',
    title: 'Campus Operations',
    category: 'Industry Solutions - Education',
    complexity: 'MEDIUM',
    description: 'Hostel room bookings, transport fleet monitoring, library issue systems, and asset checks.'
  },

  // CATEGORY: INDUSTRY SOLUTIONS - LOGISTICS
  {
    id: 'fleet_mgmt',
    title: 'Fleet Management',
    category: 'Industry Solutions - Logistics',
    complexity: 'HIGH',
    description: 'GPS vehicle tracking, maintenance schedules, driver logs, and fuel expense oversight.'
  },
  {
    id: 'route_opt',
    title: 'Route Optimization',
    category: 'Industry Solutions - Logistics',
    complexity: 'MEDIUM',
    description: 'AI-derived transport routing, traffic delay mitigation, shipment dispatch planning.'
  },
  {
    id: 'shipment_tracking',
    title: 'Shipment Tracking',
    category: 'Industry Solutions - Logistics',
    complexity: 'LOW',
    description: 'Multi-carrier package visibility, live customer status links, and delivery status alerts.'
  },
  {
    id: 'warehouse_intel',
    title: 'Warehouse Intelligence',
    category: 'Industry Solutions - Logistics',
    complexity: 'HIGH',
    description: 'Rack storage configurations, stock pick optimization, inventory tag checks, and space metrics.'
  },

  // CATEGORY: INDUSTRY SOLUTIONS - CONSTRUCTION
  {
    id: 'project_lifecycle',
    title: 'Project Lifecycle Management',
    category: 'Industry Solutions - Construction',
    complexity: 'HIGH',
    description: 'Construction blueprint storage, site timeline planning, task dependencies, and budget audits.'
  },
  {
    id: 'site_ops',
    title: 'Site Operations',
    category: 'Industry Solutions - Construction',
    complexity: 'MEDIUM',
    description: 'Daily site logs, safety inspection checklists, concrete pour updates, and supervisor notes.'
  },
  {
    id: 'equipment_tracking',
    title: 'Equipment Tracking',
    category: 'Industry Solutions - Construction',
    complexity: 'MEDIUM',
    description: 'Excavator schedules, heavy machinery location logs, maintenance alerts, and lease trackers.'
  },
  {
    id: 'contractor_mgmt',
    title: 'Contractor Management',
    category: 'Industry Solutions - Construction',
    complexity: 'LOW',
    description: 'Subcontractor contract files, work order verification, and wage payment records.'
  },

  // ADVANCED SENTINEL MODULES (USP)
  {
    id: 'digital_twin',
    title: 'Digital Twin Organization',
    category: 'Advanced Sentinel Modules',
    complexity: 'HIGH',
    description: 'Real-time digital replica of all workflow nodes, active staff routes, and system data pipelines.'
  },
  {
    id: 'enterprise_os',
    title: 'Enterprise Operating System',
    category: 'Advanced Sentinel Modules',
    complexity: 'HIGH',
    description: 'Core operating substrate coordinating cross-department signals, scheduled scripts, and APIs.'
  },
  {
    id: 'decision_intel',
    title: 'Decision Intelligence Engine',
    category: 'Advanced Sentinel Modules',
    complexity: 'HIGH',
    description: 'AI-powered scenario modeling, revenue forecasts, and optimal business choice recommendations.'
  },
  {
    id: 'process_mining',
    title: 'Business Process Mining',
    category: 'Advanced Sentinel Modules',
    complexity: 'HIGH',
    description: 'Automated scanning of log databases to reconstruct workflows and identify inefficiency bottlenecks.'
  },
  {
    id: 'org_health',
    title: 'Organizational Health Monitor',
    category: 'Advanced Sentinel Modules',
    complexity: 'MEDIUM',
    description: 'Staff attrition analysis, task completion ratios, department collaboration index logs.'
  },
  {
    id: 'control_tower',
    title: 'Sentinel Control Tower',
    category: 'Advanced Sentinel Modules',
    complexity: 'HIGH',
    description: 'Master visualization deck showing system alerts, SLA warning states, and urgent approval queues.'
  }
];

const CORE_MODULE_IDS = ['crm', 'sales_mgmt', 'procurement', 'purchase_mgmt'];

// Recommendation mapping based on selected industry
const RECOMMENDATION_MAP: Record<string, string[]> = {
  'Manufacturing': ['mfg_erp', 'scm', 'asset_mgmt', 'prod_intel', 'process_mining', 'control_tower'],
  'Retail & Commerce': ['retail_mgmt', 'ecommerce_mgmt', 'dist_mgmt', 'loyalty_platform', 'doc_processing'],
  'Human Capital': ['hrms', 'payroll_compliance', 'performance_mgmt', 'lms', 'org_health'],
  'Logistics': ['fleet_mgmt', 'route_opt', 'shipment_tracking', 'warehouse_intel', 'control_tower'],
  'Healthcare': ['hospital_mgmt', 'patient_records', 'clinical_ops', 'medical_inventory', 'data_privacy'],
  'Education': ['sis', 'lms_edu', 'exam_mgmt', 'campus_ops'],
  'Construction': ['project_lifecycle', 'site_ops', 'equipment_tracking', 'contractor_mgmt'],
  'Technology': ['iam', 'ai_copilot', 'predictive_analytics', 'ai_workflow_builder', 'autonomous_agents', 'digital_twin', 'enterprise_os'],
  'Financial Services': ['grc', 'soc', 'decision_intel', 'data_warehouse', 'bi_suite'],
  'Government': ['iam', 'grc', 'soc', 'data_privacy'],
  'Professional Services': ['hrms', 'travel_expense', 'performance_mgmt', 'strategic_planning']
};

interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  orgName?: string;
  industry?: string;
}

interface OnboardingPageProps {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
}

export default function OnboardingPage({ user, setUser }: OnboardingPageProps) {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState<string>(() => {
    return localStorage.getItem('sentinel_onboarding_industry') || user?.industry || '';
  });
  const [selectedModules, setSelectedModules] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('sentinel_onboarding_draft_modules');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set(CORE_MODULE_IDS);
      }
    }
    return new Set(CORE_MODULE_IDS);
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationStep, setInitializationStep] = useState(0);

  // Auto-save industry and modules selection change to localStorage
  useEffect(() => {
    if (selectedIndustry) {
      localStorage.setItem('sentinel_onboarding_industry', selectedIndustry);
    }
  }, [selectedIndustry]);

  useEffect(() => {
    localStorage.setItem('sentinel_onboarding_draft_modules', JSON.stringify(Array.from(selectedModules)));
  }, [selectedModules]);


  // Sync state if user changes or loads
  useEffect(() => {
    if (user?.industry && !selectedIndustry) {
      setSelectedIndustry(user.industry);
    }
  }, [user, selectedIndustry]);

  // Derived AI recommended modules list
  const recommendedModules = useMemo(() => {
    if (!selectedIndustry) return [];
    return RECOMMENDATION_MAP[selectedIndustry] || [];
  }, [selectedIndustry]);

  // Automatically select recommendations when industry changes
  useEffect(() => {
    if (recommendedModules.length > 0) {
      setSelectedModules(prev => {
        const next = new Set(prev);
        recommendedModules.forEach(id => next.add(id));
        // Keep core modules always selected
        CORE_MODULE_IDS.forEach(id => next.add(id));
        return next;
      });
    }
  }, [recommendedModules]);

  // Handle module checkbox toggle
  const handleToggleModule = (moduleId: string) => {
    if (CORE_MODULE_IDS.includes(moduleId)) return; // Read-only core modules
    setSelectedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  // Filter categories and modules based on search
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    // Group all non-core modules by their category
    const categories: Record<string, ModuleItem[]> = {};
    ALL_MODULES.forEach(module => {
      if (CORE_MODULE_IDS.includes(module.id)) return; // Exclude core modules from main selection lists
      
      const titleMatch = module.title.toLowerCase().includes(query);
      const descMatch = module.description.toLowerCase().includes(query);
      const catMatch = module.category.toLowerCase().includes(query);
      
      if (!query || titleMatch || descMatch || catMatch) {
        if (!categories[module.category]) {
          categories[module.category] = [];
        }
        categories[module.category].push(module);
      }
    });
    
    return categories;
  }, [searchQuery]);

  // Counts for sidebar metrics
  const coreModulesCount = CORE_MODULE_IDS.length;
  const customModulesCount = selectedModules.size - coreModulesCount;
  const totalModulesCount = selectedModules.size;

  // Initialize command steps animation list
  const initSteps = [
    "Compiling workspace schemas...",
    "Provisioning relational data warehouse tables...",
    "Activating chosen business modular pipelines...",
    "Deploying SOC 2 encryption nodes...",
    "Starting Sentinel ERP control matrix..."
  ];

  // Primary CTA to Save and Redirect
  const handleInitializeWorkspace = async () => {
    if (!user) {
      alert("Error: User session not found. Please log in again.");
      navigate("/login");
      return;
    }
    if (!selectedIndustry) {
      alert("Please select your industry sector to customize recommendations.");
      return;
    }

    setIsInitializing(true);
    setInitializationStep(0);

    // Dynamic step progress animation
    const stepInterval = setInterval(() => {
      setInitializationStep(prev => {
        if (prev >= initSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    const activeSelectedList = Array.from(selectedModules);
    
    // Save to backend database and localStorage
    const savedSuccess = await saveOnboardingData(
      user.uid,
      selectedIndustry,
      activeSelectedList,
      recommendedModules
    );

    setTimeout(() => {
      clearInterval(stepInterval);
      if (savedSuccess) {
        // Update current user state with the completed onboarding indicator
        setUser({
          ...user,
          industry: selectedIndustry,
        });
        navigate("/dashboard");
      } else {
        alert("Unable to save workspace configurations. Please try again.");
        setIsInitializing(false);
      }
    }, 5200);
  };

  // Helper to check if a module is currently suggested by AI
  const isSuggested = (moduleId: string) => {
    return recommendedModules.includes(moduleId);
  };

  // Highlight matches text helper
  const renderHighlightedText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-yellow-400/30 text-white border-b border-yellow-400 px-0.5 rounded-sm">{part}</mark> 
            : part
        )}
      </span>
    );
  };

  // Render Skeleton loader when initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="max-w-md w-full space-y-8 flex flex-col items-center text-center">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-ping opacity-25"></div>
            <div className="absolute inset-2 rounded-full border-2 border-white/10 animate-pulse opacity-50"></div>
            <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-transparent border-t-white border-r-white/50 animate-spin"></div>
            <div className="absolute inset-9 rounded-full bg-white flex items-center justify-center">
              <BrainCircuit className="h-6 w-6 text-black animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">Provisioning Workspace Stack</h3>
              <p className="text-xs text-white/40">Initializing customized enterprise operating framework</p>
            </div>

            <div className="bg-neutral-900 border border-white/5 p-5 rounded-2xl min-h-[110px] flex flex-col justify-center items-center shadow-2xl">
              <div className="text-xs font-mono text-white/90 flex items-center space-x-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                <span>{initSteps[initializationStep]}</span>
              </div>
              
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-5 max-w-[220px]">
                <motion.div 
                  className="bg-white h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((initializationStep + 1) / initSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row font-sans selection:bg-white/20 relative">
      
      {/* ── STICKY LEFT SIDEBAR PANEL ── */}
      <aside className="w-full lg:w-[380px] xl:w-[420px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 bg-neutral-950/80 backdrop-blur-xl p-6 flex flex-col justify-between lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto z-20 space-y-6">
        <div className="space-y-6">
          
          {/* Logo element */}
          <div className="flex items-center space-x-2.5 px-1">
            <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-black text-xs">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">SENTINEL ERP</span>
          </div>

          {/* Section 1: Title and Core Description */}
          <div className="space-y-2 text-left">
            <h2 className="text-xl font-bold tracking-tight text-white">Your Core ERP Foundation Is Ready</h2>
            <p className="text-xs text-white/50 leading-relaxed">
              We've automatically enabled the essential business modules required to run your organization.
            </p>
          </div>

          {/* Core modules scrollable list */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2 text-left max-h-[160px] overflow-y-auto">
            {CORE_MODULE_IDS.map(coreId => {
              const coreMod = ALL_MODULES.find(m => m.id === coreId);
              return (
                <div key={coreId} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center space-x-2">
                    <Check size={12} className="text-white bg-white/10 rounded p-0.5" />
                    <span className="font-semibold text-white/80">{coreMod?.title}</span>
                  </div>
                  <span className="text-[9px] font-bold text-white/40 tracking-wider uppercase">CORE</span>
                </div>
              );
            })}
          </div>

          {/* Section 2: Industry Selector Dropdown */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest block">Select Your Industry Sector</label>
            <div className="relative">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full h-11 pl-4 pr-10 text-xs bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200 select-none appearance-none cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                <option value="" disabled className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Choose industry sector for suggestions...</option>
                <option value="Manufacturing" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Manufacturing</option>
                <option value="Retail & Commerce" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Retail &amp; Commerce</option>
                <option value="Human Capital" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Human Capital</option>
                <option value="Logistics" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Logistics</option>
                <option value="Healthcare" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Healthcare</option>
                <option value="Education" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Education</option>
                <option value="Construction" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Construction</option>
                <option value="Technology" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Technology</option>
                <option value="Financial Services" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Financial Services</option>
                <option value="Government" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Government</option>
                <option value="Professional Services" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Professional Services</option>
              </select>
              <div className="absolute right-3.5 top-3.5 pointer-events-none text-white/30">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Section 3: AI Recommendation Card */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-4 text-left space-y-3 relative overflow-hidden">
            <div className="absolute right-3 top-3 text-white/10">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-white">
              <Sparkles size={12} className="text-white" />
              <span>AI-Suggested Stack Recommendation</span>
            </div>

            {selectedIndustry ? (
              <div className="space-y-2">
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Calibrated <strong className="text-white">{recommendedModules.length} recommended systems</strong> matching your organization profile in <strong className="text-white">{selectedIndustry}</strong>.
                </p>
                
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 text-center">
                  <div>
                    <div className="text-[9px] text-white/40 uppercase font-bold">Total Stack</div>
                    <div className="text-lg font-bold text-white mt-0.5">{totalModulesCount} Modules</div>
                  </div>
                  <div className="border-l border-white/5">
                    <div className="text-[9px] text-white/40 uppercase font-bold">Core + Custom</div>
                    <div className="text-lg font-bold text-white mt-0.5">{coreModulesCount} + {customModulesCount}</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-white/30 leading-relaxed">
                Select an industry sector to generate dynamic modular stack recommendations automatically.
              </p>
            )}
          </div>

        </div>

        {/* Section 4 & 5: Primary CTA & Helper Text */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <button
            onClick={handleInitializeWorkspace}
            disabled={!selectedIndustry}
            className={`w-full h-12 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              selectedIndustry 
                ? 'hover:bg-neutral-200 active:scale-[0.98] cursor-pointer shadow-lg shadow-white/5' 
                : 'opacity-20 cursor-not-allowed bg-transparent border border-white/10 text-white'
            }`}
          >
            <span>Initialize Sentinel ERP Workspace</span>
            <ArrowRight size={14} />
          </button>
          
          <p className="text-[10px] text-white/30 leading-relaxed text-center">
            You can modify, enable, or disable business modules anytime from Workspace Configuration → Modules.
          </p>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto lg:h-screen text-left">
        
        {/* Top Header & Search Panel */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-white uppercase">Activate Business-Specific Solutions</h1>
              <p className="text-xs text-white/50">Browse additional operational ledgers, integrations, and intelligent engines.</p>
            </div>
            
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded border border-white/5">
              Select modules to initialize
            </div>
          </div>

          {/* Top Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business solutions or features (e.g. ERP, analytics, SCM)..."
              className="w-full h-12 pl-11 pr-4 text-sm bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all duration-200"
            />
            <div className="absolute left-4 top-4 text-white/30">
              <Search size={16} />
            </div>
            
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-xs text-white/40 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Modules Lists by Category */}
        <div className="space-y-10">
          {Object.keys(filteredCategories).length > 0 ? (
            Object.entries(filteredCategories).map(([category, modules]) => {
              if (modules.length === 0) return null;
              return (
                <section key={category} className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/60"></span>
                    <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest">{category}</h3>
                    <span className="text-[10px] text-white/30">({modules.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {modules.map(module => {
                      const isChecked = selectedModules.has(module.id);
                      const isRec = isSuggested(module.id);
                      
                      return (
                        <div
                          key={module.id}
                          tabIndex={0}
                          onClick={() => handleToggleModule(module.id)}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              handleToggleModule(module.id);
                            }
                          }}
                          className={`relative border rounded-2xl p-5 text-left transition-all duration-300 select-none group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 ${
                            isChecked
                              ? 'bg-neutral-900 border-white/40 shadow-lg shadow-white/5'
                              : 'bg-neutral-950/40 border-white/5 hover:border-white/15 hover:bg-neutral-950/80'
                          }`}
                        >
                          {/* Recommended Indicator Accent Line */}
                          {isRec && (
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0 rounded-t-2xl"></div>
                          )}

                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              {/* Title */}
                              <h4 className="text-sm font-semibold text-white tracking-tight">
                                {renderHighlightedText(module.title, searchQuery)}
                              </h4>

                              {/* Badges container */}
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {/* Complexity Badge */}
                                <span className={`text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded border ${
                                  module.complexity === 'LOW'
                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                    : module.complexity === 'MEDIUM'
                                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                                    : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                                }`}>
                                  {module.complexity} COMPLEXITY
                                </span>

                                {/* AI Recommended Badge */}
                                {isRec && (
                                  <span className="text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded border border-purple-500/20 bg-purple-500/10 text-purple-400 flex items-center gap-0.5">
                                    <Sparkles size={8} />
                                    AI SUGGESTED
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Stylized Checkbox Check */}
                            <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-colors duration-200 ${
                              isChecked 
                                ? 'bg-white border-white text-black' 
                                : 'border-white/20 group-hover:border-white/40'
                            }`}>
                              {isChecked && <Check size={11} strokeWidth={4} />}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-[11px] text-white/50 leading-relaxed mt-3 group-hover:text-white/70 transition-colors duration-200">
                            {renderHighlightedText(module.description, searchQuery)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })
          ) : (
            /* Empty State */
            <div className="py-12 border border-dashed border-white/10 rounded-2xl text-center space-y-3">
              <Layers className="h-8 w-8 text-white/20 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">No Business Solutions Found</h4>
                <p className="text-xs text-white/40 max-w-[280px] mx-auto">We couldn't find any modules matching your query. Try searching for broad terms like "AI" or "HR".</p>
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="btn-outline !py-2 !px-4 !text-xs cursor-pointer inline-flex"
              >
                Clear Search Query
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
