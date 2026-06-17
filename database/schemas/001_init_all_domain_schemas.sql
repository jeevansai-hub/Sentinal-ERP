-- ==========================================
-- Sentinel ERP Master Database Initialization
-- Evolutionary Modular Monolith Architecture (ADR-001 & ADR-002)
-- ==========================================

-- 1. Create Isolated Domain Schemas
CREATE SCHEMA IF NOT EXISTS org;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS hr;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS procurement;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS projects;
CREATE SCHEMA IF NOT EXISTS workflows;
CREATE SCHEMA IF NOT EXISTS automation;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS reporting;
CREATE SCHEMA IF NOT EXISTS notifications;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS agents;
CREATE SCHEMA IF NOT EXISTS shared;
CREATE SCHEMA IF NOT EXISTS observability;
CREATE SCHEMA IF NOT EXISTS governance;

-- ==========================================
-- 2. Audit Domain (Traceability)
-- ==========================================
CREATE TABLE audit.actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    target_table VARCHAR(100) NOT NULL,
    previous_value JSONB,
    new_value JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    trace_id VARCHAR(100) NOT NULL,
    correlation_id VARCHAR(100) NOT NULL,
    triggered_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_actions_operator ON audit.actions(operator);
CREATE INDEX idx_audit_events_type ON audit.events(event_type);

-- ==========================================
-- 3. Org & Auth Domains
-- ==========================================
CREATE TABLE org.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    manager_id VARCHAR(100),
    parent_unit_id UUID REFERENCES org.units(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'SCM Operator', -- 'Administrator', 'HR', 'Finance', 'Executive'
    permissions TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. HR Domain (Workforce)
-- ==========================================
CREATE TABLE hr.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role_designation VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    base_ctc_monthly DECIMAL(12,2) NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    performance_score DECIMAL(3,2) DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hr.leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hr.employees(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Denied'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. Finance Domain
-- ==========================================
CREATE TABLE finance.ledgers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_name VARCHAR(150) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- 'asset', 'liability', 'revenue', 'expense'
    balance_amt DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE finance.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(150) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Unpaid', -- 'Unpaid', 'Paid', 'Overdue'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6. CRM Domain
-- ==========================================
CREATE TABLE crm.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(150) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    stage VARCHAR(50) NOT NULL, -- 'Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won'
    owner_name VARCHAR(150) NOT NULL,
    health VARCHAR(30) NOT NULL DEFAULT 'Optimal', -- 'Optimal', 'Warning', 'At Risk'
    close_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crm.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(150) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Open', -- 'Open', 'In Progress', 'Closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 7. SCM & Procurement Domains
-- ==========================================
CREATE TABLE procurement.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    sla_compliance INT NOT NULL DEFAULT 100,
    reliability_score INT NOT NULL DEFAULT 100,
    cost_efficiency INT NOT NULL DEFAULT 100,
    risk_status VARCHAR(20) NOT NULL DEFAULT 'Low', -- 'Low', 'Medium', 'High'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE procurement.rfqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_description VARCHAR(255) NOT NULL,
    vendor_id UUID REFERENCES procurement.vendors(id),
    valuation_amt DECIMAL(15,2) NOT NULL,
    delivery_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Active', 'Closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    capacity_total INT NOT NULL,
    capacity_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 8. Workflows & Automations
-- ==========================================
CREATE TABLE workflows.definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL,
    actions_payload JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflows.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows.definitions(id),
    title VARCHAR(150) NOT NULL,
    assigned_role VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 9. Future AI Agent OS schemas (Empty Logic)
-- ==========================================
CREATE TABLE agents.registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    agent_type VARCHAR(50) NOT NULL, -- 'reasoning', 'analytical', 'task'
    department_owner VARCHAR(50) NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    objectives TEXT[] NOT NULL DEFAULT '{}',
    cost_limits_inr DECIMAL(12,2) NOT NULL DEFAULT 50000.00,
    health_status VARCHAR(50) NOT NULL DEFAULT 'Nominal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agents.decision_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents.registry(id),
    context JSONB NOT NULL,
    decision_made TEXT NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agents.swarms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    member_agent_ids UUID[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 10. Observability, Timeline & Integration Bus
-- ==========================================
CREATE TABLE observability.system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type VARCHAR(100) NOT NULL, -- 'api_latency', 'db_query_time', 'queue_depth'
    value DECIMAL(12,4) NOT NULL,
    labels JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shared.universal_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_domain VARCHAR(50) NOT NULL,
    event_severity VARCHAR(20) NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    payload JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shared.webhook_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_name VARCHAR(100) NOT NULL,
    endpoint_url VARCHAR(255) NOT NULL,
    direction VARCHAR(20) NOT NULL, -- 'inbound', 'outbound'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE governance.ai_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(100) NOT NULL,
    cost_limit_inr DECIMAL(12,2) NOT NULL,
    requires_human_approval BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE knowledge.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    department_owner VARCHAR(50) NOT NULL,
    content_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 11. Initial Seeding of Mock Data for Clickable Telemetry
-- ==========================================
INSERT INTO auth.users (email, display_name, role, permissions) VALUES 
('admin@gmail.com', 'System Administrator', 'Administrator', '{"*"}');

INSERT INTO procurement.vendors (name, category, sla_compliance, reliability_score, cost_efficiency, risk_status) VALUES
('Reliance Materials Ltd', 'Raw Metal Refineries', 98, 92, 85, 'Low'),
('Tata Steel Processing', 'Heavy Metal Plates', 94, 88, 75, 'Low'),
('Hindalco Extrusions', 'Aluminum Alloys', 89, 78, 90, 'Medium'),
('Vedanta Sourcing', 'Copper Refineries', 81, 65, 60, 'High'),
('Jindal Steel Power', 'Forged Iron Rails', 96, 90, 80, 'Low');

INSERT INTO agents.registry (name, agent_type, department_owner, skills, objectives, cost_limits_inr, health_status) VALUES
('Lead Qualifier Agent', 'task', 'Sales', '{"lead-sorting","sentiment-analysis"}', '{"Filter incoming sales opportunities","Flag high-value prospects"}', 25000.00, 'Nominal'),
('Sales Closer Agent', 'reasoning', 'Sales', '{"negotiation","contract-drafting"}', '{"Close pending enterprise deals","Resolve pricing blocks"}', 50000.00, 'Nominal'),
('Finance Auditor Agent', 'analytical', 'Finance', '{"ledger-matching","disbursement-verification"}', '{"Match payment invoices","Flag SLA breaches"}', 75000.00, 'Nominal');
