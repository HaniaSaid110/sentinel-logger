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
├── sdk/
    ├──index.js
    ├──test.js
    └──package.json
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

## Node.js SDK & Smoke Testing

Sentinel Logger includes an official lightweight Node.js SDK in the [sdk](./sdk) directory.

### 1. Set Up the SDK

To test the SDK locally or prepare it for monorepo development:

```bash
cd sdk
npm install
```

### 2. Run the Smoke Test

We have provided a built-in smoke test script (`sdk/test.js`) to verify log ingestion via the SDK.

**Step A:** Make sure your backend server is running and you have registered a developer account and created an application (e.g., `test-app`) in the dashboard (http://localhost:5173). Copy your **API Key**.

**Step B:** Run the test script using environment variables:

```bash
# On macOS / Linux
SENTINEL_API_KEY="YOUR_API_KEY" SENTINEL_APP_NAME="test-app" npm test

# On Windows (PowerShell)
$env:SENTINEL_API_KEY="YOUR_API_KEY"; $env:SENTINEL_APP_NAME="test-app"; npm test
```

_Alternatively, you can open [sdk/test.js](file:///d:/ITI/node.js/day%205/sentinel-logger/sdk/test.js) and directly paste your `API_KEY` and `APP_NAME` in the file, then run `npm test`._

### 3. Verify in Dashboard

Check the Sentinel Logger Dashboard (http://localhost:5173). You should see your newly ingested logs (under `test-app`) with their counts, levels, and levels breakdown charts updating in real-time!

## Testing with curl

Alternatively, you can ingest a log directly via a curl request:

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
