# ERP7 — Architecture Quick Reference

**Stack:** Next.js · Node.js (TypeScript) · PostgreSQL  
**Pattern:** Modular Monolith → Microservices (Evolutionary)

## Key Principles
- Clean Architecture (Domain → Application → Presentation)
- Domain-Driven Design (bounded contexts = ERP modules)
- Modules communicate via domain events or public contracts only
- Every module exports ONLY via its `index.ts`
- Security enforced server-side at every endpoint

## Module Structure (applies to every domain)
```
modules/<domain>/
├── presentation/    # HTTP controllers, DTOs, routes
├── application/     # Use cases, command/query handlers
├── domain/          # Entities, value objects, domain events
├── infrastructure/  # Repository implementations, adapters
├── validators/      # Input validation (Zod)
├── permissions/     # RBAC definitions
└── index.ts         # ← ONLY public export point
```

## Layer Dependency Rules
```
Presentation → Application → Domain ← Infrastructure
                                ↑
                           (interfaces only)
```

## Database
- PostgreSQL with per-domain schemas (hr, finance, inventory…)
- Cross-schema access via `shared` views only
- All changes via versioned migrations (never manual edits)

## Security
- JWT (short-lived) + httpOnly refresh cookie
- Server-side RBAC guard on every endpoint
- Zod validation before Application Layer
- Audit log for all state changes
- Secrets via Secret Manager only (never in files)

## See full blueprint: ERP7_Architecture.md (artifact)
