# Installation Guide

## Prerequisites

- **Node.js** v16 or higher — [Download](https://nodejs.org/)
- **MongoDB** — [MongoDB Atlas](https://cloud.mongodb.com/) (free) or local installation
- **Git** — [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/LeadFlowCRM.git
cd LeadFlowCRM
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leadflow_crm
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Seed Database
```bash
node seed.js
```

### 4. Start Backend Server
```bash
npm run dev
```
Server runs at `http://localhost:5000`

### 5. Frontend Setup
```bash
cd ../client
npm install
npm start
```
Frontend runs at `http://localhost:3000`

## Deployment Guide

### Frontend — Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select the repository
4. Configure:
   - Framework: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
6. Deploy

### Backend — Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repository
3. Configure:
   - Name: `leadflow-crm-api`
   - Runtime: Node
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node server.js`
4. Add Environment Variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a strong random string
   - `JWT_EXPIRE` = 7d
   - `NODE_ENV` = production
   - `CORS_ORIGIN` = your Vercel frontend URL
5. Deploy

### Database — MongoDB Atlas

1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Database Access → Add new database user
4. Network Access → Add IP address (0.0.0.0/0 for all)
5. Deployment → Connect → Connect your application
6. Copy the connection string and add to your `.env`

## Running Tests

```bash
cd server
npm test
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/leadflow_crm |
| JWT_SECRET | Secret key for JWT signing | — |
| JWT_EXPIRE | Token expiry time | 7d |
| NODE_ENV | Environment mode | development |
| CORS_ORIGIN | Allowed frontend URL | http://localhost:3000 |
| REACT_APP_API_URL | Backend API URL (frontend) | http://localhost:5000/api |
