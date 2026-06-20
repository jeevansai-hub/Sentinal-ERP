# 🛡️ Sentinel ERP — Next-Gen AI-Native Enterprise Platform

<div align="center">

![Project Header](https://raw.githubusercontent.com/jeevansai-hub/Sentinal-ERP/main/assets/readme-header.png)

[![Vite](https://img.shields.io/badge/Vite-v8.0.16-646CFF?logo=vite&logoColor=white&style=for-the-badge)](#)
[![React](https://img.shields.io/badge/React-v19.2.6-61DAFB?logo=react&logoColor=black&style=for-the-badge)](#)
[![NestJS](https://img.shields.io/badge/NestJS-v10.0-E0234E?logo=nestjs&logoColor=white&style=for-the-badge)](#)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)](#)

<p align="center">
  A clean, high-performance, and modular AI-native ERP monorepo designed to unify HRMS, CRM, Finance, Supply Chain, and Workflow Automation under a single intelligent system.
</p>

<h4>
  <a href="https://sentinel-erp-auth-92831.web.app">🌐 Live Web Application URL</a>
  <span> · </span>
  <a href="#-architecture--module-boundaries">🏗️ System Architecture</a>
  <span> · </span>
  <a href="#-getting-started">🚀 Quick Start</a>
  <span> · </span>
  <a href="#-contributing--development-workflow">👥 Contributing</a>
</h4>

</div>

---

> [!IMPORTANT]
> ### 🌟 Deployed Web Instance
> **Vite App Address:** [https://sentinel-erp-auth-92831.web.app](https://sentinel-erp-auth-92831.web.app)  
> The React single-page frontend is fully built and hosted on **Firebase Hosting**. Explore the real-time Dashboard, Kanban Taskboards, and interactive AI Copilot terminal directly on the live environment.

---

## 📖 Table of Contents
1. [Core Pillars & Features](#-core-pillars--features)
2. [Architecture & Module Boundaries](#-architecture--module-boundaries)
3. [File & Directory Structure](#-file--directory-structure)
4. [Technology Stack](#-technology-stack)
5. [Getting Started](#-getting-started)
6. [API & Validation Layer](#-api--validation-layer)
7. [Contributing & Development Workflow](#-contributing--development-workflow)
8. [License & Support](#-license--support)

---

## 💡 Core Pillars & Features

Sentinel ERP is divided into three distinct operational pillars, designed to optimize organizational efficiency and data flow:

```
                  ┌─────────────────────────────────────────┐
                  │              SENTINEL ERP               │
                  └────────────────────┬────────────────────┘
          ┌────────────────────────────┼────────────────────────────┐
┌─────────┴─────────┐        ┌─────────┴─────────┐        ┌─────────┴─────────┐
│     PILLAR 1      │        │     PILLAR 2      │        │     PILLAR 3      │
│Unified Operations │        │Intelligent Auto.  │        │AI & Intelligence  │
└───────────────────┘        └───────────────────┘        └───────────────────┘
```

### 1. Unified Operations (Core Modules)
* **HRMS:** Centralized employee directory, attendance tracking, automated payroll processing, leaves approval, and performance management.
* **CRM:** Multi-stage sales pipelines, customer accounts management, deal flow logs, and sales velocity metrics.
* **Finance:** Triple-entry ledger accounting, custom invoicing, dynamic tax rules, cash flow analytics, and balance sheet exports.
* **Inventory & Procurement:** SKU cataloguing, multi-warehouse stock management, low-stock triggers, Purchase Order (PO) creation, and vendor onboarding.
* **Manufacturing:** Bills of Material (BOM) management and work-order scheduling.

### 2. Intelligent Automation
* **Workflow Studio:** Drag-and-drop visual workflow builder with conditional if/else branching.
* **Cross-Department Triggers:** Seamless automated event propagation (e.g., *Deal Won in CRM* $\rightarrow$ *Automated Invoice generated in Finance* $\rightarrow$ *Work Order scheduled in Manufacturing*).
* **Auto-Escalation Engine:** Automatically route approvals to higher authorities if SLA response times are breached.

### 3. AI Business Intelligence
* **Sentinel AI Copilot:** A chat-based assistant that lets users run reports, trigger tasks, and look up ERP insights in plain English.
* **Demand Forecasting:** Machine Learning-based inventory demand projection to prevent over-stocking or stock-out situations.
* **Anomaly Detection:** Real-time scanning of transaction records and ledger logs to highlight compliance or fraud risks.

---

## 🏗️ Architecture & Module Boundaries

The system is built as a **Modular Monolith** using **DDD (Domain-Driven Design)** principles. Every module operates within its own **Bounded Context**, defining its own schemas, domain logic, and interface points.

```mermaid
graph TD
    subgraph Client ["Client (apps/web)"]
        Components["Vite + React Components"]
        Hooks["Custom Hooks & Contexts"]
        Three["Three.js Graphics (MagicRings)"]
    end

    subgraph API ["API Server (apps/api)"]
        subgraph Routing ["NestJS Controller / Validation"]
            Route["HTTP Router / Guards"]
            Zod["Zod Validation Pipes"]
        end

        subgraph Modules ["Bounded Module Domains"]
            subgraph HR ["HR Module"]
                HRC["HR Controller"]
                HRS["HR Service"]
                HRE["HR Domain Entities"]
            end
            subgraph FIN ["Finance Module"]
                FINC["Finance Controller"]
                FINS["Finance Service"]
                FINE["Finance Domain Entities"]
            end
            subgraph WRK ["Workflows Module"]
                WRKC["Workflows Controller"]
                WRKS["Workflows Service"]
            end
        end

        subgraph Event_Bus ["Local Domain Event Bus"]
            Bus["Event Emitter / Handlers"]
        end
    end

    subgraph Database ["PostgreSQL Datastore"]
        Schema_HR[("Schema: hr")]
        Schema_FIN[("Schema: finance")]
        Schema_WRK[("Schema: workflows")]
    end

    Components --> Route
    Route --> Zod
    Zod --> HRC
    Zod --> FINC
    Zod --> WRKC

    HRS -. Emits Domain Events .-> Bus
    Bus -. Triggers Action .-> FINS

    HRC --> HRS
    HRS --> HRE
    HRE --> Schema_HR

    FINC --> FINS
    FINS --> FINE
    FINE --> Schema_FIN

    WRKC --> WRKS
    WRKS --> Schema_WRK
```

### Module Separation Guidelines
To prevent spaghetti code, Sentinel ERP enforces strict architectural boundaries:
1. **No direct database queries across schemas:** If the `Finance` module needs employee details from `HRMS`, it must fetch them via the public HRMS service API, never by directly joining `hr.employees` in SQL.
2. **Encapsulated exports:** Every module must expose its public interfaces ONLY through its main `index.ts` file. Internal files cannot be imported across boundaries.
3. **Async decoupling:** Cross-module coordination is handled asynchronously using domain events where possible.

---

## 📁 File & Directory Structure

```
Sentinal-ERP/
├── apps/
│   ├── api/                   # NestJS Backend Application
│   │   ├── src/
│   │   │   ├── modules/       # Bounded Modules (HR, Finance, CRM, etc.)
│   │   │   │   └── <domain>/
│   │   │   │       ├── presentation/   # Controllers, DTOs, Rest routes
│   │   │   │       ├── application/    # Services, command/query handlers
│   │   │   │       ├── domain/         # Entities, aggregates, events
│   │   │   │       ├── infrastructure/ # DB queries, TypeORM adapters
│   │   │   │       └── index.ts        # Module public interface
│   │   │   └── main.ts        # Backend Entrypoint
│   │   └── tsconfig.json
│   ├── web/                   # React Single-Page Application (Vite)
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI widgets & dashboards
│   │   │   ├── hooks/         # Custom state hooks
│   │   │   ├── styles/        # Global layouts & custom stylesheet
│   │   │   ├── App.tsx        # React Routing & Landing Layout
│   │   │   └── main.tsx       # Vite entrypoint
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── landing/               # Static HTML landing page backup
├── shared/                    # Shares models, validators, and constants
├── configs/                   # Global configuration files (.env templates)
├── firebase.json              # Hosting target configuration
├── package.json               # Monorepo Workspace configuration
└── README.md                  # Home Documentation
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19** | Modern reactive client components |
| **Styling** | **Tailwind CSS 4 + Vanilla CSS** | Sleek, glassmorphic dark UI styling |
| **Graphics** | **Three.js / React Three Fiber** | Premium animated visual ornaments |
| **Backend API** | **NestJS (Node.js)** | Modular controllers, DTOs, security filters |
| **Language** | **TypeScript 5.x** | Static typing across monorepo packages |
| **Database** | **PostgreSQL** | Relational storage with strict schema isolation |
| **Authentication** | **Firebase Auth** | Secure OAuth and user credentials verification |
| **Hosting** | **Firebase Hosting** | Static distribution and distribution delivery |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `>=20.0.0`
- **NPM:** `>=10.0.0`
- **Database:** Local or Cloud PostgreSQL instance

### 1. Workspace Installation
Install all monorepo dependencies (Vite client, NestJS API, Shared packages) in one step:
```bash
npm install
```

### 2. Environment Variables Config
Create a `.env` file at the project root based on `configs/environments/.env.development.example`:
```ini
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/sentinelerp?schema=public"
JWT_SECRET="your-super-secure-jwt-secret-key-goes-here"
FIREBASE_PROJECT_ID="sentinel-erp-auth-92831"
```

### 3. Run Locally (Development)
Launch the API and client servers concurrently in watch-mode:
```bash
npm run dev
```
* **Client App:** `http://localhost:5173/`
* **API Server:** `http://localhost:3000/`

---

## 🔒 API & Validation Layer

### Input Validation
All HTTP requests undergo schema validation at the presentation boundary using **Zod**. This guarantees that invalid payloads never reach the inner application or domain layers.

Example validation schema:
```typescript
import { z } from 'zod';

export const CreateEmployeeSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'employee']),
  departmentId: z.string().uuid(),
  salary: z.number().positive(),
});

export type CreateEmployeeDto = z.infer<typeof CreateEmployeeSchema>;
```

### Security & Guards
Controller routes are protected by NestJS Guards:
- **`AuthGuard`**: Decodes and verifies client JWTs from Authorization headers.
- **`RolesGuard`**: Checks active permissions based on RBAC (Role-Based Access Control) decorators.

```typescript
@UseGuards(AuthGuard, RolesGuard)
@Roles('hr-manager')
@Post('employees')
async create(@Body(new ZodValidationPipe(CreateEmployeeSchema)) dto: CreateEmployeeDto) {
  return this.hrService.createEmployee(dto);
}
```

---

## 👥 Contributing & Development Workflow

Contributions from the open-source community are highly valued! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) to understand the guidelines.

### Git Flow & Commit Rules
We follow **Conventional Commits** formatting for clear changelog logs:
- `feat(hr): add custom onboarding workflow`
- `fix(finance): correct invoice tax rounding`
- `docs(readme): add visual architecture section`
- `chore(deps): update framer-motion to v12`

---

## 📄 License & Support

Sentinel ERP is open-source software licensed under the **MIT License**.

- **Bug Reports:** Open an issue on our [GitHub Issue Tracker](https://github.com/jeevansai-hub/Sentinal-ERP/issues).
- **Security Flaws:** Please report vulnerabilities in confidence via the instructions in our [SECURITY.md](./SECURITY.md).