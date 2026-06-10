# Module README Template

# [Domain Name] Module

## Purpose
Brief description of what this domain handles and its business responsibility.

## Business Boundaries
- **Owns:** List of entities and data this module is responsible for
- **Does NOT own:** Data from other modules it may read (via shared views)

## Public Contract
This module exposes the following via its `index.ts`:
- `[InterfaceName]` — description
- `[DomainEventName]` — emitted when [condition]

## Domain Events
| Event | Trigger | Consumers |
|---|---|---|
| `[EventName]` | When [action happens] | [Other modules] |

## Dependencies
| Dependency | Type | Reason |
|---|---|---|
| `auth` module | Read | User identity for access control |

## API Routes (summary)
```
GET    /api/v1/[domain]/[resource]
POST   /api/v1/[domain]/[resource]
GET    /api/v1/[domain]/[resource]/:id
PUT    /api/v1/[domain]/[resource]/:id
DELETE /api/v1/[domain]/[resource]/:id
```

## Database Schema
PostgreSQL schema: `[domain]`  
Key tables: list primary tables

## Security & Permissions
| Permission | Who Can Use |
|---|---|
| `[domain]:[resource]:read` | All authenticated users |
| `[domain]:[resource]:create` | [Role] |
| `[domain]:[resource]:delete` | [Role] |

## Data Flow
Brief description or diagram of data flow through the layers.

## Extension Points
How to add new features to this module without breaking existing functionality.

## Known Limitations
Any known constraints or planned improvements.

## Module Lead
Owner: [Team/Person]
