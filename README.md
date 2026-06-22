# Duluwa Art Gallery

Original watercolours & sketches by Kobit Gurung — an art gallery e-commerce site.

This repository is a **React + Node.js** application, split into two packages:

```
duluwa-art/
├── client/   # React 19 SPA — Vite + React Router (the UI)
├── server/   # Express + TypeScript REST API — Prisma + PostgreSQL
└── package.json   # orchestration scripts (run both at once)
```

It was migrated from a Next.js full-stack app: server components / server actions
became REST endpoints under `/api/*`, and the App Router became client-side routes.

## Prerequisites

- Node.js 20+
- A PostgreSQL database

## Setup

```bash
# 1. Install dependencies for both packages
npm run install:all

# 2. Configure environment
#    server/.env  — copy from server/.env.example, fill in DATABASE_URL, SESSION_SECRET, etc.
#    client/.env  — copy from client/.env.example (VITE_GOOGLE_CLIENT_ID is optional)

# 3. Create the schema and seed starter data
npm run db:push
npm run db:seed        # seeds collections/artworks/etc. + admin@duluwa.art / admin123

# 4. Run client + server together (server :4000, client :5173)
npm run dev
```

Then open http://localhost:5173.

In development, the Vite dev server proxies `/api` → `http://localhost:4000`, so the
browser stays single-origin and the session cookie works without CORS juggling.

## Environment variables

**server/.env** (see `server/.env.example`):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` / `DIRECT_DATABASE_URL` | PostgreSQL connection (Prisma) |
| `SESSION_SECRET` | Signs JWT session cookies (required in production) |
| `GOOGLE_CLIENT_ID` | Verifies Google sign-in credentials |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Transactional email (orders, commissions) |
| `BLOB_READ_WRITE_TOKEN` | Optional Vercel Blob for uploads (falls back to base64) |
| `PORT` | API port (default 4000) |
| `CLIENT_ORIGIN` | Allowed CORS origin (default http://localhost:5173) |

**client/.env** (see `client/.env.example`):

| Variable | Purpose |
| --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | Google Sign-In client id (browser) |
| `VITE_API_URL` | Only if hosting the API on a different origin than the client |

## Scripts (run from the repo root)

| Script | Description |
| --- | --- |
| `npm run dev` | Start the API and the React dev server together |
| `npm run build` | `prisma generate` + build the client to `client/dist` |
| `npm start` | Run the API in production (also serves `client/dist`) |
| `npm run typecheck` | Type-check both packages |
| `npm run db:push` / `db:seed` / `db:studio` | Prisma helpers (delegate to `server/`) |

Each package can also be run on its own from its folder (`npm run dev`, etc.).

## Production

`npm run build` then `npm start`. With `NODE_ENV=production` the Express server
serves the built client from `client/dist`, so the whole app runs from a single
origin/port. Run `prisma migrate deploy` (or `db:push`) against your database first.

## Bootstrapping an admin

`npm run db:seed` creates `admin@duluwa.art` / `admin123`. Alternatively, hit
`GET /api/seed` once on a running server to create/promote that admin user.
