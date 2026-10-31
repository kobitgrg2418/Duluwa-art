'use client';
import { useRef } from 'react';
import { m, useMotionValue, useSpring } from 'framer-motion';
import { SPRING_MAGNETIC } from '@/lib/motion';

/** Pulls toward the cursor within ~80px, springs back on leave. */
export default function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), SPRING_MAGNETIC);
  const y = useSpring(useMotionValue(0), SPRING_MAGNETIC);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < Math.max(r.width, r.height) / 2 + 80) {
      x.set(dx * 0.3);
      y.set(dy * 0.3);
    }
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <m.div ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className={className ?? 'inline-block'}>
      {children}
    </m.div>
  );
}
