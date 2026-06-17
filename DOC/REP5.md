# Project Technical Specification & Developed Features

## 1. Technology Stack

* **Frontend Framework:** React 19 (React 19.2.6), Vite 8 (Vite 8.0.12)
* **CSS Framework:** Tailwind CSS 4 (Tailwind CSS 4.3.0) with `@tailwindcss/vite` plugin
* **Programming Languages:** TypeScript, SQL, HTML, CSS
* **Backend Framework:** NestJS (Node.js framework) using Express platform adapter, routing, and ts-node-dev for development hot reloading
* **Database Management:** PostgreSQL (utilizing pg/node-postgres client pools and custom schema migration systems)
* **Authentication & Identity:** Firebase Authentication Client SDK with NestJS JWT verification guards
* **Visual Interfaces & Graphics:** Three.js (Three.js WebGL rendering for 3D topological configurations), Framer Motion for interface micro-animations, and Lucide React icons
* **Testing & Tools:** Jest, Playwright (E2E testing), ESLint, Prettier, Concurrently (to execute dev servers concurrently)

---

## 2. Modules Actually Developed

* **Command Center Dashboard:** The central hub (`EnterpriseCommandCenter.tsx`, `HomeView.tsx`) displaying core organizational metrics, outstanding actions, active workflows, and system alerts.
* **HRMS Module:** Manages employee lifecycle logs, employee details, payroll configuration, performance reports, and user timesheets (`HRView.tsx`).
* **Finance Module:** Handles financial ledger logs, accounts payable, accounts receivable, balance sheets, expenses, and transaction logs (`FinanceView.tsx`).
* **CRM & Customer Support Module:** Tracks client accounts, sales pipelines, customer interactions, lead distributions, and support ticket states (`CRMView.tsx`, `CustomerSupportView.tsx`).
* **Inventory Module:** Monitors warehouse storage, stock quantities, safety stock levels, bin relocations, and warehouse stock transfers (`InventoryView.tsx`).
* **Procurement Module:** Manages supplier directories, handles purchase requisitions, automates purchase order processing, and runs invoice matching validations (`ProcurementView.tsx`).
* **Approval Hub:** Centralizes multi-step approvals for purchase orders, timesheets, and expense allocations with priority queues and escalation rules (`ApprovalHubView.tsx`).
* **Security & Audit Center:** Monitors active logins, security configuration overrides, role allocations (RBAC), and logs immutable audit trails (`SecurityView.tsx`, `AuditCenterView.tsx`).
* **Agentic AI & Automation Center:** Connects business processes with autonomous agent workflows and shows execution steps of logical agents (`AICenterView.tsx`, `AdaptiveIntelligenceEngine.tsx`).
* **Analytics & Report Studio:** Provides custom report creators, drag-and-drop KPI charts, and data filters (`AnalyticsView.tsx`, `ReportStudioView.tsx`).
* **Document & Knowledge Center:** Indexes company standard operating procedures (SOPs), supplier contracts, and regulatory manuals using semantic search mappings (`DocumentCenterView.tsx`, `KnowledgeHubView.tsx`).
* **Workflow Studio:** Visualizes automated processes, enabling administrators to set trigger events, logic boundaries, and action pathways (`WorkflowStudioView.tsx`).
* **Integration Hub:** Configures API keys, webhook URLs, and external system sync protocols (e.g., Salesforce, custom databases) (`IntegrationHubView.tsx`).
* **Operational Modules (Others):** Manufacturing View (production batch logs), Project View (task boards, milestones), Asset Management (depreciation trackers, inventory logs), and MDM View (Master Data Management validation schemas).

---

## 3. AI Features Implemented

* **Universal Command Bar:** Natural language interface for querying transactional data, accessing modules, and triggering actions.
* **Enterprise Knowledge Graph:** Three.js-rendered interactive 3D node-graph representing connections between assets, employees, financial records, and operational tasks.
* **Executive Decision Intelligence:** Cognitive advisor analyzing operational logs, predicting supply chain bottlenecks, and recommending prices or sourcing actions.
* **Enterprise Digital Twin:** Live physical topology model visualizing processes and tracing anomalies (e.g., procurement blocks).
* **Adaptive Intelligence Engine:** Machine learning system evaluating incoming invoices for formatting anomalies or fraudulent items.
* **Approval & Sourcing Automation:** System-assisted validation matching vendor invoices against purchase orders and goods receipt notes automatically.

---

## 4. Architecture

* **Architecture Pattern:** Decoupled Monorepo / Modular Monolith
* **Description:** Decoupled domain structures separating frontend components (`apps/web`) from NestJS business services (`apps/api`). Communication is facilitated through structured RESTful APIs and JSON payloads. Types and entity structures are shared across the frontend and backend using a central `shared` module, ensuring schema consistency across the application.

---

## 5. Outputs Generated

* **Interactive Dashboards:** Visual tracking systems mapping sales pipelines, HR statuses, and inventory counts.
* **Analytics Reports:** PDF/CSV formatted operational sheets, balance ledgers, and inventory turnover ratios.
* **Real-Time Alerts:** High-priority alerts warning users of stock exhaustion, transaction anomalies, and overdue approvals.
* **Audit Logs:** Secure database records tracking user sign-ins, record edits, and security override events.
* **Workflow Visualizations:** Live graphs in the Workflow Studio mapping automated states and system exceptions.
* **Status Updates:** Centralized notifications in the Notification Center and Approval Hub.

---

## 6. Implementation Level

* **Project Build Status:** **C) Full Stack + AI Features**
* **Verification:** Built as a complete TypeScript monorepo where the React web dashboard interacts with NestJS service modules, connected PostgreSQL schemas, and mock database seed configurations.

---

## 7. Screens Available

1. **Login & Registration Portal** (Firebase Authentication interface)
2. **Enterprise Command Center** (Core operating metrics and status panels)
3. **HRMS Dashboard** (Payroll logs, timesheets, and staff records)
4. **Finance Desk** (Ledgers, receivables, payables, and transactions)
5. **CRM & Customer Support Desk** (Pipelines, ticket queues, and client cards)
6. **Inventory & Warehouse Management** (Stock levels, item catalog, transfers)
7. **Procurement & Sourcing Hub** (Vendor logs, purchase requests)
8. **AI Agent & Automation Control Panel** (Agent lists, prompt metrics)
9. **Workflow Studio & Rule Builder** (Process map and automated pathways)
10. **Analytics & Report Studio** (Custom charts and exportable metrics)
11. **Security & Audit Center** (User access controls, audit trail lists)
12. **Settings & Integration Dashboard** (Webhooks, database sync controls)
13. **Asset Management & Manufacturing Desk** (Production schedules, depreciation logs)
