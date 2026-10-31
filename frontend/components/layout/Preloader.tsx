'use client';
import { useEffect, useState } from 'react';
import { m, animate, useReducedMotion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { EASE_WIPE } from '@/lib/motion';

export default function Preloader() {
  const setReady = useStore((s) => s.setReady);
  const reduced = useReducedMotion();
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('duluwa-preloaded') === '1'; } catch { /* ignore */ }
    if (seen) { setShow(false); setReady(true); return; }
    const c = animate(0, 100, {
      duration: reduced ? 0.3 : 1.7,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        try { sessionStorage.setItem('duluwa-preloaded', '1'); } catch { /* ignore */ }
        setOut(true);
        setReady(true);
        setTimeout(() => setShow(false), 1000);
      },
    });
    return () => c.stop();
  }, [reduced, setReady]);

  if (!show) return null;
  return (
    <m.div
      aria-hidden
      className="fixed inset-0 z-[300] flex flex-col justify-between bg-night p-[var(--pad)] text-white"
      animate={{ y: out ? '-100%' : '0%' }}
      transition={{ duration: 0.9, ease: EASE_WIPE }}
    >
      <p className="label text-white/50">Watercolors from the Himalaya</p>
      <div className="flex items-end justify-between">
        <span className="font-display text-[clamp(3.5rem,16vw,15rem)] font-bold uppercase leading-[0.8] tracking-tightest">Duluwa</span>
        <span className="font-display text-[clamp(2rem,6vw,5rem)] font-bold tabular-nums leading-none">{String(n).padStart(3, '0')}</span>
      </div>
    </m.div>
  );
}
