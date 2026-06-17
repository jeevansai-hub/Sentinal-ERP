import { 
  Activity, 
  Users, 
  DollarSign, 
  Briefcase, 
  ShoppingCart, 
  FolderGit2, 
  Package, 
  CheckSquare, 
  Shield, 
  Cpu, 
  Layers, 
  Settings, 
  User, 
  Landmark, 
  UserCheck, 
  Wrench, 
  HelpCircle, 
  Folder, 
  BookOpen, 
  Zap, 
  Bell, 
  Database, 
  Network, 
  TrendingUp, 
  GitBranch 
} from 'lucide-react';

import type { ModuleDefinition } from './types';

// Import all view components
import HomeView from '../../components/dashboard/HomeView';
import ProfileView from '../../components/dashboard/ProfileView';
import HRView from '../../components/dashboard/HRView';
import FinanceView from '../../components/dashboard/FinanceView';
import CRMView from '../../components/dashboard/CRMView';
import ProcurementView from '../../components/dashboard/ProcurementView';
import InventoryView from '../../components/dashboard/InventoryView';
import ProjectView from '../../components/dashboard/ProjectView';
import AnalyticsView from '../../components/dashboard/AnalyticsView';
import AICenterView from '../../components/dashboard/AICenterView';
import SettingsView from '../../components/dashboard/SettingsView';
import SecurityView from '../../components/dashboard/SecurityView';

// New Views
import InvoiceCenterView from '../../components/dashboard/InvoiceCenterView';
import ApprovalHubView from '../../components/dashboard/ApprovalHubView';
import ManufacturingView from '../../components/dashboard/ManufacturingView';
import CustomerSupportView from '../../components/dashboard/CustomerSupportView';
import AssetManagementView from '../../components/dashboard/AssetManagementView';
import DocumentCenterView from '../../components/dashboard/DocumentCenterView';
import KnowledgeHubView from '../../components/dashboard/KnowledgeHubView';
import AutomationCenterView from '../../components/dashboard/AutomationCenterView';
import AuditCenterView from '../../components/dashboard/AuditCenterView';
import NotificationCenterView from '../../components/dashboard/NotificationCenterView';
import MDMView from '../../components/dashboard/MDMView';
import IntegrationHubView from '../../components/dashboard/IntegrationHubView';
import ReportStudioView from '../../components/dashboard/ReportStudioView';
import WorkflowStudioView from '../../components/dashboard/WorkflowStudioView';

// AI Command Center Views
import EnterpriseCommandCenter from '../../components/dashboard/AICommandCenter/EnterpriseCommandCenter';
import OperationsHub from '../../components/dashboard/AICommandCenter/OperationsHub';
import WorkflowOrchestration from '../../components/dashboard/AICommandCenter/WorkflowOrchestration';
import EnterpriseKnowledgeGraph from '../../components/dashboard/AICommandCenter/EnterpriseKnowledgeGraph';
import AdaptiveIntelligenceEngine from '../../components/dashboard/AICommandCenter/AdaptiveIntelligenceEngine';
import ExecutiveDecisionIntelligence from '../../components/dashboard/AICommandCenter/ExecutiveDecisionIntelligence';
import AIGovernanceCompliance from '../../components/dashboard/AICommandCenter/AIGovernanceCompliance';
import EnterpriseDigitalTwin from '../../components/dashboard/AICommandCenter/EnterpriseDigitalTwin';
import ObservabilityResilienceCenter from '../../components/dashboard/AICommandCenter/ObservabilityResilienceCenter';

export const ALL_ERP_REGISTRY: ModuleDefinition[] = [
  {
    id: 'home',
    route: '/dashboard',
    title: 'Command Center',
    icon: Activity,
    category: 'core',
    archetype: 'executive',
    permissions: ['*'],
    component: HomeView
  },
  {
    id: 'profile',
    route: '/dashboard/profile',
    title: 'Operator Profile',
    icon: User,
    category: 'core',
    archetype: 'grid',
    permissions: ['*'],
    component: ProfileView
  },
  {
    id: 'hr',
    route: '/dashboard/hr',
    title: 'HRMS Operations',
    icon: Users,
    category: 'operations',
    archetype: 'pipeline',
    permissions: ['hr:read', 'hr:write'],
    component: HRView
  },
  {
    id: 'finance',
    route: '/dashboard/finance',
    title: 'Finance Ledgers',
    icon: DollarSign,
    category: 'finance',
    archetype: 'grid',
    permissions: ['finance:read', 'finance:write'],
    component: FinanceView
  },
  {
    id: 'crm',
    route: '/dashboard/crm',
    title: 'CRM Sales',
    icon: Briefcase,
    category: 'operations',
    archetype: 'network',
    permissions: ['sales:read', 'sales:write'],
    component: CRMView
  },
  {
    id: 'sales_mgmt',
    route: '/dashboard/sales-mgmt',
    title: 'Sales Management',
    icon: TrendingUp,
    category: 'operations',
    archetype: 'network',
    permissions: ['sales:read', 'sales:write'],
    component: CRMView // Merged as requested
  },
  {
    id: 'procurement',
    route: '/dashboard/procurement',
    title: 'Procurement',
    icon: ShoppingCart,
    category: 'operations',
    archetype: 'network',
    permissions: ['procurement:read', 'procurement:write'],
    component: ProcurementView
  },
  {
    id: 'purchase_mgmt',
    route: '/dashboard/purchase',
    title: 'Purchase Management',
    icon: FolderGit2,
    category: 'operations',
    archetype: 'network',
    permissions: ['procurement:read', 'procurement:write'],
    component: ProcurementView // Merged as requested
  },
  {
    id: 'inventory',
    route: '/dashboard/inventory',
    title: 'Inventory Assets',
    icon: Package,
    category: 'operations',
    archetype: 'grid',
    permissions: ['inventory:read', 'inventory:write'],
    component: InventoryView
  },
  {
    id: 'projects',
    route: '/dashboard/projects',
    title: 'Delivery Center',
    icon: CheckSquare,
    category: 'operations',
    archetype: 'timeline',
    permissions: ['projects:read', 'projects:write'],
    component: ProjectView
  },
  {
    id: 'security',
    route: '/dashboard/security',
    title: 'Security Center',
    icon: Shield,
    category: 'governance',
    archetype: 'grid',
    permissions: ['security:admin'],
    component: SecurityView
  },
  {
    id: 'ai_center',
    route: '/dashboard/ai-center',
    title: 'Agentic AI Center',
    icon: Cpu,
    category: 'intelligence',
    archetype: 'ai',
    permissions: ['*'],
    component: AICenterView
  },
  {
    id: 'analytics',
    route: '/dashboard/analytics',
    title: 'BI Analytics',
    icon: Layers,
    category: 'intelligence',
    archetype: 'executive',
    permissions: ['analytics:read'],
    component: AnalyticsView
  },
  {
    id: 'settings',
    route: '/dashboard/settings',
    title: 'Workspace Settings',
    icon: Settings,
    category: 'core',
    archetype: 'grid',
    permissions: ['*'],
    component: SettingsView
  },
  {
    id: 'invoices',
    route: '/dashboard/invoices',
    title: 'Invoice Center',
    icon: Landmark,
    category: 'finance',
    archetype: 'grid',
    permissions: ['finance:read'],
    component: InvoiceCenterView
  },
  {
    id: 'approvals',
    route: '/dashboard/approvals',
    title: 'Approval Hub',
    icon: UserCheck,
    category: 'operations',
    archetype: 'pipeline',
    permissions: ['*'],
    component: ApprovalHubView
  },
  {
    id: 'manufacturing',
    route: '/dashboard/manufacturing',
    title: 'Manufacturing',
    icon: Wrench,
    category: 'operations',
    archetype: 'timeline',
    permissions: ['inventory:write'],
    component: ManufacturingView
  },
  {
    id: 'support',
    route: '/dashboard/support',
    title: 'Customer Support',
    icon: HelpCircle,
    category: 'operations',
    archetype: 'pipeline',
    permissions: ['*'],
    component: CustomerSupportView
  },
  {
    id: 'assets',
    route: '/dashboard/assets',
    title: 'Asset Management',
    icon: Package,
    category: 'finance',
    archetype: 'grid',
    permissions: ['finance:read'],
    component: AssetManagementView
  },
  {
    id: 'documents',
    route: '/dashboard/documents',
    title: 'Document Center',
    icon: Folder,
    category: 'kb',
    archetype: 'knowledge',
    permissions: ['*'],
    component: DocumentCenterView
  },
  {
    id: 'knowledge',
    route: '/dashboard/knowledge',
    title: 'Knowledge Hub',
    icon: BookOpen,
    category: 'kb',
    archetype: 'knowledge',
    permissions: ['*'],
    component: KnowledgeHubView
  },
  {
    id: 'automation',
    route: '/dashboard/automation',
    title: 'Automation Center',
    icon: Zap,
    category: 'intelligence',
    archetype: 'ai',
    permissions: ['security:admin'],
    component: AutomationCenterView
  },
  {
    id: 'audit_center',
    route: '/dashboard/audit-center',
    title: 'Audit Center',
    icon: Shield,
    category: 'governance',
    archetype: 'grid',
    permissions: ['security:admin'],
    component: AuditCenterView
  },
  {
    id: 'notifications',
    route: '/dashboard/notifications',
    title: 'Notification Center',
    icon: Bell,
    category: 'core',
    archetype: 'pipeline',
    permissions: ['*'],
    component: NotificationCenterView
  },
  {
    id: 'mdm',
    route: '/dashboard/mdm',
    title: 'Master Data MDM',
    icon: Database,
    category: 'finance',
    archetype: 'grid',
    permissions: ['finance:write'],
    component: MDMView
  },
  {
    id: 'integrations',
    route: '/dashboard/integrations',
    title: 'Integration Hub',
    icon: Network,
    category: 'intelligence',
    archetype: 'network',
    permissions: ['security:admin'],
    component: IntegrationHubView
  },
  {
    id: 'report_studio',
    route: '/dashboard/report-studio',
    title: 'Report Studio',
    icon: TrendingUp,
    category: 'intelligence',
    archetype: 'executive',
    permissions: ['analytics:read'],
    component: ReportStudioView
  },
  {
    id: 'workflow_studio',
    route: '/dashboard/workflow-studio',
    title: 'Workflow Studio',
    icon: GitBranch,
    category: 'intelligence',
    archetype: 'ai',
    permissions: ['security:admin'],
    component: WorkflowStudioView
  },
  {
    id: 'ai_ecc',
    route: '/dashboard/ecc',
    title: 'Enterprise Command Center',
    icon: Activity,
    category: 'ai-command-center',
    archetype: 'executive',
    permissions: ['*'],
    component: EnterpriseCommandCenter
  },
  {
    id: 'ai_ops_hub',
    route: '/dashboard/ops-hub',
    title: 'Operations Hub',
    icon: Cpu,
    category: 'ai-command-center',
    archetype: 'pipeline',
    permissions: ['*'],
    component: OperationsHub
  },
  {
    id: 'ai_workflow_orch',
    route: '/dashboard/workflow-orch',
    title: 'Workflow Orchestration',
    icon: GitBranch,
    category: 'ai-command-center',
    archetype: 'ai',
    permissions: ['*'],
    component: WorkflowOrchestration
  },
  {
    id: 'ai_knowledge_graph',
    route: '/dashboard/knowledge-graph',
    title: 'Enterprise Knowledge Graph',
    icon: Network,
    category: 'ai-command-center',
    archetype: 'knowledge',
    permissions: ['*'],
    component: EnterpriseKnowledgeGraph
  },
  {
    id: 'ai_adaptive_intel',
    route: '/dashboard/adaptive-intel',
    title: 'Adaptive Intelligence Engine',
    icon: Zap,
    category: 'ai-command-center',
    archetype: 'ai',
    permissions: ['*'],
    component: AdaptiveIntelligenceEngine
  },
  {
    id: 'ai_strategic_intel',
    route: '/dashboard/strategic-intel',
    title: 'Executive Decision Intelligence',
    icon: TrendingUp,
    category: 'ai-command-center',
    archetype: 'executive',
    permissions: ['*'],
    component: ExecutiveDecisionIntelligence
  },
  {
    id: 'ai_governance_compliance',
    route: '/dashboard/governance-compliance',
    title: 'AI Governance & Compliance',
    icon: Shield,
    category: 'ai-command-center',
    archetype: 'grid',
    permissions: ['*'],
    component: AIGovernanceCompliance
  },
  {
    id: 'ai_digital_twin',
    route: '/dashboard/digital-twin',
    title: 'Enterprise Digital Twin',
    icon: Layers,
    category: 'ai-command-center',
    archetype: 'network',
    permissions: ['*'],
    component: EnterpriseDigitalTwin
  },
  {
    id: 'ai_observability_resilience',
    route: '/dashboard/observability-resilience',
    title: 'Observability & Resilience Center',
    icon: Settings,
    category: 'ai-command-center',
    archetype: 'grid',
    permissions: ['*'],
    component: ObservabilityResilienceCenter
  }
];
