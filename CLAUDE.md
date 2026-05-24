# CLAUDE.md - Central Logging System & Dashboard

## Project Overview

An all-in-one centralized logging platform (MERN stack Monorepo) that allows application developers to register, manage application profiles, view analytical dashboards of runtime logs, and ingest logs securely via an API key.

## Project Architecture & Directory Map

This project is structured as a Monorepo. Do not mix frontend and backend dependencies.

- `/backend` - Node.js, Express, Mongoose, MongoDB. (Handles API, business logic, Auth, and log ingestion).
- `/frontend` - React.js (Vite), Tailwind CSS, Shadcn UI. (The Developer Dashboard).
- `/sdk` - (Optional placeholder folder if building Requirement 3 locally) Micro-package for the Node client SDK.

## Core Development Commands

- **Initialize Monorepo:** Run `npm install` inside `/backend` and `/frontend` separately.
- **Run Backend:** `cd backend && npx nodemon server.js` (Runs on Port 5000)
- **Run Frontend:** `cd frontend && npm run dev` (Runs on Port 5173)

## Database Schema & Relations Guidance

- **Developer:** Contains `username`, `email`, `password` (hashed via bcrypt), and a unique `apiKey` (UUIDv4 or crypto-generated).
- **Application:** Contains `name` (unique, lowercase, no whitespaces via Mongoose pre-save/validation), `createdBy` (ObjectId ref to Developer), and `createdAt`.
- **Log:** Contains `message`, `level` (enum: ['INFO', 'WARN', 'ERROR']), `count` (defaults to 1, increments on duplicate messages), `applicationId` (ObjectId ref to Application), `createdAt`, and `updatedAt`.

## Strict Coding Conventions

### Backend (Node/Express/Mongoose)

- Use modern ES Modules (`import`/`export`) instead of CommonJS (`require`).
- **Log Ingestion Logic:** When a POST request hits `/api/applications/:name/logs`, check if a log with the exact same `message` and `level` already exists for that application. If it does, **increment the `count` and update `updatedAt`**. Do not blindly create duplicate documents.
- **Security:** Protect all `/api/applications` and `/api/users/logout` routes using a JWT authentication middleware verifying the Developer.
- **SDK Ingestion Security:** The log posting route must validate that the provided `apiKey` in the headers matches the Developer who actually owns the target Application.
- Use explicit Mongoose validation for the Application name (no whitespaces allowed).

### Frontend (React + Vite + Shadcn UI)

- Use functional components with named exports.
- Prioritize structural code, exact math/sorting logic, and clean state management over open-ended styling cycles.
- Implement pagination (limit 10), sorting (by recent or highest count), and filtering (by level or message query) by passing them as URL query parameters to the backend fetching services.
- **React 19 Standards:** Optimize forms using the new `action` attribute and the `useActionState` / `useFormStatus` hooks for asynchronous submission and pending states.
- Avoid legacy `useEffect` data-fetching loops where possible; handle async states cleanly.
- Prioritize React 19 native features (such as `useActionState`, `useFormStatus`, and the `use` hook) over legacy React 18 patterns, provided they improve state management performance, form handling, and code readability.

## Strict Rules & AI Guardrails (Do Not Break)

- **CRITICAL:** Do not generate sloppy, single-file spaghetti code. Keep routing (`/routes`), database schemas (`/models`), and request handlers (`/controllers`) cleanly separated in the backend.
- DO NOT install external npm packages without asking for confirmation.
- NEVER write raw database queries without try/catch blocks and proper async/await error-handling middleware.
- Keep the UI highly professional, utilizing clean dashboard grid layouts suited for technical metrics and charts.
