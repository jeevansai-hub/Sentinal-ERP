# Contributing to ERP7

## Before You Write Any Code

1. Read [`RULES.md`](./RULES.md) — mandatory for all contributors
2. Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) — understand the structure
3. Read the relevant module `README.md` in `modules/<domain>/`

## Branch Naming

```
feature/<domain>/<short-description>   → feature/hr/employee-onboarding
fix/<domain>/<short-description>       → fix/finance/invoice-calculation
chore/<description>                    → chore/update-dependencies
docs/<description>                     → docs/hr-module-readme
```

## Commit Format (Conventional Commits)

```
<type>(<domain>): <short description>

feat(hr): add employee onboarding workflow
fix(finance): correct invoice tax rounding
docs(inventory): update stock adjustment README
chore(deps): update zod to v3.22
test(crm): add lead conversion integration test
```

## Pull Request Checklist

- [ ] RULES.md checklist completed
- [ ] Tests added for new functionality
- [ ] No existing tests broken
- [ ] Module README updated if needed
- [ ] No secrets or credentials in code
- [ ] API changes reflected in OpenAPI spec
- [ ] Architecture Decision Record (ADR) created if needed

## Module Boundary Rules

- Import from another module ONLY via its `index.ts`
- Cross-module communication via domain events only
- Never write to another module's database schema
