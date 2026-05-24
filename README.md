# Sentinel Logger

A centralized logging platform (MERN stack Monorepo) that allows application developers to register, manage application profiles, view analytical dashboards of runtime logs, and ingest logs securely via an API key.

## Tech Stack

- **Backend:** Node.js, Express, Mongoose, MongoDB
- **Frontend:** React.js (Vite), TypeScript, Tailwind CSS, Shadcn UI
- **Architecture:** Monorepo

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sentinel-logger
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Setup Environment Variables

Create a `.env` file in the `/backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sentinel-logger
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 4. Run Frontend & Backend Together

#### **Option A: Run Both in Separate Terminals (Recommended)**

**Terminal 1 - Backend:**

```bash
cd backend
npx nodemon server.js
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

#### **Option B: Run Both with npm-run-all (Single Command)**

Install `npm-run-all` in the root:

```bash
npm install -D npm-run-all
```

Create a `package.json` in the root (if not exists):

```json
{
  "name": "sentinel-logger",
  "version": "1.0.0",
  "scripts": {
    "dev": "npm-run-all --parallel backend frontend",
    "backend": "cd backend && npx nodemon server.js",
    "frontend": "cd frontend && npm run dev"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5"
  }
}
```

Then run:

```bash
npm run dev
```

## Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Project Structure

```
sentinel-logger/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middlewares/     # Auth & error handling
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API services
│   │   ├── contexts/    # React contexts
│   │   └── lib/         # Utilities & config
│   ├── vite.config.ts   # Vite configuration
│   └── package.json
└── README.md
```

## Features

✅ User registration & authentication (JWT)
✅ Application management
✅ Log ingestion via API key
✅ Real-time log viewing dashboard
✅ Log filtering by level and message
✅ Pagination & sorting
✅ Responsive UI

## API Endpoints

### Authentication

- `POST /api/users/register` - Register new developer
- `POST /api/users/login` - Login developer
- `POST /api/users/logout` - Logout (protected)
- `GET /api/users/me` - Get current user (protected)

### Applications

- `GET /api/applications` - List all apps (protected)
- `POST /api/applications` - Create new app (protected)
- `DELETE /api/applications/:name` - Delete app (protected)

### Logs

- `GET /api/applications/:name/logs` - View logs (protected)
- `POST /api/applications/:name/logs` - Ingest logs (API key required)
- `GET /api/applications/:name/logs/stats` - Get log statistics

## Testing with curl

Ingest a log via API:

```bash
curl -X POST http://localhost:5000/api/applications/my-app/logs \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"message":"Test log","level":"INFO"}'
```

## Troubleshooting

**Port already in use?**

- Backend runs on port 5000 (change `PORT` in `.env`)
- Frontend runs on port 5173 (change in `frontend/vite.config.ts`)

**MongoDB connection error?**

- Ensure MongoDB is running: `mongod` (local) or check your cloud connection string

**CORS errors?**

- Frontend runs on `http://localhost:5173`
- Backend CORS is configured for this origin in `server.js`

## License

MIT
