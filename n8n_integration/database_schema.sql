-- PostgreSQL DDL Script — Sentinel ERP n8n AI Agent Database Engine
-- Configures schemas for agent status tracking, run logging, token/cost budgets, and pgvector embeddings.

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for semantic search storing
CREATE EXTENSION IF NOT EXISTS pgvector;

CREATE SCHEMA IF NOT EXISTS n8n_core;
CREATE SCHEMA IF NOT EXISTS vector_store;

----------------------------------------------------
-- 1. AGENT REGISTRY & HEALTH TRACKING
----------------------------------------------------
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

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agents_timestamp 
BEFORE UPDATE ON n8n_core.agents 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

----------------------------------------------------
-- 2. WORKFLOW CONFIGURATION METADATA
----------------------------------------------------
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

CREATE TRIGGER update_workflows_timestamp 
BEFORE UPDATE ON n8n_core.workflows 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

----------------------------------------------------
-- 3. WORKFLOW RUN LOGGING & AUDIT
----------------------------------------------------
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

CREATE INDEX idx_runs_workflow ON n8n_core.runs(workflow_id);
CREATE INDEX idx_runs_tenant ON n8n_core.runs(tenant_id);
CREATE INDEX idx_runs_status ON n8n_core.runs(status);

----------------------------------------------------
-- 4. AGENT LLM CALLS METRICS
----------------------------------------------------
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

CREATE INDEX idx_agent_calls_run ON n8n_core.agent_calls(run_id);
CREATE INDEX idx_agent_calls_agent ON n8n_core.agent_calls(agent_id);

----------------------------------------------------
-- 5. COST BUDGETS & LIMITS
----------------------------------------------------
CREATE TABLE n8n_core.cost_limits (
    department VARCHAR(50) PRIMARY KEY,
    monthly_budget NUMERIC(10, 2) NOT NULL,
    cost_spent NUMERIC(10, 4) NOT NULL DEFAULT 0.0000,
    warning_threshold NUMERIC(3, 2) NOT NULL DEFAULT 0.80, -- warn at 80%
    is_halted BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_cost_limits_timestamp 
BEFORE UPDATE ON n8n_core.cost_limits 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

----------------------------------------------------
-- 6. VECTOR EMBEDDINGS (pgvector)
----------------------------------------------------
CREATE TABLE vector_store.embeddings (
    embedding_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doc_title VARCHAR(255) NOT NULL,
    chunk_content TEXT NOT NULL,
    embedding vector(1536) NOT NULL, -- Matched to gemini text embedding output dimensions
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_embeddings_vector ON vector_store.embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

----------------------------------------------------
-- 7. AUDIT TRAIL LOGGING
----------------------------------------------------
CREATE TABLE n8n_core.audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL, -- Firebase UID reference
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON n8n_core.audit_logs(user_id);
