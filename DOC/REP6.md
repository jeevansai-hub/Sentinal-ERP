# Project Repository Folder & File Structure

This document outlines the entire directory structure of the monorepo workspace. The project utilizes a decoupled, modular design, separating the web frontend from the backend API services, with a shared library for core types and validation schemas.

---

## 1. Directory Tree Overview

```
.
├── apps/
│   ├── web/                        # React 19 Client Web Application
│   │   ├── package.json            # Web app dependencies & scripts
│   │   ├── vite.config.ts          # Vite build & plugin configurations
│   │   └── src/
│   │       ├── main.tsx            # Client entry point
│   │       ├── App.tsx             # Root routing & layout container
│   │       ├── index.css           # Global CSS variables & Tailwind directives
│   │       ├── components/
│   │       │   └── dashboard/      # Core dashboard layout & modules
│   │       │       ├── AICommandCenter/ # Advanced AI view components
│   │       │       │   ├── AIGovernanceCompliance.tsx
│   │       │       │   ├── AdaptiveIntelligenceEngine.tsx
│   │       │       │   ├── EnterpriseCommandCenter.tsx
│   │       │       │   ├── EnterpriseDigitalTwin.tsx
│   │       │       │   ├── EnterpriseKnowledgeGraph.tsx
│   │       │       │   ├── ExecutiveDecisionIntelligence.tsx
│   │       │       │   ├── ObservabilityResilienceCenter.tsx
│   │       │       │   ├── OperationsHub.tsx
│   │       │       │   ├── UniversalCommandBar.tsx
│   │       │       │   └── WorkflowOrchestration.tsx
│   │       │       ├── AICenterView.tsx
│   │       │       ├── AdminControlTower.tsx
│   │       │       ├── AnalyticsView.tsx
│   │       │       ├── ApprovalHubView.tsx
│   │       │       ├── AssetManagementView.tsx
│   │       │       ├── AuditCenterView.tsx
│   │       │       ├── AutomationCenterView.tsx
│   │       │       ├── CRMView.tsx
│   │       │       ├── CustomerSupportView.tsx
│   │       │       ├── DashboardLayout.tsx
│   │       │       ├── DocumentCenterView.tsx
│   │       │       ├── FinanceView.tsx
│   │       │       ├── HRView.tsx
│   │       │       ├── HomeView.tsx
│   │       │       ├── IntegrationHubView.tsx
│   │       │       ├── InventoryView.tsx
│   │       │       ├── InvoiceCenterView.tsx
│   │       │       ├── KnowledgeHubView.tsx
│   │       │       ├── MDMView.tsx
│   │       │       ├── ManufacturingView.tsx
│   │       │       ├── NotificationCenterView.tsx
│   │       │       ├── ProcurementView.tsx
│   │       │       ├── ProfileView.tsx
│   │       │       ├── ProjectView.tsx
│   │       │       ├── ReportStudioView.tsx
│   │       │       ├── SecurityView.tsx
│   │       │       ├── SettingsView.tsx
│   │       │       └── WorkflowStudioView.tsx
│   │       ├── pages/              # Primary route landing layouts
│   │       ├── layouts/            # Component layout definitions
│   │       ├── services/           # HTTP API client integrations
│   │       ├── stores/             # Frontend state management handlers
│   │       ├── hooks/              # Reusable React custom hooks
│   │       └── types/              # Frontend-only interfaces & typings
│   │
│   └── api/                        # NestJS Express Backend API Application
│       ├── package.json            # API dependencies & run scripts
│       └── src/
│           ├── main.ts             # API runtime entry file
│           ├── app.module.ts       # Root NestJS module configuration
│           ├── app.controller.ts   # Root app health/status endpoints
│           ├── app.service.ts      # Core status helper scripts
│           ├── auth/               # Firebase JWT authentication checks
│           ├── health/             # System health check endpoints
│           ├── shared/             # Backend-specific utility helpers
│           └── modules/            # Decoupled business domain modules
│               ├── agents/         # AI agent processes & executions
│               ├── analytics/      # Metric calculations & reports
│               ├── crm/            # Customer interactions & CRM routes
│               ├── finance/        # Ledger records & accounts logic
│               ├── hr/             # Employee profiles & timesheets
│               ├── inventory/      # Inventory transactions & safety checks
│               ├── manufacturing/  # Production batch scheduling
│               ├── observability/  # Server latency & error logs
│               ├── procurement/    # Supplier logs & purchase orders
│               ├── projects/       # Operational task boards
│               └── workflows/      # Approval rules & visual workflows
│
├── shared/                         # Shared Cross-Platform Monorepo Library
│   ├── package.json                # Shared sub-package schema configuration
│   ├── constants/                  # Shared system constants & keys
│   ├── errors/                     # Standardized error logic declarations
│   ├── events/                     # Shared event schema configurations
│   ├── permissions/                # Unified RBAC permission mapping metrics
│   ├── types/                      # Common TypeScript interfaces & payloads
│   ├── utils/                      # Reusable helper functions
│   └── validators/                 # Universal input validation models
│
├── database/                       # Database Setup and Governance
│   ├── schemas/                    # Raw SQL schema creation files
│   ├── migrations/                 # PostgreSQL migration records
│   ├── seeds/                      # Seed mock datasets (dev & test)
│   ├── backups/                    # Automated backup SQL dumps
│   └── diagrams/                   # ERDs and relational design diagrams
│
├── DOC/                            # Enterprise Project Documentation
│   ├── REP1.md                     # Chapter 3: Problem Statement
│   ├── REP2.md                     # Chapter 4: Proposed Solution
│   ├── REP3.md                     # Chapter 5: Objectives
│   ├── REP4.md                     # Chapters 6-8: Scope, Requirements, & Architecture
│   ├── REP5.md                     # Technical Specifications & Developed Features
│   └── REP6.md                     # Repository Folder & File Structure (This File)
│
├── configs/                        # Shared Configuration Schemas (ESLint, Prettier)
├── deployment/                     # Deployment Scripts & Containerization Layouts
├── infrastructure/                 # IaC files (Terraform/CloudFormation configs)
├── monitoring/                     # Prometheus/Grafana dashboard setups
├── scripts/                        # Automation & Database Utility Shell Scripts
├── tests/                          # Integration and E2E Test Suites
├── package.json                    # Root monorepo workspace configuration
├── package-lock.json               # Lockfile for root and sub-workspace dependencies
└── ARCHITECTURE.md                 # Technical Architecture Design Documentation
```

---

## 2. Structural Layer Descriptions

### 2.1 Apps Layer (`/apps`)
The `/apps` directory is managed using Node.js Workspaces. It splits code execution into two standalone domains:
* **`/apps/web` (Client Web App):** Built using **React 19** and compiled via **Vite 8**. Tailwind CSS version 4 is loaded using a Vite build integration. It utilizes **Three.js** to render interactive 3D visualizations for system topologies and connection graphs. Core page states are mapped within `/src/components/dashboard`.
* **`/apps/api` (Backend API Server):** Engineered as a **NestJS** application compiling into Node.js runtime code. Decoupled modules inside `src/modules` handle transactional logic, database queries, and routing gates for each business domain (HR, Sourcing, General Ledger).

### 2.2 Shared Modules (`/shared`)
The `/shared` folder acts as an internal npm package shared by `/apps/web` and `/apps/api`. This eliminates code replication. It contains:
* Standardized TypeScript types ensuring JSON payloads sent via REST APIs are validated on both sides.
* Centralized validation schemas (using Zod or equivalent validators) applied during input ingestion.
* Permission maps governing access control checks across the client views and server routes.

### 2.3 Database Layer (`/database`)
This layer handles database versioning and testing datasets:
* **`schemas/`**: Contains raw SQL schema creation definitions, establishing tables, constraints, foreign keys, and indexes in PostgreSQL.
* **`migrations/`**: Tracks incremental database migrations to maintain schema version parity across development, test, and production systems.
* **`seeds/`**: Stores baseline databases seeds, populating mock profiles, financial transactions, and inventories to support development runs and E2E tests.

### 2.4 Documentation Layer (`/DOC`)
The `/DOC` folder acts as the repository for all structured documentation, business reports, and system configuration outlines (REP1 through REP6), ensuring developers and enterprise reviewers can inspect system parameters from a single repository location.
