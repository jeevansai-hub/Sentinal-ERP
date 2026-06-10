# ADR-003: JWT + httpOnly Refresh Token Authentication Strategy

## Status
Accepted

## Date
2026-06-09

## Context

ERP7 needs a secure, stateless-friendly authentication strategy that:
- Works with Next.js SSR and CSR
- Supports session invalidation
- Is resistant to XSS and CSRF attacks
- Supports future OAuth2 / SSO extension

## Decision

**Short-lived JWT access token (15 min) + httpOnly refresh token (7 days)**

- Access token: stored in memory (JavaScript variable, never localStorage)
- Refresh token: stored in httpOnly, Secure, SameSite=Strict cookie
- Token refresh: automatic via refresh endpoint before expiry
- Invalidation: refresh tokens tracked in Redis (blacklist on logout)

## Consequences

**Positive:**
- Access token in memory = XSS cannot steal it
- Refresh token in httpOnly cookie = JavaScript cannot access it
- Stateless access token reduces DB lookups
- Redis blacklist enables immediate logout/invalidation

**Negative:**
- Memory-only access token lost on page refresh (handled by silent refresh)
- Redis dependency for invalidation (acceptable — Redis already used for caching)

## Alternatives Considered

**localStorage JWT**  
Rejected: Vulnerable to XSS token theft.

**Session-only (server-side sessions)**  
Rejected: Requires sticky sessions or shared session store for horizontal scaling; less flexible.

**Cookie-only session**  
Partially adopted: Refresh token uses httpOnly cookie pattern.
