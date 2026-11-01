'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useCatalog } from '@/context/CatalogContext';
import { EASE_WIPE } from '@/lib/motion';

export default function SearchOverlay() {
  const open = useStore((s) => s.searchOpen);
  const setSearch = useStore((s) => s.setSearch);
  const [q, setQ] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const { artworks } = useCatalog();

  useEffect(() => {
    if (!open) return;
    setQ('');
    const t = setTimeout(() => input.current?.focus(), 350);
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setSearch(false);
    window.addEventListener('keydown', k);
    return () => { clearTimeout(t); window.removeEventListener('keydown', k); };
  }, [open, setSearch]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return artworks.slice(0, 6);
    return artworks.filter((a) => [a.title, a.series, a.category, a.type, ...a.tags].join(' ').toLowerCase().includes(s));
  }, [q, artworks]);

  return (
    <AnimatePresence>
      {open && (
        <m.div role="dialog" aria-modal="true" aria-label="Search"
          className="fixed inset-0 z-[130] bg-paper px-[var(--pad)] pt-24 text-ink"
          initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: EASE_WIPE }}
        >
          <button type="button" onClick={() => setSearch(false)} className="label fixed right-[var(--pad)] top-5 border border-ink px-3 py-3">Close ✕</button>
          <label className="label text-mute" htmlFor="q">Search originals &amp; prints</label>
          <input ref={input} id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="yak, elder, sparrow…"
            className="mt-2 w-full border-b border-ink bg-transparent pb-3 font-display text-[clamp(2rem,6vw,5rem)] font-bold uppercase tracking-tightest outline-none placeholder:text-ink/20" />
          <ul data-lenis-prevent className="mt-6 max-h-[60vh] overflow-y-auto">
            {results.map((a) => (
              <li key={a.id} className="border-b border-ink/10">
                <Link href={`/artwork/${a.slug}`} className="flex items-baseline justify-between py-3 hover:text-accent">
                  <span className="font-display text-lg font-semibold uppercase tracking-tight md:text-2xl">{a.title}</span>
                  <span className="label text-mute">{a.series.replace(/-/g, ' ')} · {a.type}</span>
                </Link>
              </li>
            ))}
            {results.length === 0 && <li className="py-6 font-serif text-2xl italic">No paintings match “{q}”.</li>}
          </ul>
        </m.div>
      )}
    </AnimatePresence>
  );
}
