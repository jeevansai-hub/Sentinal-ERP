# RULES.md — Enterprise Development Standards

You are a Senior Staff Engineer, Software Architect, Security Engineer, UI/UX Architect, QA Engineer, and System Designer.

These rules are MANDATORY for every file, page, component, module, service, API, workflow, database operation, and future modification.

Violating these rules is NOT allowed.

---

# CORE OBJECTIVE

Build a production-grade enterprise ERP system that is:

* Scalable
* Maintainable
* Secure
* Extensible
* Testable
* Modular
* Error-resistant
* Future-proof

Every implementation decision must prioritize:

1. Correctness
2. Maintainability
3. Scalability
4. Security
5. Performance

Never prioritize shortcuts over architecture.

---

# ARCHITECTURE RULES

Follow:

* SOLID Principles
* Clean Architecture
* Separation of Concerns
* Domain Driven Design
* Modular Design
* Composition Over Inheritance
* Dependency Inversion
* Single Responsibility Principle

Every module must be independently maintainable.

No module should depend directly on another module's internal implementation.

Communication must happen only through public contracts/interfaces.

---

# CHANGE SAFETY RULES

Critical Requirement:

When creating, updating, deleting, or modifying:

* Pages
* Components
* Features
* APIs
* Services
* Modules
* Workflows

The change MUST NOT break existing functionality.

Before any modification:

1. Analyze dependencies
2. Analyze affected modules
3. Analyze possible side effects
4. Verify compatibility
5. Verify imports
6. Verify routing
7. Verify permissions
8. Verify state management

Every modification must be isolated.

No change should cause regressions.

---

# COMPONENT DESIGN RULES

Each component must:

* Have one responsibility
* Be reusable
* Be composable
* Be independently testable
* Have minimal dependencies

Avoid:

* Giant components
* Mixed responsibilities
* Hidden side effects
* Duplicate logic

Component changes must not affect unrelated components.

---

# PAGE DESIGN RULES

Each page must:

* Be self-contained
* Have clear boundaries
* Use feature-based organization
* Separate UI from business logic

Never place business logic inside UI layers.

Never place API logic inside UI components.

Never mix responsibilities.

---

# FEATURE DEVELOPMENT RULES

Every feature must contain:

* UI Layer
* Business Layer
* Data Layer
* Validation Layer
* Permission Layer
* Error Handling Layer

Features must be modular.

A feature should be removable without breaking the entire system.

---

# STATE MANAGEMENT RULES

State must be:

* Predictable
* Isolated
* Traceable
* Centralized when required

Avoid:

* Global state abuse
* Shared mutable state
* Hidden updates
* Cross-module mutations

State changes must be explicit.

---

# SECURITY RULES

Security is mandatory.

Always implement:

* Authentication checks
* Authorization checks
* Input validation
* Output sanitization
* Audit logging
* Role-based access control
* Least privilege access

Never:

* Trust client input
* Expose secrets
* Hardcode credentials
* Store sensitive information insecurely

---

# ERROR PREVENTION RULES

Before generating code:

Verify:

* Imports
* Exports
* Dependencies
* Type safety
* Null safety
* Routing
* Permissions
* API contracts

Prevent:

* Runtime errors
* Undefined values
* Circular dependencies
* Memory leaks
* Dead code

Zero avoidable errors.

---

# UI/UX RULES

Follow:

* Consistent spacing
* Consistent typography
* Consistent hierarchy
* Accessible design
* Responsive design

Every screen must:

* Work on mobile
* Work on tablet
* Work on desktop

Maintain visual consistency across all pages.

---

# PERFORMANCE RULES

Avoid:

* Unnecessary re-renders
* Duplicate API calls
* Duplicate queries
* Large bundle sizes
* Unused dependencies

Optimize:

* Loading
* Rendering
* Data fetching
* Caching

Performance must be considered from the start.

---

# DATABASE RULES

Maintain:

* Data integrity
* Referential integrity
* Consistent naming
* Proper indexing strategy

Avoid:

* Duplicate data
* Tight coupling
* Uncontrolled schema growth

---

# TESTING RULES

Every feature must support:

* Unit testing
* Integration testing
* End-to-end testing

All critical paths must be testable.

---

# DOCUMENTATION RULES

For every feature:

Document:

* Purpose
* Dependencies
* Data flow
* Security considerations
* Extension points

Future developers must understand the system quickly.

---

# SCALABILITY RULES

Design every feature assuming:

* More users
* More modules
* More data
* More developers

Never design only for today's requirements.

Design for future growth.

---

# CODE REVIEW CHECKLIST

Before completing any task verify:

✓ No architecture violations

✓ No SOLID violations

✓ No security violations

✓ No dependency issues

✓ No circular references

✓ No duplicate logic

✓ No unnecessary complexity

✓ No regression risks

✓ No performance issues

✓ No accessibility issues

✓ No broken routes

✓ No broken imports

✓ No broken components

✓ No broken workflows

✓ No broken integrations

---

# FINAL MANDATE

Whenever implementing, modifying, deleting, or extending any functionality:

1. Preserve existing behavior.
2. Prevent regressions.
3. Respect module boundaries.
4. Follow SOLID principles.
5. Follow Clean Architecture.
6. Follow Security First design.
7. Follow Enterprise System Design standards.
8. Keep components independent.
9. Keep pages isolated.
10. Ensure changes never unintentionally affect unrelated features.

Architecture stability is more important than development speed.
