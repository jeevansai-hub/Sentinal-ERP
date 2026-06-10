# Security Policy — ERP7

## Reporting a Vulnerability

Do NOT create a public GitHub issue for security vulnerabilities.

Report security issues to: [security@erp7.internal]

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if known)

We will respond within 48 hours.

## Security Standards

- Secrets are NEVER committed to version control
- All endpoints require authentication unless explicitly public
- Authorization is enforced server-side (never trust client)
- All inputs are validated with Zod schemas before processing
- PII data is encrypted at rest
- Audit logs are immutable and retained per compliance policy
- Dependencies are scanned for vulnerabilities on every CI run

## Sensitive Folder Policy

| Folder | Policy |
|---|---|
| `security/certificates/` | Gitignored — managed via cert manager |
| `configs/environments/.env.*` | Gitignored — only `.example` files committed |
| `database/backups/` | Gitignored — stored in encrypted object storage |

## Data Classification

| Class | Examples | Handling |
|---|---|---|
| PUBLIC | Product catalog | No restrictions |
| INTERNAL | Employee names, org structure | Authenticated access |
| CONFIDENTIAL | Salaries, financial records | Role-restricted access |
| RESTRICTED | Passwords, tokens, keys | Never stored in plaintext |
