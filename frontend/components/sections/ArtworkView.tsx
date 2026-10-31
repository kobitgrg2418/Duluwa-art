'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { m, AnimatePresence, LayoutGroup } from 'framer-motion';
import type { Artwork } from '@/lib/types';
import Art from '@/components/ui/Art';
import Chip from '@/components/ui/Chip';
import Accordion from '@/components/ui/Accordion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import ArtworkCard from '@/components/cards/ArtworkCard';
import { useStore } from '@/store/useStore';
import { PRINT_PAPERS, PRINT_SIZES, printOption, printPrice } from '@/lib/prints';
import { EASE } from '@/lib/motion';

const VIEWS = [
  { label: 'Full painting', scale: 1, origin: '50% 50%' },
  { label: 'Brushwork detail', scale: 2.3, origin: '38% 38%' },
  { label: 'Signature', scale: 3.2, origin: '90% 93%' },
];

function Room({ a }: { a: Artwork }) {
  const WALL = 150; // visible wall width in cm
  const w = ((a.widthCm + 4) / WALL) * 100;
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e4ded3]" role="img" aria-label={`${a.title} on a living-room wall, shown to scale`}>
      <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#c9bfae]" />
      <div className="absolute left-1/2 top-[16%] -translate-x-1/2 bg-white shadow-matDeep" style={{ width: `${w}%`, aspectRatio: `${(a.widthCm + 4) / (a.heightCm + 4)}`, padding: '2%' }}>
        <div className="relative h-full w-full"><Art a={a} fill sizes="60vw" className="object-cover" /></div>
      </div>
      {/* sofa, 180cm wide */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2" style={{ width: `${(110 / WALL) * 100}%` }}>
        <div className="h-[7vw] min-h-[40px] max-h-[96px] rounded-t-md bg-[#6b5f52]" />
        <div className="-mt-1 h-[3.5vw] min-h-[22px] max-h-[48px] rounded-sm bg-[#5a4f43]" />
      </div>
      <p className="label absolute bottom-3 left-3 text-ink/50">Shown to scale · loveseat 110 cm · painting {a.widthCm}×{a.heightCm} cm</p>
    </div>
  );
}

export default function ArtworkView({ a, related }: { a: Artwork; related: Artwork[] }) {
  const router = useRouter();
  const currency = useStore((s) => s.currency);
  const setCurrency = useStore((s) => s.setCurrency);
  const wished = useStore((s) => s.wishlist.includes(a.id));
  const toggleWish = useStore((s) => s.toggleWish);
  const addLine = useStore((s) => s.addLine);
  const lines = useStore((s) => s.lines);
  const fly = useStore((s) => s.fly);
  const toast = useStore((s) => s.toast);
  const setLightbox = useStore((s) => s.setLightbox);
  const setCart = useStore((s) => s.setCart);

  const [view, setView] = useState(0);
  const [room, setRoom] = useState(false);
  const [box, setBox] = useState(false);
  const [size, setSize] = useState(0);
  const [paper, setPaper] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number; bx: number; by: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const imgBox = useRef<HTMLDivElement>(null);
  const carousel = useRef<HTMLDivElement>(null);
  const [dragW, setDragW] = useState(0);

  const sold = a.status === 'sold';
  const isPrint = a.type === 'print';
  const unit = isPrint ? printPrice(a, size, paper) : a.priceNPR;
  const key = isPrint ? `${a.id}|${printOption(size, paper)}` : a.id;
  const inCart = lines.some((l) => l.key === key);

  useEffect(() => { setLightbox(box); return () => setLightbox(false); }, [box, setLightbox]);
  useEffect(() => {
    if (!box) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setBox(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [box]);
  useEffect(() => {
    const el = carousel.current;
    if (!el) return;
    const upd = () => setDragW(Math.max(0, el.scrollWidth - el.clientWidth));
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, [related.length]);

  const add = (go?: boolean) => {
    if (sold) return;
    if (inCart && !isPrint) { toast('This original is already in your cart.'); if (go) router.push('/checkout'); return; }
    const r = imgBox.current?.getBoundingClientRect();
    if (r && !go) fly({ image: a.image, aspect: a.aspect, from: { x: r.left, y: r.top, w: r.width, h: r.height } });
    addLine({ key, artworkId: a.id, option: isPrint ? printOption(size, paper) : undefined, unitNPR: unit });
    if (go) router.push('/checkout');
    else toast(`“${a.title}” added to cart`);
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || view !== 0 || room) return;
    const r = imgBox.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) return setLens(null);
    setLens({ x, y, bx: x / r.width, by: y / r.height });
  };

  const msg = encodeURIComponent(`Hello Kobit, I'd like to ask about "${a.title}" (${a.type}, ${a.widthCm}×${a.heightCm} cm).`);
  const artStyle: React.CSSProperties = { aspectRatio: String(a.aspect), width: `min(80cqw, calc(80cqh * ${a.aspect.toFixed(4)}))` };

  return (
    <LayoutGroup id={`art-${a.id}`}>
      <section className="page-pad pb-24 pt-28 md:pt-32">
        <nav aria-label="Breadcrumb" className="label mb-6 text-mute">
          <Link href="/shop" className="hover:text-ink">Shop</Link> / <Link href={`/collections/${a.series}`} className="hover:text-ink">{a.series.replace(/-/g, ' ')}</Link> / <span className="text-ink">{a.title}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          {/* gallery */}
          <div className="md:col-span-7">
            {room ? <Room a={a} /> : (
              <div ref={stage} className="art-stage relative aspect-[4/5] w-full overflow-hidden bg-card md:aspect-[5/5.2]" onPointerMove={onMove} onPointerLeave={() => setLens(null)}>
                <button type="button" onClick={() => setBox(true)} data-cursor="view" aria-label="Open full-size view" className="absolute inset-0 flex items-center justify-center">
                  <m.div layoutId={`main-${a.id}`} ref={imgBox} style={artStyle} className="relative overflow-hidden bg-white shadow-matDeep" transition={{ duration: 0.7, ease: EASE }}>
                    <m.div className="absolute inset-0" animate={{ scale: VIEWS[view].scale }} style={{ transformOrigin: VIEWS[view].origin }} transition={{ duration: 0.9, ease: EASE }}>
                      <Art a={a} fill priority sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
                    </m.div>
                    {lens && (
                      <span aria-hidden className="pointer-events-none absolute z-10 h-40 w-40 rounded-full border-2 border-white shadow-matDeep"
                        style={{ left: lens.x - 80, top: lens.y - 80, backgroundImage: `url(/artworks/${a.image}-1600.webp)`, backgroundSize: '260% 260%', backgroundPosition: `${lens.bx * 100}% ${lens.by * 100}%` }} />
                    )}
                  </m.div>
                </button>
                {sold && <span className="chip absolute left-3 top-3 border-accent text-accent"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />Sold</span>}
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {VIEWS.map((v, i) => (
                <button key={v.label} type="button" onClick={() => { setRoom(false); setView(i); }} aria-pressed={!room && view === i} aria-label={v.label}
                  className={clsx('relative h-16 w-16 overflow-hidden bg-card transition-opacity', !room && view === i ? 'ring-2 ring-ink' : 'opacity-70 hover:opacity-100')}>
                  <div className="absolute inset-0" style={{ transform: `scale(${v.scale})`, transformOrigin: v.origin }}>
                    <Art a={a} fill sizes="64px" className="object-cover" alt="" />
                  </div>
                </button>
              ))}
              <button type="button" onClick={() => setRoom((r) => !r)} aria-pressed={room} className={clsx('label ml-auto border px-3 py-3', room ? 'border-ink bg-ink text-white' : 'border-ink/30 hover:border-ink')}>
                In a room
              </button>
            </div>
          </div>

          {/* info */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <div className="flex flex-wrap gap-1.5">
                <Chip>{a.type}</Chip><Chip>{a.category}</Chip>
                {a.oneOfOne && <Chip>1 of 1</Chip>}
                {sold && <Chip className="border-accent text-accent">Sold</Chip>}
              </div>
              <h1 className="display-md mt-4">{a.title}</h1>
              <p className="label mt-3 text-mute">{a.medium} · {a.widthCm} × {a.heightCm} cm · {a.year}</p>
              <p className="mt-5 max-w-[460px] text-[15px] text-ink/75">{a.description}</p>

              {isPrint && !sold && (
                <div className="mt-6 grid gap-4">
                  <fieldset>
                    <legend className="label mb-2 text-mute">Print size</legend>
                    <div className="flex flex-wrap gap-1.5">{PRINT_SIZES.map((s, i) => <button key={s.label} type="button" aria-pressed={size === i} onClick={() => setSize(i)} className={clsx('label border px-3 py-2', size === i ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink')}>{s.label}</button>)}</div>
                  </fieldset>
                  <fieldset>
                    <legend className="label mb-2 text-mute">Paper</legend>
                    <div className="flex flex-wrap gap-1.5">{PRINT_PAPERS.map((s, i) => <button key={s.label} type="button" aria-pressed={paper === i} onClick={() => setPaper(i)} className={clsx('label border px-3 py-2', paper === i ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink')}>{s.label}</button>)}</div>
                  </fieldset>
                </div>
              )}

              <div className="mt-7 flex items-end justify-between border-y border-ink/10 py-5">
                <div>
                  <AnimatedNumber npr={unit} currency={currency} className="font-display text-3xl font-bold tracking-tight" />
                  <p className="label mt-1 text-mute">{currency === 'NPR' ? 'USD' : 'NPR'} equivalent <AnimatedNumber npr={unit} currency={currency === 'NPR' ? 'USD' : 'NPR'} className="text-ink" /></p>
                </div>
                <div className="flex" role="group" aria-label="Currency">
                  {(['NPR', 'USD'] as const).map((c) => <button key={c} type="button" aria-pressed={currency === c} onClick={() => setCurrency(c)} className={clsx('label border px-3 py-2', currency === c ? 'border-ink bg-ink text-white' : 'border-ink/20')}>{c}</button>)}
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                {sold ? (
                  <Link href={`/commission?similar=${a.slug}`} className="btn">Request a similar commission</Link>
                ) : (
                  <>
                    <button type="button" className="btn" data-cursor="add" onClick={() => add()}>{inCart && !isPrint ? 'In your cart ✓' : 'Add to cart'}</button>
                    <button type="button" className="btn btn-ghost" onClick={() => add(true)}>Buy now</button>
                  </>
                )}
                <div className="flex gap-2">
                  <a className="btn btn-ghost flex-1" href={`https://wa.me/9779800000000?text=${msg}`} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
                  <a className="btn btn-ghost flex-1" href={`mailto:hello@duluwa.art?subject=${encodeURIComponent(a.title)}&body=${msg}`}>Email</a>
                  <button type="button" aria-pressed={wished} aria-label={wished ? 'Remove from saved' : 'Save'} onClick={() => toggleWish(a.id)} className="btn btn-ghost !px-4">{wished ? '♥' : '♡'}</button>
                </div>
              </div>

              <div className="mt-8">
                <Accordion items={[
                  { title: 'Shipping', body: <>Ships from Kathmandu, worldwide, tracked and insured. Originals travel framed in protective crating or rolled in a tube on request. Standard 10–16 days, express 4–7 days. Duties may apply at destination. <button type="button" className="underline underline-offset-4" onClick={() => setCart(true)}>View cart</button></> },
                  { title: 'Authenticity', body: <>{isPrint ? 'Each print is hand-signed and numbered by Kobit Gurung and ships with a certificate of authenticity.' : 'Every original is a unique watercolor, signed in red by Kobit Gurung and shipped with a signed certificate of authenticity.'}</> },
                  { title: 'Care', body: <>Keep out of direct sunlight, hang away from damp walls, and frame behind UV-protective glass with a mat so the paper never touches the glass.</> },
                ]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pb-28" aria-label="Related works">
          <div className="page-pad mb-6 flex items-end justify-between border-b border-ink/10 pb-3">
            <h2 className="font-display text-xl font-semibold uppercase tracking-tight md:text-2xl">More like this</h2>
            <span className="label text-mute">Drag →</span>
          </div>
          <div ref={carousel} className="overflow-hidden pl-[var(--pad)]" data-cursor="drag" data-lenis-prevent>
            <m.div drag="x" dragConstraints={{ left: -dragW, right: 0 }} dragElastic={0.08} className="flex gap-3 pr-[var(--pad)]">
              {related.map((r, i) => (
                <div key={r.id} className="w-[72vw] shrink-0 md:w-[26vw]">
                  <ArtworkCard a={r} index={i} className="aspect-[4/5]" sizes="(min-width:768px) 26vw, 72vw" />
                </div>
              ))}
            </m.div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {box && (
          <m.div role="dialog" aria-modal="true" aria-label={`${a.title} full size`} data-lenis-prevent
            className="fixed inset-0 z-[170] flex items-center justify-center bg-black/90 p-4 md:p-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBox(false)}>
            <button type="button" className="label absolute right-5 top-5 z-10 border border-white/40 px-3 py-3 text-white" onClick={() => setBox(false)}>Close ✕</button>
            <m.div layoutId={`main-${a.id}`} className="relative bg-white shadow-matDeep" style={{ aspectRatio: a.aspect, height: `min(88vh, calc(88vw / ${a.aspect.toFixed(4)}))` }} transition={{ duration: 0.7, ease: EASE }}>
              <Art a={a} fill sizes="100vw" className="object-cover" />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
