# LeadFlow CRM

> Full Stack Development Qualification Project for **Digital Heroes**

A production-ready Lead Management CRM that enables organizations to collect, organize, assign, and manage sales leads efficiently.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Recharts, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt.js |
| Testing | Jest, Supertest |

## Features

- **Authentication** — Register, Login, JWT-protected routes, Password hashing
- **Role-Based Access** — Admin & Member roles with different permissions
- **Lead Management** — Full CRUD, Status tracking, Priority, Source management
- **Pipeline View** — Drag-and-drop Kanban board
- **Dashboard** — Charts, stats, team performance, revenue tracking
- **Notes** — Add, edit, delete notes on any lead
- **Activity Log** — Every action is tracked with timestamps
- **Search & Filters** — Global search, status/priority/source filters, sorting
- **Pagination** — Server-side pagination (10/25/50/100)
- **Dark Mode** — Toggle between light and dark themes
- **Responsive** — Works on desktop, tablet, and mobile
- **User Management** — Admin can create, edit, disable, delete users

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd server
npm install
cp .env.example .env  # Configure your MongoDB URI and JWT secret
node seed.js           # Seed demo data
npm run dev            # Start dev server on port 5000
```

### Frontend Setup

```bash
cd client
npm install
npm start              # Start React dev server on port 3000
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@leadflow.com | admin123 |
| Member | member@leadflow.com | member123 |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/leads | List leads (with filters, search, pagination) |
| POST | /api/leads | Create lead |
| GET | /api/leads/:id | Get lead detail with notes & activities |
| PUT | /api/leads/:id | Update lead |
| DELETE | /api/leads/:id | Delete lead (Admin) |
| PATCH | /api/leads/status | Update status |
| PATCH | /api/leads/assign | Assign lead (Admin) |
| PATCH | /api/leads/:id/archive | Archive/restore lead |
| GET | /api/leads/pipeline | Pipeline stats |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notes | Get notes (filter by leadId) |
| POST | /api/notes | Add note |
| PUT | /api/notes/:id | Update note |
| DELETE | /api/notes/:id | Delete note |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/activities | Activity log |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard | Stats, charts, performance data |

## Folder Structure

```
LeadFlowCRM/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Layout, Sidebar, TopNav
│   │   ├── context/           # AuthContext
│   │   ├── pages/             # Dashboard, Leads, Pipeline, etc.
│   │   ├── services/          # Axios API service
│   │   └── utils/             # Helpers, formatters
│   └── package.json
├── server/                    # Express Backend
│   ├── config/                # Database config
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth, error handler
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routes
│   ├── validators/            # Input validation
│   ├── tests/                 # API tests
│   ├── seed.js                # Database seeder
│   └── server.js              # Entry point
├── docs/                      # Documentation
│   └── swagger.yaml
└── README.md
```

## Testing

```bash
cd server
npm test
```

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import repository in Vercel
3. Set build command: `npm run build`
4. Set environment variable: `REACT_APP_API_URL=<your-backend-url>/api`

### Backend (Render)
1. Push to GitHub
2. Create a new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`

### Database (MongoDB Atlas)
1. Create a free cluster at mongodb.com
2. Create a database user
3. Whitelist your IP
4. Get the connection string

## Security

- Helmet for HTTP headers
- Rate limiting (100 req/15min)
- CORS configuration
- bcrypt password hashing (12 rounds)
- JWT authentication
- Input validation (express-validator)
- MongoDB injection protection
- XSS prevention

## Built for Digital Heroes Training Task

[digitalheroesco.com](https://digitalheroesco.com)
