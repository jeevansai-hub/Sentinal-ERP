# ADR-001: Evolutionary Modular Monolith Architecture

## Status
Accepted

## Date
2026-06-09

## Context

ERP7 is a full-suite ERP system covering HR, Finance, Inventory, CRM, Procurement, Manufacturing, Projects, and Analytics. 

Key constraints:
- Start small (1–3 developers initially)
- Architect to scale (10+ developers, 500+ users eventually)
- 8 ERP domains with distinct bounded contexts
- Strong data isolation requirements (financial, HR data)

Two options were evaluated:
1. Microservices from day one
2. Modular Monolith with extraction path

## Decision

Start with a **Modular Monolith** using strict domain boundaries, evolving to **Microservices** when scale demands it.

Each ERP domain is a bounded context with:
- Independent folder structure
- Its own PostgreSQL schema
- Its own public contract (`index.ts`)
- No internal coupling to other modules

## Consequences

**Positive:**
- Simpler local development (single process)
- Easier refactoring in early stages
- No distributed system complexity prematurely
- Clean extraction path to microservices when needed
- Faster time-to-market for initial modules

**Negative:**
- All modules share the same deployment lifecycle initially
- Runtime isolation requires discipline (enforced via linting rules)

## Alternatives Considered

**Microservices from Day One**  
Rejected: Premature complexity, operational overhead exceeds team size benefit at initial scale.

**Traditional MVC Monolith**  
Rejected: No clear extraction path, tight coupling risk, doesn't scale with team size.
