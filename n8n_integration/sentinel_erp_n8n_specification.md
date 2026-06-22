# Sentinel ERP n8n AI Agent Integration Specification
# Consolidated Master Technical Blueprint & Documentation

This specification establishes the structural architecture, relational tracking schemas, REST/Webhook contracts, prompt engineering libraries, and orchestration rules that form the n8n AI Agent Operating System for Sentinel ERP.

---

## 1. Requirements & System Coverage Catalog

The Sentinel ERP n8n automation suite interfaces with all key business contexts:
* **Human Resources (HRMS):** Manages employee profile indexing (`/hr/employees`), leave application analysis (`/hr/leaves`), and onboarding events.
* **CRM & Sales:** Integrates sales leads ingestion (`/crm/deals`), support ticket queues (`/crm/tickets`), and contact webforms routing.
* **Finance & Accounting:** Conducts bookkeeping general ledger matching (`/finance/ledgers`), invoice overdue reconciliation (`/finance/invoices`), and CFO sign-off routing.
* **Procurement & SCM:** Monitors inventory balances, identifies low stock alerts, selects vendors (`/procurement/vendors`), and issues RFQ documents (`/procurement/rfqs`).

### Real-Time Ingest Channels
* **Webhooks:**
  - Lead Ingest: `POST /webhook/crm/lead-created`
  - Overdue Invoices: `POST /webhook/finance/invoice-overdue`
  - Reorder Thresholds: `POST /webhook/inventory/stock-alert`
* **WebSockets:**
  - `/ws/copilot`: Multi-agent chat interface.
  - `/ws/alerts`: real-time push compliance alerts.

---

## 2. Relational tracking SQL DDL Schema

Below is the DDL schema configured for PostgreSQL (including `pgvector` index support) to trace executions, cost parameters, and chunk embeddings.

```sql
-- PostgreSQL DDL Script — Sentinel ERP n8n AI Agent Database Engine
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgvector;

CREATE SCHEMA IF NOT EXISTS n8n_core;
CREATE SCHEMA IF NOT EXISTS vector_store;

-- 1. Agent Registry Schema
CREATE TABLE n8n_core.agents (
    agent_id VARCHAR(50) PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    agent_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('task', 'reasoning', 'analytical', 'coordinator')),
    department VARCHAR(50) NOT NULL,
    owner VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Nominal' CHECK (status IN ('Nominal', 'Degraded', 'Offline', 'Maintenance')),
    priority VARCHAR(20) NOT NULL DEFAULT 'Standard' CHECK (priority IN ('Low', 'Standard', 'High', 'Critical')),
    model VARCHAR(100) NOT NULL DEFAULT 'gemini-2.5-flash',
    temperature NUMERIC(3, 2) NOT NULL DEFAULT 0.2 CHECK (temperature >= 0.0 AND temperature <= 2.0),
    max_tokens INTEGER NOT NULL DEFAULT 2048,
    cost_limit NUMERIC(10, 4) NOT NULL DEFAULT 0.05,
    permissions JSONB DEFAULT '[]'::jsonb,
    allowed_tools JSONB DEFAULT '[]'::jsonb,
    memory_profile JSONB DEFAULT '{}'::jsonb,
    knowledge_sources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Workflows Schema
CREATE TABLE n8n_core.workflows (
    workflow_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('Webhook', 'WebSocket', 'Interval', 'Cron', 'Internal Event')),
    endpoint VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Execution Logs Schema
CREATE TABLE n8n_core.runs (
    run_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id VARCHAR(100) REFERENCES n8n_core.workflows(workflow_id) ON DELETE CASCADE,
    tenant_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In_Progress' CHECK (status IN ('In_Progress', 'Success', 'Failed', 'Suspended_HIPL')),
    input_payload JSONB DEFAULT '{}'::jsonb,
    output_payload JSONB DEFAULT '{}'::jsonb,
    total_tokens INTEGER DEFAULT 0,
    total_cost NUMERIC(10, 6) DEFAULT 0.000000,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- 4. Agent Calls Logs
CREATE TABLE n8n_core.agent_calls (
    call_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID REFERENCES n8n_core.runs(run_id) ON DELETE CASCADE,
    agent_id VARCHAR(50) REFERENCES n8n_core.agents(agent_id),
    prompt_payload TEXT NOT NULL,
    response_payload TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    cost NUMERIC(10, 6) NOT NULL DEFAULT 0.000000,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Cost Tracking Schema
CREATE TABLE n8n_core.cost_limits (
    department VARCHAR(50) PRIMARY KEY,
    monthly_budget NUMERIC(10, 2) NOT NULL,
    cost_spent NUMERIC(10, 4) NOT NULL DEFAULT 0.0000,
    warning_threshold NUMERIC(3, 2) NOT NULL DEFAULT 0.80,
    is_halted BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Vector Embeddings
CREATE TABLE vector_store.embeddings (
    embedding_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doc_title VARCHAR(255) NOT NULL,
    chunk_content TEXT NOT NULL,
    embedding vector(1536) NOT NULL, -- Dimensions for Gemini Embeddings Model
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_embeddings_vector ON vector_store.embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 7. Audit Logs Schema
CREATE TABLE n8n_core.audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. OpenAPI 3.0 Contract Specification

```yaml
openapi: 3.0.3
info:
  title: Sentinel ERP n8n Integration Gateway API
  description: REST and Webhook endpoints connecting n8n workflows and Sentinel ERP core system.
  version: 1.0.0
servers:
  - url: https://api.sentinel-erp.internal/v1
paths:
  /hr/employees:
    get:
      summary: Retrieve Employee Profiles
      security:
        - BearerAuth: []
      responses:
        '200':
          description: List of employee records.
  /hr/leaves:
    get:
      summary: Retrieve Pending Leaves
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Pending leave sheets.
  /crm/deals:
    get:
      summary: List CRM Deals
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Active CRM deals.
    post:
      summary: Create CRM Deal
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title, status, priority]
              properties:
                title: { type: string }
                status: { type: string, enum: [Lead, Qualified, Negotiating, Won, Lost] }
                priority: { type: string, enum: [Low, Standard, High, Critical] }
                company: { type: string }
                contact_email: { type: string }
      responses:
        '201':
          description: Deal created successfully.
  /finance/ledgers/adjust:
    post:
      summary: Submit Ledger Correction
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [adjustments]
              properties:
                adjustments:
                  type: array
                  items:
                    type: object
                    required: [ledger_id, amount, correction_reason]
                    properties:
                      ledger_id: { type: string }
                      amount: { type: number }
                      correction_reason: { type: string }
      responses:
        '200':
          description: Adjustments queued.
  /webhook/crm/lead-created:
    post:
      summary: Lead Ingest Webhook
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [company, contact_email, request_message]
              properties:
                company: { type: string }
                contact_email: { type: string }
                request_message: { type: string }
      responses:
        '202':
          description: Scheduled.
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

---

## 4. Multi-Agent Orchestration & RAG Architecture

### Orchestration Handoffs
* **Confidence Checks:** Execution steps route to manual queues if confidence scores fall below `0.85`.
* **Human-in-the-Loop Thresholds:**
  - Financial Ledger adjustments $> ₹5,00,000$ halt execution for Slack interactive approval.
  - Contract discounts $>15\%$ trigger manager verification blocks.
  - Leaves request duration $>10$ days requires manager sign-off.
* **Fallback Protocol:** Active retry is set to 3 times with exponential backoff. Failed loops degrade gracefully and notify the Coordinator Agent (`agent-4`).

### pgvector RAG Mechanics
* **Chunking parameters:** Chunk size: `1000` characters; overlap size: `200` characters.
* **Retrieval logic:** Cosine distance similarity metric with a matching threshold limit $< 0.40$.
* **Grounding instruction:** Prompts require referencing chunk IDs and source titles, strictly forbidding hallucinations.

---

## 5. System Prompt Engineering Library

### 1. Planner Agent Prompt
```markdown
You are the Lead Planner Agent. Your mission is to parse unstructured requests, determine target operational intents (CRM, Finance, HRMS, SCM), and output a sequential Directed Acyclic Graph plan matching this schema:
{
  "thought_process": "String detailing plan formulation logic",
  "steps": [
    {
      "step_id": 1,
      "agent_id": "agent_identifier",
      "action_type": "agent_execution | api_call | human_approval",
      "instruction": "Detailed task description",
      "input_mappings": { "key": "value" }
    }
  ]
}
Constraints: Maximum of 8 plan steps. Do not execute tools. Redact raw PII fields using placeholder tags.
```

### 2. Coordinator Agent Prompt (agent-4)
```markdown
You are the Coordinator Agent (agent-4). You act as the conversational proxy routing payloads between users (via WebSocket `/ws/copilot`) and child execution runs.
Instructions:
1. Parse user queries, trigger the Planner, and route sub-workflow execution runs.
2. Intercept errors. If a step fails, apply escalation rules.
3. Consolidate results into executive summaries.
Constraints: Enforce tenant_id isolation boundaries. Block execution if total run expenses exceed $0.50.
```

### 3. Finance Auditor Agent Prompt (agent-3)
```markdown
You are the Finance Auditor Agent (agent-3).
Mission: Audit book ledger balances against billing invoices. Flag duplicates, tax omissions, and anomalies.
Constraints: Adjustments above ₹5,00,000 require CFO manual sign-off. Do not delete raw logs. Mask credit cards as suffix values (e.g. *1234).
```

### 4. HR Operations Agent Prompt
```markdown
You are the HR Operations Agent.
Mission: Process leave requests, lookup employee schedules, and prepare onboarding templates.
Constraints: Automatically reject leave requests exceeding allowance limits or creating overlapping department gaps. Do not expose personal SSNs or addresses.
```

### 5. CRM Qualifier Agent Prompt
```markdown
You are the Sales Qualifier Agent (agent-1).
Mission: Evaluate contact webform leads, calculate priority scores (0-100), and update deal stages.
Score calculation logic: Company size >500 (+40), Budget details present (+30), Targeted industry (+20), timeline <3 months (+10).
```

### 6. Sales Closer Agent Prompt (agent-2)
```markdown
You are the Sales Closer Agent (agent-2).
Mission: Generate custom contract drafts and check discounting margins.
Constraints: Discounts above 15% require Finance Manager approval; above 25% require VP Sales confirmation.
```

### 7. Procurement Agent Prompt
```markdown
You are the Procurement Agent.
Mission: Intercept stock shortage alerts, identify active vendor agreements, draft RFQs, and compile price comparison grids.
Constraints: Prepare RFQs for at least 3 vendors for values >₹50,000. Purchase orders >₹1,00,000 require manual manager signature.
```

### 8. Inventory Agent Prompt
```markdown
You are the Inventory Agent.
Mission: Track stock level metrics and generate reorder recommendations.
Constraints: Prevent duplicate RFQ creation if active purchase orders for the item are already pending.
```

### 9. Compliance Auditor Agent Prompt
```markdown
You are the Compliance Auditor Agent.
Mission: Audit user logs, detect drift in environment settings, and monitor workflow execution durations to identify SLA violations.
```

### 10. Security Scrubber Agent Prompt
```markdown
You are the Security Agent.
Mission: Inspect incoming prompts, locate credit card patterns (LUHN matching), SSNs, API credentials, and hash/mask them securely before sending context to LLMs.
```

### 11. BI Analytics Agent Prompt
```markdown
You are the Analytics Agent.
Mission: Query execution runs, calculate token costs, and issue warning notifications to departments approaching monthly budgets.
```
