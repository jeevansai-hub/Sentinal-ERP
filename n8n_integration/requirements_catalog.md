# Requirements Catalog — Sentinel ERP n8n AI OS

This catalog lists all extracted enterprise operational requirements, backend interfaces, event schemas, databases, and governance constraints mapped directly from the active codebases and systems configurations.

---

## 1. ERP Modules Coverage
The n8n Command Center integrates directly with all core Sentinel ERP operational contexts:

* **Human Resources (HRMS):** Employee profile indexing (`/hr/employees`), leave approvals tracking (`/hr/leaves`), and onboarding events routing.
* **CRM & Sales:** Sales deals lifecycle management (`/crm/deals`), customer ticket classification (`/crm/tickets`), and contact form leads ingestion.
* **Finance & Auditing:** Accounting general ledgers matching (`/finance/ledgers`), invoice updates verification (`/finance/invoices`), and compliance reviews.
* **Procurement:** Purchase Order (PO) draft processing, vendor contract directory lookup (`/procurement/vendors`), and Request for Quote (RFQ) updates (`/procurement/rfqs`).
* **Inventory & SCM:** Warehouse balance metrics, item catalogs lookup, and Stock Reorder warning thresholds.
* **Workflows & Orchestration:** Workflow definitions listing (`/workflows/definitions`) and bottlenecks performance tracing (`/workflows/metrics`).

---

## 2. API Endpoints
The following internal REST interfaces are exposed by the NestJS server for tool-integration:

* `GET /hr/employees` - Fetches profiles and department boundaries.
* `GET /hr/leaves` - Fetches pending leave sheets.
* `GET /crm/deals` - Lists client sales deals and pipeline stages.
* `GET /crm/tickets` - Retrieves support tickets.
* `GET /finance/ledgers` - Reads transactional bookkeeping records.
* `GET /finance/invoices` - Queries customer invoices billing state.
* `GET /procurement/vendors` - Queries registered supplier contracts.
* `GET /procurement/rfqs` - Reads RFQ templates and active drafts.
* `GET /workflows/definitions` - Fetches registered workflow configurations.
* `GET /workflows/metrics` - Traces execution duration and manual delays.

---

## 3. Webhooks & WebSocket Channels

### Webhooks
* **Lead Ingest:** `POST /webhook/crm/lead-created` (for contact form triage).
* **Billing Alerts:** `POST /webhook/finance/invoice-overdue` (for invoice audits).
* **Supply Breaches:** `POST /webhook/inventory/stock-alert` (for reordering triggers).

### WebSocket Connections
* **`/ws/copilot`:** Continuous duplex communication between frontend chat widget and the AI Agent.
* **`/ws/alerts`:** Server-to-client push channel for real-time compliance notifications.

---

## 4. Databases & Embeddings
* **Relational Storage:** PostgreSQL schema boundaries separating `hr`, `finance`, `crm`, `workflows`, and `vector` metadata.
* **Vector Store:** PostgreSQL `pgvector` extension schema `vector.embeddings` storing SOP documents, policies, and historical audit records.
* **Vector Generation:** `gemini-text` models converting text chunks (1000 characters size, 200 overlap) into vector floats.

---

## 5. Security & Isolation Constraints
* **Authentication:** All HTTP connections to NestJS server endpoints require an Authorization Header carrying a JWT token verified via Firebase Auth project `sentinel-erp-auth-92831`.
* **RBAC Enforcement:** Controller endpoints restrict reads/writes according to decorators matching user security profiles.
* **Data Masking:** PII fields (salaries, SSNs, credit cards) must be stripped out at the n8n logic gate prior to passing strings to external LLM provider endpoints.
* **Tenant Isolation:** Every webhook query must supply a valid `tenant_id` mapping to isolate data.
