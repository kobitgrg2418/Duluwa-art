'use client';
import { useRef } from 'react';
import { m, useAnimationFrame, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';

/** Infinite marquee whose speed reacts to scroll velocity. */
export default function Marquee({ items, className }: { items: string[]; className?: string }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const vel = useRef(0);
  useLenis((l) => { vel.current = l.velocity; });

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const base = 0.04; // %/ms-ish
    const boost = Math.min(Math.abs(vel.current) * 0.02, 0.4);
    const dir = vel.current < 0 ? 1 : -1;
    let next = x.get() + (dir * (base + boost) * delta) / 16.67;
    if (next <= -25) next += 25;
    if (next > 0) next -= 25;
    x.set(next);
  });
  const tx = useTransform(x, (v) => `${v}%`);
  const row = items.concat(items);
  return (
    <div className={'overflow-hidden whitespace-nowrap ' + (className ?? '')} aria-hidden>
      <m.div style={{ x: tx }} className="inline-flex will-change-transform">
        {[0, 1, 2, 3].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={i} className="flex items-center">
                <span className="label px-6">{t}</span>
                <span className="inline-block h-1 w-1 rounded-full bg-current opacity-50" />
              </span>
            ))}
          </div>
        ))}
      </m.div>
    </div>
  );
}
