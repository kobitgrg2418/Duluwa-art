'use client';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { m, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useCatalog } from '@/context/CatalogContext';
import ArtworkCard from '@/components/cards/ArtworkCard';
import { useStore } from '@/store/useStore';
import { money } from '@/lib/price';
import { EASE, EASE_WIPE } from '@/lib/motion';

type TypeF = 'all' | 'original' | 'print';
type Avail = 'all' | 'available' | 'sold';
type Sort = 'featured' | 'low' | 'high' | 'newest';
interface Filters {
  type: TypeF; avail: Avail; categories: string[]; series: string[]; orientation: string[]; sizes: string[]; max: number; saved: boolean; sort: Sort;
}
const MAX = 120000;
const sizeBucket = (long: number) => (long <= 40 ? 's' : long <= 45 ? 'm' : 'l');
const SIZE_LABEL: Record<string, string> = { s: 'Up to 40 cm', m: '41–45 cm', l: '46 cm +' };
const SPAN = ['md:col-span-8', 'md:col-span-4', 'md:col-span-4', 'md:col-span-4', 'md:col-span-4'];

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={clsx('label border px-2.5 py-2 transition-colors', on ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink')}>
      {label}
    </button>
  );
}
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-ink/10 py-4">
      <legend className="label mb-3 text-mute">{title}</legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}
const toggleIn = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function FilterPanel({ f, set, currency }: { f: Filters; set: (p: Partial<Filters>) => void; currency: 'NPR' | 'USD' }) {
  const { collections } = useCatalog();
  
  return (
    <div>
      <Group title="Type">
        {(['all', 'original', 'print'] as const).map((v) => <Toggle key={v} label={v === 'all' ? 'All' : v === 'original' ? 'Originals' : 'Prints'} on={f.type === v} onClick={() => set({ type: v })} />)}
      </Group>
      <Group title="Availability">
        {(['all', 'available', 'sold'] as const).map((v) => <Toggle key={v} label={v} on={f.avail === v} onClick={() => set({ avail: v })} />)}
      </Group>
      <Group title="Category">
        {['portrait', 'landscape', 'wildlife'].map((v) => <Toggle key={v} label={v} on={f.categories.includes(v)} onClick={() => set({ categories: toggleIn(f.categories, v) })} />)}
      </Group>
      <Group title="Series">
        {collections.map((c) => <Toggle key={c.slug} label={c.title} on={f.series.includes(c.slug)} onClick={() => set({ series: toggleIn(f.series, c.slug) })} />)}
      </Group>
      <Group title="Orientation">
        {['portrait', 'landscape'].map((v) => <Toggle key={v} label={v} on={f.orientation.includes(v)} onClick={() => set({ orientation: toggleIn(f.orientation, v) })} />)}
      </Group>
      <Group title="Size (longest side)">
        {(['s', 'm', 'l'] as const).map((v) => <Toggle key={v} label={SIZE_LABEL[v]} on={f.sizes.includes(v)} onClick={() => set({ sizes: toggleIn(f.sizes, v) })} />)}
      </Group>
      <fieldset className="border-b border-ink/10 py-4">
        <legend className="label mb-3 text-mute">Price up to</legend>
        <input type="range" min={3000} max={MAX} step={1000} value={f.max} onChange={(e) => set({ max: +e.target.value })} className="w-full accent-[var(--accent)]" aria-label="Maximum price" />
        <p className="mt-1 text-sm font-semibold">{f.max >= MAX ? 'Any price' : money(f.max, currency)}</p>
      </fieldset>
      <Group title="Saved"><Toggle label="Only saved works" on={f.saved} onClick={() => set({ saved: !f.saved })} /></Group>
    </div>
  );
}

export default function ShopClient() {
  const { artworks, collections } = useCatalog();
  const sp = useSearchParams();
  const currency = useStore((s) => s.currency);
  const wishlist = useStore((s) => s.wishlist);
  const [drawer, setDrawer] = useState(false);
  const [f, setF] = useState<Filters>(() => {
    const t = sp.get('type');
    const se = sp.get('series');
    return {
      type: t === 'original' || t === 'print' ? t : 'all', avail: 'all', categories: [], series: se ? [se] : [], orientation: [], sizes: [], max: MAX, saved: sp.get('saved') === '1', sort: 'featured',
    };
  });
  const set = (p: Partial<Filters>) => setF((x) => ({ ...x, ...p }));
  const reset = () => setF({ type: 'all', avail: 'all', categories: [], series: [], orientation: [], sizes: [], max: MAX, saved: false, sort: 'featured' });

  const list = useMemo(() => {
    let l = artworks.filter((a) =>
      (f.type === 'all' || a.type === f.type) &&
      (f.avail === 'all' || a.status === f.avail) &&
      (!f.categories.length || f.categories.includes(a.category)) &&
      (!f.series.length || f.series.includes(a.series)) &&
      (!f.orientation.length || f.orientation.includes(a.orientation)) &&
      (!f.sizes.length || f.sizes.includes(sizeBucket(Math.max(a.widthCm, a.heightCm)))) &&
      a.priceNPR <= f.max &&
      (!f.saved || wishlist.includes(a.id)));
    if (f.sort === 'low') l = l.slice().sort((a, b) => a.priceNPR - b.priceNPR);
    if (f.sort === 'high') l = l.slice().sort((a, b) => b.priceNPR - a.priceNPR);
    if (f.sort === 'newest') l = l.slice().sort((a, b) => b.year - a.year);
    return l;
  }, [f, wishlist, artworks]);

  const active = (f.type !== 'all' ? 1 : 0) + (f.avail !== 'all' ? 1 : 0) + f.categories.length + f.series.length + f.orientation.length + f.sizes.length + (f.max < MAX ? 1 : 0) + (f.saved ? 1 : 0);

  return (
    <section className="page-pad pb-28">
      <div className="mb-4 flex items-center justify-between border-y border-ink/10 py-3">
        <button type="button" className="label md:hidden border border-ink px-3 py-2" onClick={() => setDrawer(true)}>Filters{active ? ` (${active})` : ''}</button>
        <p className="label hidden text-mute md:block" aria-live="polite">{list.length} {list.length === 1 ? 'work' : 'works'}</p>
        <div className="flex items-center gap-3">
          {active > 0 && <button type="button" onClick={reset} className="label underline-offset-4 hover:underline">Clear</button>}
          <label className="label text-mute" htmlFor="sort">Sort</label>
          <select id="sort" value={f.sort} onChange={(e) => set({ sort: e.target.value as Sort })} className="label border border-ink/20 bg-transparent px-2 py-2">
            <option value="featured">Featured</option><option value="newest">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2" data-lenis-prevent>
            <FilterPanel f={f} set={set} currency={currency} />
          </div>
        </aside>

        <div>
          {list.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-serif text-3xl italic">No paintings match these filters.</p>
              <button type="button" onClick={reset} className="btn mt-6">Clear filters</button>
            </div>
          ) : (
            <m.div layout className="grid gap-3 md:auto-rows-[clamp(340px,29vw,520px)] md:grid-cols-12 md:gap-4">
              <AnimatePresence mode="popLayout">
                {list.map((a, i) => (
                  <m.div key={a.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.6, ease: EASE }} className={SPAN[i % 5]}>
                    <ArtworkCard a={a} index={i} className="aspect-[4/5] md:aspect-auto md:h-full" sizes={i % 5 === 0 ? '(min-width:768px) 48vw, 100vw' : '(min-width:768px) 24vw, 100vw'} />
                  </m.div>
                ))}
              </AnimatePresence>
            </m.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <m.div className="fixed inset-0 z-[125] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <m.aside role="dialog" aria-modal="true" aria-label="Filters" data-lenis-prevent
              className="fixed bottom-0 left-0 top-0 z-[130] flex w-[88%] max-w-[380px] flex-col bg-paper"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.6, ease: EASE_WIPE }}>
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                <h2 className="font-display text-lg font-bold uppercase">Filters</h2>
                <button type="button" onClick={() => setDrawer(false)} className="label">Done ({list.length})</button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-10"><FilterPanel f={f} set={set} currency={currency} /></div>
            </m.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
