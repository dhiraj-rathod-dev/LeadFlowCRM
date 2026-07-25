# 🚀 LeadFlow CRM

> A Full Stack Lead Management CRM built for the **Digital Heroes Full Stack Development Qualification Project**.

🌐 **Live Demo:** https://lead-flow-crm-amber.vercel.app/login

---

# 📌 Overview

LeadFlow CRM is a modern Lead Management System that helps organizations collect, organize, assign, and manage sales leads efficiently.

The application includes secure authentication, role-based access control, lead tracking, dashboards, Kanban pipeline management, notes, activity logs, analytics, and responsive UI.

---

# 🌐 Live Demo

### Frontend

🔗 https://lead-flow-crm-amber.vercel.app/login

### Backend API

🔗 https://leadflowcrm-23l8.onrender.com/

---
# 🏗 System Design

## Overall System Architecture

This diagram illustrates the complete application architecture including the React frontend, Express.js backend, middleware, controllers, Mongoose models, MongoDB Atlas database, authentication flow, and authorization process.

<p align="center">
  <img src="./docs/System architecture and flow diagram.png"
       alt="LeadFlow CRM System Architecture"
       width="100%">
</p>

---

## Database Schema

The database schema below shows the relationships between Users, Leads, Notes, and Activities collections along with indexes and lead lifecycle.

<p align="center">
  <img src="./docs/Lead management system database schema.png"
       alt="LeadFlow CRM Database Schema"
       width="100%">
</p>

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes

---

## 👥 User Management (Admin)

- Create Users
- Edit Users
- Delete Users
- Disable Users
- Assign Roles
- Admin & Member Access Control

---

## 📊 Dashboard

- Total Leads
- Revenue Overview
- Lead Status Analytics
- Team Performance
- Monthly Growth
- Interactive Charts using Recharts

---

## 📋 Lead Management

- Create Lead
- Edit Lead
- Delete Lead
- Archive / Restore Lead
- Assign Lead
- Status Tracking
- Priority Management
- Source Management
- Budget Tracking

---

## 📌 Pipeline

- Drag & Drop Kanban Board

Stages include:

- New
- Contacted
- Qualified
- Proposal
- Won
- Lost

---

## 📝 Notes

- Add Notes
- Edit Notes
- Delete Notes
- Notes linked to Leads

---

## 📜 Activity Log

Automatically records:

- Login
- Lead Creation
- Lead Update
- Assignment
- Status Changes
- Note Activities

---

## 🔍 Search & Filters

- Global Search
- Filter by Status
- Filter by Priority
- Filter by Source
- Sorting
- Pagination

---

## 🌙 UI Features

- Dark Mode
- Fully Responsive
- Mobile Friendly
- Clean Dashboard
- Modern Design

---

# 🛠 Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React.js |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT + bcrypt |
| Testing | Jest + Supertest |

---

# 📂 Project Structure

```
LeadFlowCRM
│
├── client
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── utils
│   │   └── App.js
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── validators
│   ├── tests
│   ├── seed.js
│   └── server.js
│
├── docs
│   └── swagger.yaml
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/LeadFlowCRM.git

cd LeadFlowCRM
```

---

# Backend Setup

```bash
cd server

npm install
```

Create a `.env` file

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CORS_ORIGIN=http://localhost:3000
```

Seed Demo Data

```bash
node seed.js
```

Run Backend

```bash
npm run dev
```

Server runs on

```
http://localhost:5000
```

---

# Frontend Setup

```bash
cd client

npm install

npm start
```

Frontend runs on

```
http://localhost:3000
```

---

# 👤 Demo Credentials

## Admin

Email

```
admin@leadflow.com
```

Password

```
admin123
```

---

## Member

Email

```
member@leadflow.com
```

Password

```
member123
```

---

# 📡 REST API

## Authentication

| Method | Endpoint |
|----------|------------------------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |

---

## Users

| Method | Endpoint |
|----------|----------------|
| GET | /api/users |
| POST | /api/users |
| PUT | /api/users/:id |
| DELETE | /api/users/:id |

---

## Leads

| Method | Endpoint |
|----------|----------------------------|
| GET | /api/leads |
| POST | /api/leads |
| GET | /api/leads/:id |
| PUT | /api/leads/:id |
| DELETE | /api/leads/:id |
| PATCH | /api/leads/status |
| PATCH | /api/leads/assign |
| PATCH | /api/leads/:id/archive |
| GET | /api/leads/pipeline |

---

## Notes

| Method | Endpoint |
|----------|----------------|
| GET | /api/notes |
| POST | /api/notes |
| PUT | /api/notes/:id |
| DELETE | /api/notes/:id |

---

## Dashboard

| Method | Endpoint |
|----------|----------------|
| GET | /api/dashboard |

---

## Activities

| Method | Endpoint |
|----------|----------------|
| GET | /api/activities |

---

# 🧪 Testing

Run API Tests

```bash
cd server

npm test
```

Testing Frameworks

- Jest
- Supertest

---

# 🚀 Deployment

## Frontend

**Vercel**

https://lead-flow-crm-amber.vercel.app/login

---

## Backend

Render

Environment Variables

```env
MONGODB_URI=

JWT_SECRET=

CORS_ORIGIN=
```

---

## Database

MongoDB Atlas

- Free M0 Cluster
- Database User
- Network Access
- Connection String

---

# 🔒 Security Features

- JWT Authentication
- bcrypt Password Hashing
- Helmet Security Headers
- Express Rate Limiter
- CORS Protection
- MongoDB Injection Protection
- XSS Protection
- Input Validation
- Secure REST APIs

---

# 📈 Future Enhancements

- Email Notifications
- File Uploads
- CSV Import & Export
- Lead Assignment Automation
- AI Lead Scoring
- Calendar Integration
- Google OAuth
- Slack Notifications
- Real-time Updates (Socket.io)

---

# 👨‍💻 Developed By

**Dhiraj Kishan Rathod**

Computer Engineering Student

MIT Academy of Engineering (MITAOE), Pune

GitHub: https://github.com/dhiraj-rathod-dev

LinkedIn: https://www.linkedin.com/in/dhiraj-rathod-81a619280/

---

# 📄 License

This project was developed as part of the **Digital Heroes Full Stack Development Qualification Project**.

---

## ⭐ Live Application

### 🌐 https://lead-flow-crm-amber.vercel.app/login

If you like this project, don't forget to ⭐ the repository.
