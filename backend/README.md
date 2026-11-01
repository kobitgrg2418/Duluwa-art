# Duluwa Art — Django CMS + REST API

Edit every part of the Duluwa Art website from a browser, and feed the Next.js frontend through a JSON API.

| | |
|---|---|
| CMS admin | http://localhost:8000/admin/ |
| API root | http://localhost:8000/api/ |
| Interactive API docs (Swagger) | http://localhost:8000/api/docs/ |
| **Superuser** | username `admin@123` · password `admin123` |

> The demo password is weak on purpose. **Change it before the site is public** (admin → top right → *Change password*), set a real `DJANGO_SECRET_KEY`, and set `DJANGO_DEBUG=False`.

## Run

```bash
python3 -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py create_admin          # creates the superuser admin@123 / admin123
python manage.py seed_duluwa           # loads the 18 paintings + all starter content (safe to re-run)
python manage.py runserver 8000
```

Or just run `./setup.sh`, which does all of the above (venv, install, migrate, superuser, seed). The database and media are generated, not shipped: `seed_duluwa` rebuilds all renditions from `seed_images/`.
Tests: `python manage.py test` (7 tests: catalogue filters, home bundle, orders/pricing, commissions, auth, CMS editing).

## What you can edit (admin sections)

| Admin section | Controls on the website |
|---|---|
| **Site settings** | wordmark, tagline, header meta ("Ships from…"), contact email, WhatsApp, Instagram/Facebook, footer text, newsletter text, NPR→USD rate, SEO, logo/favicon, announcement banner |
| **Marquee items / Menu links** | scrolling strip text, main-menu and footer links |
| **Artworks** | upload painting, title, series, type (original/print), price NPR/USD, size, year, status (sold/available), "1 of 1", "just painted", tags, description, extra gallery photos, publish/unpublish. Bulk actions: mark sold/available, publish |
| **Collections** | series title, blurb, intro, cover painting, order |
| **Print sizes / papers / Shipping methods** | print option prices and shipping rates used by the cart |
| **Home page** | hero headline lines, finale painting, **hero floating paintings** (position, size, speed), shop labels, "Commission & Care" text/buttons/images/**info tiles**, series heading, **CTA panels**, quote text/author/image, **footer fan cards** |
| **Artist profile** | name, headline, bio, photo, process-sequence stages (+ optional real photos) |
| **Journal posts** | blog posts with cover |
| **Commission requests** | inbox with reference photos, status pipeline, internal notes |
| **Orders** | customer, items, totals, status, tracking number. *Mark paid* turns sold originals to "sold" automatically |
| **Newsletter subscribers / Contact messages** | inbox |

Uploading an image automatically produces 480 / 960 / 1600 px WebP renditions, a blur placeholder and the aspect ratio — the same data the frontend's `next/image` setup needs.

## Public API (no login)

| Method & path | Notes |
|---|---|
| `GET /api/site/` | settings, menu links, marquee |
| `GET /api/home/` | the whole home page in one call (hero, layers, shop lists, care, series, CTA, quote, footer fan) |
| `GET /api/artworks/` | filters: `type`, `status`, `series`, `category`, `orientation`, `just_painted`, `one_of_one`, `year`, `min_price`, `max_price`, `saved=slug1,slug2`, `search`, `ordering=price_npr\|-price_npr\|-year\|order`, `page`, `page_size` |
| `GET /api/artworks/{slug}/` | detail + `gallery` + 8 `related` |
| `GET /api/collections/`, `/api/collections/{slug}/` | series (detail includes its artworks) |
| `GET /api/artist/` | profile + process stages |
| `GET /api/journal/`, `/api/journal/{slug}/` | posts (`paragraphs` already split) |
| `GET /api/shop-config/` | print sizes, papers, shipping methods, exchange rate |
| `POST /api/orders/` | JSON: `name,email,phone,country,address,city,zip_code,payment_method,shipping_method,items:[{artwork,qty,size_index,paper_index}]`. **Prices are recomputed on the server**; sold originals are rejected. Returns `order_id`, totals |
| `GET /api/orders/{order_id}/?email=` | order status lookup |
| `POST /api/commissions/` | multipart: `name,email,phone,size,subject,notes,budget,similar(slug),references[] (≤4 images)` |
| `POST /api/newsletter/`, `POST /api/contact/` | `{email}` / `{name,email,message}` |

Write endpoints are rate-limited (20/hour per IP). Unpublished artworks never appear.

## Editing through the API (staff only)

```bash
TOKEN=$(curl -s -X POST localhost:8000/api/auth/token/ -H 'Content-Type: application/json' \
  -d '{"username":"admin@123","password":"admin123"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])')

curl -H "Authorization: Token $TOKEN" -F title="New painting" -F series=1 -F price_npr=50000 \
     -F category=portrait -F type=original -F image=@painting.jpg localhost:8000/api/manage/artworks/
curl -X PATCH -H "Authorization: Token $TOKEN" -H 'Content-Type: application/json' \
     -d '{"hero_lines":"Line one\nLine two"}' localhost:8000/api/manage/home/
```

Full CRUD (GET/POST/PATCH/DELETE, multipart for images) under `/api/manage/`:
`artworks, artwork-images, collections, journal, marquee, menu-links, print-sizes, print-papers, shipping-methods, hero-layers, info-tiles, cta-panels, fan-cards, process-stages, commissions, subscribers, messages, orders`
and single-record endpoints `site-settings/`, `home/`, `artist/` (GET + PATCH).
With multipart, an omitted checkbox keeps its default; send `is_published=false` explicitly to switch something off.

## Connect the Next.js frontend

1. In `duluwa-art/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000`
2. Copy `frontend-integration/api.ts` to `duluwa-art/lib/api.ts` (typed fetchers + submit helpers) and, if you load images from the API, `image-loader.ts` over `lib/image-loader.ts`.
3. Replace the imports of `data/artworks.ts`, `data/collections.ts`, `data/journal.ts` with the fetchers above (server components can `await getArtworks()` directly; pages revalidate every 60 s). Field names are snake_case; `id` equals `slug`, so the existing components work after a small rename (`price_npr` ↔ `priceNPR`, `blur_data_url` ↔ `blurDataURL`, `width_cm` ↔ `widthCm`).
4. `CORS_ALLOWED_ORIGINS` in `.env` must list your frontend origin(s).

## Deploy notes

PostgreSQL via `DATABASES` in `config/settings.py`; `gunicorn config.wsgi`; `python manage.py collectstatic`; serve `/media/` from object storage or your web server (WhiteNoise serves static only); set `DJANGO_ALLOWED_HOSTS`, `DJANGO_DEBUG=False`, a long `DJANGO_SECRET_KEY`, and re-enable `AUTH_PASSWORD_VALIDATORS`. Payment providers (eSewa, Khalti, Stripe) are not wired here: orders are stored as *pending*, you mark them paid in the admin (or from your payment webhook).

## Layout

`config/` settings & urls · `content/models.py` all CMS models · `admin.py` CMS · `serializers.py` / `views.py` / `urls.py` API · `management/commands/` `seed_duluwa`, `create_admin` · `seed_images/` your 18 originals · `media/` uploads · `frontend-integration/`
