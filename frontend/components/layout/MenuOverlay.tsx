'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { EASE_WIPE, EASE } from '@/lib/motion';

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/artist', label: 'Artist' },
  { href: '/commission', label: 'Commission' },
  { href: '/journal', label: 'Journal' },
];

export default function MenuOverlay() {
  const open = useStore((s) => s.menuOpen);
  const setMenu = useStore((s) => s.setMenu);
  const currency = useStore((s) => s.currency);
  const setCurrency = useStore((s) => s.setCurrency);
  const saved = useStore((s) => s.wishlist.length);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, setMenu]);

  return (
    <AnimatePresence>
      {open && (
        <m.nav
          aria-label="Main menu"
          className="fixed inset-0 z-[95] flex flex-col justify-between bg-night px-[var(--pad)] pb-8 pt-28 text-white"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.8, ease: EASE_WIPE }}
          data-lenis-prevent
        >
          <ul className="flex flex-col">
            {LINKS.map((l, i) => (
              <li key={l.href} className="overflow-hidden border-b border-white/10">
                <m.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.07 }}>
                  <Link href={l.href} className="group flex items-baseline justify-between py-3 font-display text-[clamp(2.6rem,9vw,7rem)] font-bold uppercase leading-[0.95] tracking-tightest transition-colors hover:text-accent">
                    {l.label}
                    <span className="label hidden text-white/40 md:block">0{i + 1}</span>
                  </Link>
                </m.div>
              </li>
            ))}
          </ul>
          <m.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.6 }}
            className="mt-8 grid gap-6 text-[13px] text-white/70 md:grid-cols-3"
          >
            <div>
              <p className="label mb-2 text-white/40">Studio</p>
              <p>Pokhara &amp; Kathmandu, Nepal</p>
              <a className="underline-offset-4 hover:underline" href="mailto:hello@duluwa.art">hello@duluwa.art</a>
            </div>
            <div>
              <p className="label mb-2 text-white/40">Currency</p>
              <div className="flex gap-2">
                {(['NPR', 'USD'] as const).map((c) => (
                  <button key={c} type="button" onClick={() => setCurrency(c)} aria-pressed={currency === c}
                    className={'label border px-3 py-2 ' + (currency === c ? 'border-white bg-white text-black' : 'border-white/30')}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label mb-2 text-white/40">Saved</p>
              <Link href="/shop?saved=1" className="underline-offset-4 hover:underline">{saved} saved {saved === 1 ? 'work' : 'works'} →</Link>
            </div>
          </m.div>
        </m.nav>
      )}
    </AnimatePresence>
  );
}
