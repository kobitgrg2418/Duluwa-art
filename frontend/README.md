# Duluwa Art

Online-only watercolor gallery and store for Kobit Gurung's Himalayan paintings.
Next.js 15 (App Router) · TypeScript · Tailwind · Framer Motion · Lenis · Zustand.

## Run

```bash
npm install
npm run dev        # http://localhost:3000  (runs the image pipeline first)
npm run build && npm start
```

## Add a painting

1. Drop the photo into `artworks-src/`.
2. Add `'<file name>': '<slug-id>'` to `FILE_IDS` in `scripts/process-images.ts`.
3. Add one entry to `RAW` in `data/artworks.ts` (title, series, size, price, type…).

`npm run images` (also run before dev/build) generates AVIF/WebP at 480/960/1600 px, a blur placeholder and the aspect ratio into `public/artworks/` and `data/images.generated.json`.
Titles, sizes, prices and the biography are placeholders. Edit them freely.

## Structure

`app/` routes · `components/{motion,ui,cards,sections,layout}` · `hooks/` · `lib/` · `data/` · `store/` · `styles/`

- Scroll sequences live in `components/sections/` (Hero, CommissionDark, Series, Quote, Footer, ProcessSequence), each driven by one `useSeqProgress` (spring-smoothed `useScroll`).
- Motion primitives: `Reveal`, `SplitText`, `Parallax`, `MagneticButton`, `Marquee`, `Cursor`, `PageTransition`, `SmoothScroll` (Lenis synced to Framer's frame loop).
- Cursor labels: add `data-cursor="view|drag|add|hide"` to any element.

## Integration points (all clearly marked in code)

- **Payments** — `lib/payments.ts`: eSewa, Khalti, Stripe/card, bank transfer (mocked, resolves after 1.2 s).
- **Commission form** and **newsletter** — `CommissionForm.tsx`, `Footer.tsx` (`INTEGRATION STUB` comments).
- **CMS** — swap `data/artworks.ts` / `data/collections.ts` / `data/journal.ts` for Sanity or Shopify; components only read typed data.
- Set `NEXT_PUBLIC_SITE_URL` for canonical URLs, sitemap and JSON-LD. Replace the WhatsApp number `9779800000000` and `hello@duluwa.art`.

## Accessibility & performance

`prefers-reduced-motion` disables parallax and the pinned hero (fades remain); the custom cursor only loads on `(hover:hover) and (pointer:fine)`; overlays pause Lenis and use `data-lenis-prevent`. Only `transform/opacity/clip-path` are animated on large layers.
