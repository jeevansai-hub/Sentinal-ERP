# n8n AI Agent Workflows Implementation Blueprint

This blueprint outlines the production-ready n8n AI Agent and Workflow architecture extracted from the Sentinel ERP project codebase. It maps the actual REST API interfaces, agents registry, and modular monolithic architecture of Sentinel ERP directly into deployable n8n nodes and logic gates.

---

## 1. Agent Catalog

Exposed via `/agents/registry`, the platform contains three core cognitive agents.

### Agent 1: Lead Qualifier Agent
* **Business Purpose:** Triages incoming customer leads and evaluates interest quality based on sentiment and firmographics.
* **Trigger Events:** `Event: Lead Created` (via `/webhooks/crm/lead-created`).
* **Inputs:** CRM contact form schema (`email`, `companySize`, `requestMessage`).
* **Outputs:** Lead categorization score, confidence score (`number`), assignment owner.
* **Decision Logic:** Matches firmographics against target profile (e.g. `companySize > 50`) and evaluates requests using Sentiment Analysis.
* **Actions:** Calls `/crm/deals` to create a qualified deal or tags CRM logs for nurture routing.
* **Tools Used:** `CRM Deal API Tool`, `Sentiment Analysis Model Tool`.
* **Memory Requirements:** Ephemeral Chat Window Memory (10 messages buffer).
* **Approval Requirements:** None (fully automated qualification).
* **Escalation Logic:** Route to manual Sales Inbox if confidence score falls below `85%`.
* **Dependencies:** CRM database schema access.
* **Expected Outcomes:** Automated lead categorization with < 2% human touchpoint.

### Agent 2: Sales Closer Agent
* **Business Purpose:** Generates custom contract drafts and suggests discount boundaries during active negotiations.
* **Trigger Events:** `Event: Deal Negotiating` (via `/crm/deals` updates).
* **Inputs:** Deal details (`dealValue`, `clientRequirements`, `standardTerms`).
* **Outputs:** Contract draft document PDF, discount recommendation.
* **Decision Logic:** Strictly checks margin boundaries:
  - If requested discount $\le 15\%$: Auto-approves and drafts contract.
  - If requested discount $> 15\%$: Initiates approval workflow.
* **Actions:** Updates `/crm/deals` stage and dispatches Slack alert to Sales Rep.
* **Tools Used:** `DocGen HTML-to-PDF Tool`, `CRM Deals Updater Tool`.
* **Memory Requirements:** Long-Term Pinecone memory holding historical contract structures.
* **Approval Requirements:** Finance approval required for discounts between $15\%$ and $25\%$.
* **Escalation Logic:** Escalates automatically to VP of Sales if discount exceeds $25\%$.
* **Dependencies:** CRM and Finance API modules.

### Agent 3: Finance Auditor Agent
* **Business Purpose:** Audits ledgers against invoices and verifies payment reconciliation compliance.
* **Trigger Events:** `Event: Invoice Overdue` or `Event: Invoice Created`.
* **Inputs:** Ledger records, invoices transaction data DTO.
* **Outputs:** Match confirmation (`Matched` or `Discrepancy`), risk flags, error reports.
* **Decision Logic:** Double-entry ledger comparison:
  - Match invoice line sums with ledger ledger entries.
  - Flag if variance $> 0.01\%$.
* **Actions:** Marks `/finance/invoices` audit status and creates discrepancies alerts.
* **Tools Used:** `Ledgers API Tool`, `Invoices API Tool`.
* **Memory Requirements:** Conversation memory holding auditing runs history.
* **Approval Requirements:** CFO manual approval required for ledger corrections $> ₹5,00,000$.
* **Escalation Logic:** Escalates if ledger discrepancy remains unresolved $> 48$ hours.
* **Dependencies:** Finance module API endpoints (`/finance/ledgers`, `/finance/invoices`).

---

## 2. Workflow Catalog

Based on the `/workflows/definitions` endpoints mapping:

### Workflow 1: Invoice Audit Approval (`wf-201`)
* **Business Goal:** Automated audit and manual escalation routing for overdue invoices.
* **Trigger:** Event-based Webhook (`Event: Invoice Overdue`).
* **Input Data:** Overdue Invoice object.
* **Validation Rules:** Valid Invoice UUID, non-zero amount, ledger reference present.
* **Conditions:** Amount-based split check.
* **Decision Nodes:** 
  - `IF: Invoice Amount > ₹5,00,000` $\rightarrow$ Route to CFO.
  - `IF: Ledger Match Fails` $\rightarrow$ Route to Finance discrepancy queue.
* **Actions:** Updates invoice audit logs, sets status to `Audited`.
* **External Calls:** HTTP GET to `/finance/ledgers` and `/finance/invoices`.
* **Notifications:** Slack alert to Finance team, email billing update to client.
* **Human Approvals:** Wait for CFO approval webhook on large amounts.
* **Completion Rules:** State update committed to database.
* **Failure Rules:** Log execution error, alert DevOps on Slack, set state to `Audit_Failed`.
* **Retry Logic:** HTTP calls retried up to 3 times (exponential backoff).
* **Audit Requirements:** Write record to `/agents/decisions` log registry.

### Workflow 2: PO Auto-Provisioning (`wf-202`)
* **Business Goal:** Auto-draft Purchase Orders (POs) when stock thresholds breach reorder bounds.
* **Trigger:** Threshold-based stock alert (breached stock level event).
* **Input Data:** Inventory item metadata, stock count, vendor ID.
* **Validation Rules:** Valid Item UUID, count $\le$ threshold.
* **Conditions:** Preferred vendor exists with active contract pricing.
* **Decision Nodes:** 
  - `IF: Preferred Vendor Contract Active` $\rightarrow$ Draft PO.
  - `IF: No active contract` $\rightarrow$ Create RFQ draft.
* **Actions:** Calls `/procurement/rfqs` to draft RFQ or `/procurement/vendors` to compile details.
* **Notifications:** Send email notification to procurement lead.
* **Human Approvals:** PO values $> ₹1,00,000$ require manager approval before release.
* **Failure Rules:** Flag bottleneck to Slack if approval is pending $> 48$ hours.

---

## 3. Webhook Catalog

All webhooks accept `application/json` payloads and require a SHA-256 HMAC header verification.

| Webhook Name | Endpoint URL | Method | Auth | Associated Agent |
| :--- | :--- | :--- | :--- | :--- |
| **CRM Lead Ingest** | `https://n8n.domain.com/webhook/crm/lead-created` | `POST` | Signature | Lead Qualifier Agent |
| **Invoice Overdue** | `https://n8n.domain.com/webhook/finance/invoice-overdue` | `POST` | JWT Bearer | Finance Auditor Agent |
| **Stock Alert Ingest** | `https://n8n.domain.com/webhook/inventory/stock-alert` | `POST` | Bearer Token| Finance Auditor Agent |

### Request Schema (`CRM Lead Ingest`)
```json
{
  "lead_id": "uuid",
  "email": "string",
  "company_size": "integer",
  "request_message": "string"
}
```

---

## 4. WebSocket Catalog

Provides real-time interactive sockets for the front-end dashboard and the AI Copilot.

* **Channel Name:** `/ws/copilot`
  - **Purpose:** Handles stream communication between client UI and AI Agent.
  - **Publish Events:** `chat:message` (payload: `{ text: string, session_id: string }`).
  - **Subscribe Events:** `chat:reply` (payload: `{ text: string, stream_chunk: boolean }`).
* **Channel Name:** `/ws/alerts`
  - **Purpose:** Dispatches real-time audit discrepancy alerts.
  - **Publish Events:** `alert:discrepancy` (payload: `{ alertId: string, module: string, text: string }`).
  - **Consumers:** Front-end Command Center dashboard.

---

## 5. Tool Catalog

These tools run as HTTP Request Nodes within the n8n AI Agent Executor Node.

### Tool 1: CRM Deals Reader
* **Purpose:** Reads sales deals records.
* **Endpoint:** `GET http://api:3000/crm/deals`
* **Authentication:** Bearer Token.
* **Output Schema:** `{ deals: Array<{ id: string, name: string, stage: string, value: number }> }`.
* **Access Rules:** Allowed for: Lead Qualifier, Sales Closer.

### Tool 2: Ledger Auditor
* **Purpose:** Queries general ledgers for audit matching.
* **Endpoint:** `GET http://api:3000/finance/ledgers`
* **Authentication:** Bearer Token.
* **Output Schema:** `{ ledgers: Array<{ id: string, transactionId: string, amount: number, accountCode: string }> }`.
* **Access Rules:** Allowed for: Finance Auditor Agent.

### Tool 3: RFQ Creator
* **Purpose:** Creates a draft Request for Quote (RFQ) in procurement.
* **Endpoint:** `POST http://api:3000/procurement/rfqs`
* **Authentication:** Bearer Token.
* **Input Schema:** `{ itemId: string, targetQuantity: number }`.
* **Access Rules:** Allowed for: Finance Auditor Agent (escalating to procurement).

---

## 6. Memory Architecture

n8n uses the standard LangChain components built into n8n AI nodes.

* **Short-Term Memory:** 
  - **Storage:** Redis (Shared instance) via n8n's **Window Buffer Memory** node.
  - **Expiry:** 1 hour inactivity.
* **Long-Term / Knowledge Memory:**
  - **Storage:** PostgreSQL vector schema (`vector.embeddings`) via pgvector.
  - **Retrieval:** Cosine similarity query of embedded project records.
* **Update Logic:** Background sync scripts run at `00:00` daily, indexing new `/finance/ledgers` and `/crm/deals` updates.

---

## 7. Agent Communication Matrix

Defines how agent swarms coordinate using **n8n Multi-Agent** routers:

```
                  ┌──────────────────────┐
                  │   Coordinator Agent  │
                  └──────────┬───────────┘
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   ┌──────────────────┐              ┌──────────────────┐
   │Lead Qualifier Ag.│              │Sales Closer Agent│
   └──────────────────┘              └──────────────────┘
```

| Sender Agent | Receiver Agent | Message Type | Trigger Condition |
| :--- | :--- | :--- | :--- |
| **Coordinator Agent** | **Lead Qualifier Agent** | Query Task | New lead ingested |
| **Lead Qualifier Agent** | **Sales Closer Agent** | Event Transfer | Lead passes target metrics |
| **Sales Closer Agent** | **Coordinator Agent** | Escalation Alert | Deal discount requested $> 25\%$ |

---

## 8. Event Catalog

Core business events mapped to triggers:

1. **`Event: Lead Created`**
   - Source: CRM Webform
   - Payload: `{ leadId: UUID, clientName: string, requestMessage: string }`
2. **`Event: Invoice Overdue`**
   - Source: Finance Scheduler
   - Payload: `{ invoiceId: UUID, daysOverdue: number, ledgerId: UUID }`
3. **`Threshold: Stock Reorder`**
   - Source: Inventory Monitor
   - Payload: `{ itemId: UUID, currentStock: number, reorderThreshold: number }`

---

## 9. Approval Matrix

Authentication thresholds for manual verification routing:

| Operation | Trigger Condition | Approver Role | SLA Escalation Time |
| :--- | :--- | :--- | :--- |
| **Contract Discount** | Discount requested $> 15\%$ | Finance Manager | 24 Hours |
| **Contract Special Terms**| Discount requested $> 25\%$ | VP of Sales | 12 Hours |
| **Ledger Discrepancy Correction** | Ledger adjustment request $> ₹5,00,000$ | CFO | 48 Hours |

---

## 10. Complete n8n Node Mapping

### Workflow: Invoice Audit Approval (`wf-201`)

```
 [Webhook Trigger] ──► [HTTP: Get Invoice] ──► [HTTP: Get Ledgers] ──► [Code: Audit Match]
                                                                              │
                                                                       (Amount Check)
                                                                              ├─► [IF: > ₹5,00,000] ──► [CFO Approval Loop]
                                                                              │
                                                                              └─► [Slack Notification]
```

1. **Webhook Node:**
   - Path: `/webhook/finance/invoice-overdue`
   - Authentication: Signature verification.
2. **HTTP Request Node (`Get Invoice`):**
   - URL: `http://api:3000/finance/invoices`
   - Query: `invoiceId = {{$json.invoice_id}}`
3. **HTTP Request Node (`Get Ledgers`):**
   - URL: `http://api:3000/finance/ledgers`
4. **Code Node (`Audit Match`):**
   - Runs validation script matching invoice total with corresponding ledger details.
5. **IF Node (`Amount Check`):**
   - Checks if Invoice Amount is $> 500,000$.
6. **Wait Node (`CFO Approval Loop`):**
   - Halts execution, generates a unique confirmation token, and sends an approval email to the CFO.
7. **HTTP Request Node (`Update Invoice`):**
   - Submits audited confirmation updates to `/finance/invoices`.

---

## 11. Environment Variables

Variables required in n8n execution space:

* `N8N_ENCRYPTION_KEY`: Encryption secret for nodes credentials.
* `ERP_API_BASE_URL`: `http://api:3000` (internal service resolver).
* `FIREBASE_PROJECT_ID`: `sentinel-erp-auth-92831` (auth verification).
* `REDIS_HOST`: Redis instance for ephemeral Agent memory.
* `DATABASE_URL`: Postgres DB connection URI.

---

## 12. Deployment Requirements

* **Environment:** Docker Compose monorepo network context.
* **Network Rules:** n8n must run in the same virtual network as the NestJS backend (`apps/api`) to directly resolve services on `http://api:3000`.
* **Resources:** Minimum 2GB RAM allocated for n8n container, 0.5 CPU core.

---

## 13. Monitoring Requirements

* **Failed executions alerts:** Route to Slack channel `#ops-alerts` via n8n **Error Trigger** node.
* **Execution Metrics:** Read database execution logs using `/workflows/metrics` to flag bottlenecks.

---

## 14. Security Requirements

1. **HTTPS Enforced:** Public webhooks must be routed through an SSL reverse proxy (Nginx / Let's Encrypt).
2. **JWT Authorization:** Bearer header verified using Sentinel ERP token secret.
3. **Audit Trail:** Every decision made by AI Agent nodes must be pushed back to the `/agents/decisions` logging endpoint.

---

## 15. Production Readiness Checklist

- [ ] Webhook signatures (HMAC SHA-256) enabled.
- [ ] Redis caching enabled for agent chat history memory.
- [ ] Error trigger workflows active and routed to Slack.
- [ ] Database backup triggers active prior to workflow operations.
- [ ] SSL certificates verified and auto-renew config complete.
- [ ] Maximum execution limits and timeout thresholds defined (default: 300 seconds).
