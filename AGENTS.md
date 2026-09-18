# Duluwa Art Gallery — architecture

This project is a **React + Django** application, split into two packages:

- `client/` — React 19 SPA built with **Vite** and **React Router**. All UI lives here.
- `backend/` — **Django REST Framework** API backed by PostgreSQL, JWT
  authentication, email, Google sign-in verification, and file uploads.

The two talk over `/api/*`. In dev, Vite proxies `/api` to Django on port 8000
(`client/vite.config.ts`) so the browser stays single-origin.

## Conventions

- **Client imports** use the `@/` alias → `client/src` (configured in both
  `vite.config.ts` and `tsconfig.json`).
- `@/components/link` and `@/components/img` are thin shims that replace
  `next/link` / `next/image` — keep using `<Link href>` / `<Image .../>`.
- Data is fetched through `@/lib/api` (`api.get/post/patch/del/postForm`), which
  always sends credentials and throws an `ApiError` on non-2xx.
- Pages fetch their data with `useApiData(...)` and render a presentational
  component once loaded.
- **Backend**: routes live under `backend/*`; shared data access is handled by
  Django models and serializers. Auth is enforced with DRF permissions and JWT.

## Running

From the repo root: `npm run install:all`, then `npm run db:migrate` and `npm run dev`.
See `README.md` for full setup, environment variables, and seeding.
