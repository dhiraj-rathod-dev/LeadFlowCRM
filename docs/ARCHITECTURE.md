# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login    │  │Dashboard │  │  Leads   │  │ Pipeline │   │
│  │  Register │  │  Charts  │  │   CRUD   │  │  Kanban  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └──────────────┴──────────────┴──────────────┘        │
│                    React + Tailwind CSS                      │
│                         │  Axios HTTP                       │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Express.js                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │  Helmet  │  │  CORS    │  │  Rate Limiter    │   │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │  Users   │  │  Leads   │  │Dashboard │   │
│  │ Routes   │  │ Routes   │  │ Routes   │  │ Routes   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └──────────────┴──────────────┴──────────────┘        │
│                    Middleware Layer                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  JWT     │  │ Validate │  │  Error   │                  │
│  │  Auth    │  │ express- │  │ Handler  │                  │
│  │          │  │ validator│  │          │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                    Controllers Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │  User    │  │  Lead    │  │  Note    │   │
│  │  Ctrl    │  │  Ctrl    │  │  Ctrl    │  │  Ctrl    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                    Models Layer (Mongoose)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  User    │  │  Lead    │  │  Note    │  │ Activity │   │
│  │  Schema  │  │  Schema  │  │  Schema  │  │  Schema  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └──────────────┴──────────────┴──────────────┘        │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                               │
│                  MongoDB Atlas                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │  Leads   │  │  Notes   │  │Activities│   │
│  │Collection│  │Collection│  │Collection│  │Collection│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  Indexes: text search, status, assignedTo, createdAt       │
└─────────────────────────────────────────────────────────────┘

Authentication Flow:
────────────────────
Client → POST /api/auth/login → Server validates credentials
       → Returns JWT token → Client stores in localStorage
       → Subsequent requests include Bearer token
       → Middleware verifies JWT → Grants access

Authorization Flow:
────────────────────
Admin: Full access (CRUD users, leads, settings)
Member: Limited access (own leads, status updates, notes)
```
