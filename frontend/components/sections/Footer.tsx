'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { m, useTransform, type MotionValue } from 'framer-motion';
import { useSeqProgress } from '@/hooks/useSeqProgress';
import { byId } from '@/data/artworks';
import Art from '@/components/ui/Art';
import { useStore } from '@/store/useStore';

const FAN = [
  { id: 'ceremonial-headdress', r0: -8, r1: -18, x0: 0, x1: -34 },
  { id: 'yak-caravan', r0: 0, r1: 0, x0: 0, x1: 0 },
  { id: 'young-woman-earrings', r0: 8, r1: 18, x0: 0, x1: 34 },
];
const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/artist', label: 'Artist' },
  { href: '/commission', label: 'Commission' },
  { href: '#contact', label: 'Contact' },
];
const WORD = 'DULUWA';

function FanCard({ id, r0, r1, x0, x1, p, z }: (typeof FAN)[number] & { p: MotionValue<number>; z: number }) {
  const a = byId(id)!;
  const rotate = useTransform(p, [0.05, 0.5], [r0, r1]);
  const x = useTransform(p, [0.05, 0.5], [`${x0}%`, `${x1}%`]);
  const y = useTransform(p, [0, 0.4], ['40%', '0%']);
  return (
    <m.div style={{ rotate, x, y, zIndex: z }} className="absolute bottom-0 left-1/2 w-[34vw] max-w-[260px] -translate-x-1/2 origin-bottom">
      <m.div whileHover={{ y: -24, rotate: 0, scale: 1.04 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
        <Link href={`/artwork/${a.slug}`} data-cursor="view" aria-label={a.title} className="block bg-white p-[3%] shadow-matDeep">
          <div className="relative w-full" style={{ aspectRatio: '4 / 5' }}>
            <Art a={a} fill sizes="260px" className="object-cover" />
          </div>
        </Link>
      </m.div>
    </m.div>
  );
}

function Letter({ ch, i, p }: { ch: string; i: number; p: MotionValue<number> }) {
  const s = 0.35 + i * 0.045;
  const y = useTransform(p, [s, s + 0.3], ['105%', '0%']);
  const skew = useTransform(p, [s, s + 0.3], [12, 0]);
  const color = useTransform(p, [s, s + 0.4], ['#3a3a3a', '#ffffff']);
  return (
    <span className="inline-block overflow-hidden align-bottom leading-[0.8]">
      <m.span style={{ y, skewX: skew, color }} className="inline-block origin-bottom-left will-change-transform">{ch}</m.span>
    </span>
  );
}

function FitWordmark({ p }: { p: MotionValue<number> }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(160);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      // measure at a known size, then scale so the word spans exactly 100% of the container
      const probe = document.createElement('span');
      probe.textContent = WORD;
      probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:700 100px var(--font-display);letter-spacing:-0.04em;text-transform:uppercase';
      document.body.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      if (w) setSize((el.clientWidth / w) * 100);
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="w-full overflow-hidden" aria-hidden>
      <div className="whitespace-nowrap font-display font-bold uppercase leading-[0.8] tracking-tightest" style={{ fontSize: size }}>
        {WORD.split('').map((c, i) => <Letter key={i} ch={c} i={i} p={p} />)}
      </div>
    </div>
  );
}

export default function Footer() {
  const { ref, progress } = useSeqProgress<HTMLElement>(['start end', 'end end']);
  return (
    <footer ref={ref} id="contact" className="relative bg-night pt-24 text-white">
      <div className="page-pad">
        <div className="relative mx-auto h-[300px] max-w-[760px] md:h-[380px]">
          {FAN.map((f, i) => <FanCard key={f.id} {...f} p={progress} z={i === 1 ? 3 : 1} />)}
        </div>

        <nav aria-label="Footer" className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="label transition-opacity hover:opacity-60">{l.label}</Link>
          ))}
        </nav>

        <div className="mx-auto mt-10 grid max-w-[900px] gap-8 md:grid-cols-[1.3fr_1fr]">
          <Newsletter />
          <div className="text-[13px] text-white/60 md:text-right">
            <p>hello@duluwa.art</p>
            <p className="mt-1">
              <a href="https://www.instagram.com/duluwa_art/" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>{' · '}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a>{' · '}
              <a href="https://wa.me/9779800000000" target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp</a>
            </p>
            <p className="mt-4 label text-white/40">© 2026 Duluwa Art — Nepal</p>
          </div>
        </div>
      </div>
      <div className="mt-14 px-[var(--pad)] pb-2">
        <FitWordmark p={progress} />
      </div>
    </footer>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const toast = useStore((s) => s.toast);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // INTEGRATION STUB: send `email` to your newsletter provider (Mailchimp / Resend / Buttondown).
        setDone(true);
        toast('Thank you — new paintings will find you first.');
      }}
      className="flex border-b border-white/30"
    >
      <label htmlFor="nl" className="sr-only">Email address</label>
      <input id="nl" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={done ? 'Subscribed ✓' : 'Email for new paintings'} disabled={done}
        className="w-full bg-transparent py-3 text-[14px] outline-none placeholder:text-white/40" />
      <button type="submit" disabled={done} className="label whitespace-nowrap px-2 py-3 hover:text-accent">Join →</button>
    </form>
  );
}
