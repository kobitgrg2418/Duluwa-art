# Duluwa Art Gallery — architecture

This project is a **React + Node.js** application, split into two packages:

- `client/` — React 19 SPA built with **Vite** and **React Router**. All UI lives here.
- `server/` — **Express** (TypeScript) REST API. Prisma + PostgreSQL, JWT cookie
  sessions (`jose`), nodemailer, Google sign-in verification, file uploads.

The two talk over `/api/*`. In dev, Vite proxies `/api` to the Express server
(`client/vite.config.ts`) so the browser stays single-origin and the session
cookie flows automatically. In production the server can serve the built client
from `client/dist` (single origin).

## Conventions

- **Client imports** use the `@/` alias → `client/src` (configured in both
  `vite.config.ts` and `tsconfig.json`).
- `@/components/link` and `@/components/img` are thin shims that replace
  `next/link` / `next/image` — keep using `<Link href>` / `<Image .../>`.
- Data is fetched through `@/lib/api` (`api.get/post/patch/del/postForm`), which
  always sends credentials and throws an `ApiError` on non-2xx.
- Pages fetch their data with `useApiData(...)` and render a presentational
  component once loaded.
- **Server**: every route lives under `server/src/routes/*`; shared data access is
  in `server/src/lib/*`. Auth is enforced with the `requireAuth` / `requireAdmin`
  middleware. The Prisma client is generated into `server/src/generated/prisma`
  (run `npm run build` / `prisma generate`).

## Running

From the repo root: `npm run install:all`, then `npm run dev` (starts both).
See `README.md` for full setup, environment variables, and seeding.
