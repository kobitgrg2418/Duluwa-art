# Duluwa Art — ready-to-run fullstack (Next.js + Django CMS)

The frontend (`frontend/`) is already connected to the backend (`backend/`). Everything on the site
(paintings, collections, hero, menu, footer, artist page, journal, prices, shipping) comes from the CMS.

## Run (needs Python 3.10+ and Node 18+)
- Mac/Linux: `./start-all.sh`
- Windows: double-click `start-all.bat`

First run installs everything and loads the 18 paintings. Then open:
- Site: http://localhost:3000
- CMS admin: http://localhost:8000/admin/ — username `admin@123`, password `admin123`
- API docs: http://localhost:8000/api/docs/

## How they connect
`frontend/.env.local` holds `NEXT_PUBLIC_API_URL=http://localhost:8000`. The backend allows any
`localhost` port via CORS while `DEBUG=True`. Edits made in the CMS appear on the site within ~15 seconds.

## If it won't connect
1. Open http://localhost:8000/api/home/ — it must show JSON. If not, the backend isn't running.
2. Restart the frontend after changing `.env.local`.
3. Using a different port/host? Set `NEXT_PUBLIC_API_URL` to it.

## Going live
- Backend: set `DEBUG=False`, a new `SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` (your site URL) in `backend/.env`; use Postgres + persistent media storage.
- Frontend: set `NEXT_PUBLIC_API_URL` to the public API URL and `NEXT_PUBLIC_SITE_URL` to your domain.
- **Change the admin password** (`admin123`) first.
- Payments (eSewa/Khalti/card) create a pending order; connect the gateway in `frontend/lib/payments.ts` and mark orders paid in the CMS.
