# Duluwa Art Gallery

Original watercolours & sketches by Kobit Gurung — an art gallery e-commerce site.

This repository is a **React + Django** application, split into two packages:

```
duluwa-art/
├── client/   # React 19 SPA — Vite + React Router (the UI)
├── backend/  # Django REST API — PostgreSQL
└── package.json   # orchestration scripts (run both at once)
```

It was migrated from a Next.js full-stack app: server components / server actions
became REST endpoints under `/api/*`, and the App Router became client-side routes.

## Prerequisites

- Node.js 20+
- Python 3.10+
- A PostgreSQL database

## Setup

```bash
# 1. Install frontend and Django dependencies
npm run install:all

# 2. Configure environment
#    backend/.env — fill in DATABASE_URL and Django settings
#    client/.env  — copy from client/.env.example (VITE_GOOGLE_CLIENT_ID is optional)

# 3. Apply Django migrations
npm run db:migrate

# 4. Run client + Django together (Django :8000, client :5173)
npm run dev
```

Then open http://localhost:5173.

In development, the Vite dev server proxies `/api` → `http://localhost:8000`, so the
browser stays single-origin and the session cookie works without CORS juggling.

## Environment variables

**backend/.env** (see `backend/.env.example`):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection used by Django |
| `SECRET_KEY` | Django signing key |
| `GOOGLE_CLIENT_ID` | Verifies Google sign-in credentials |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Transactional email (orders, commissions) |
| `BLOB_READ_WRITE_TOKEN` | Optional Vercel Blob for uploads (falls back to base64) |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |

**client/.env** (see `client/.env.example`):

| Variable | Purpose |
| --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | Google Sign-In client id (browser) |
| `VITE_API_URL` | Only if hosting the API on a different origin than the client |

## Scripts (run from the repo root)

| Script | Description |
| --- | --- |
| `npm run dev` | Start the API and the React dev server together |
| `npm run build` | Build the client to `client/dist` |
| `npm start` | Run Django on port 8000 |
| `npm run typecheck` | Type-check the client |
| `npm run db:migrate` | Apply Django migrations |

Each package can also be run on its own from its folder (`npm run dev`, etc.).

## Production

`npm run build` then deploy Django with Gunicorn and serve `client/dist` through a
static web server. Run `npm run db:migrate` against your database first.

## Bootstrapping an admin

Use `python backend/manage.py createsuperuser` to create an administrator.
