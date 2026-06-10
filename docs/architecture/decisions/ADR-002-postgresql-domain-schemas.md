# ADR-002: PostgreSQL Per-Domain Schema Strategy

## Status
Accepted

## Date
2026-06-09

## Context

ERP7 has 8 distinct business domains. Each domain owns its own data. 
Key question: how do we enforce data ownership and enable future microservice extraction?

Options:
1. Single shared schema (all tables in `public`)
2. Per-domain PostgreSQL schemas (`hr.*`, `finance.*`, etc.)
3. Separate databases per domain from day one

## Decision

Use **per-domain PostgreSQL schemas** within a single database instance.

```sql
CREATE SCHEMA hr;
CREATE SCHEMA finance;
CREATE SCHEMA inventory;
CREATE SCHEMA crm;
CREATE SCHEMA procurement;
CREATE SCHEMA manufacturing;
CREATE SCHEMA projects;
CREATE SCHEMA analytics;
CREATE SCHEMA auth;
CREATE SCHEMA audit;
CREATE SCHEMA shared;
```

Rules:
- Each module queries ONLY its own schema
- Cross-domain read access via `shared` schema views only
- No direct foreign keys across domain schemas (reference via IDs)

## Consequences

**Positive:**
- Clear data ownership enforced at DB level
- Schema per domain mirrors bounded context model
- Clean extraction path: promote schema to separate DB when extracting microservice
- pg_dump per schema enables domain-level backups

**Negative:**
- Slightly more complex migration management
- No enforced FK constraints across domains (compensated by application-level integrity)

## Alternatives Considered

**Single shared schema**  
Rejected: No data ownership, tables from different domains mix freely, no extraction path.

**Separate databases from day one**  
Rejected: Premature operational complexity, cross-domain queries require distributed joins or data duplication.
