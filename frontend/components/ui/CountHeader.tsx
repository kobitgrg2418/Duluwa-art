'use client';
import { m, useMotionValue, animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { EASE } from '@/lib/motion';

/** Label left, grey ticking count right, hairline that draws in from the left. */
export default function CountHeader({ label, count }: { label: string; count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const mv = useMotionValue(0);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, count, { duration: 1.1, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, count, mv]);

  return (
    <div ref={ref} className="relative pb-3 pt-10">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-xl font-semibold uppercase tracking-tight md:text-2xl">{label}</h3>
        <span className="font-display text-xl font-semibold tabular-nums text-mute md:text-2xl" aria-label={`${count} works`}>
          {String(n).padStart(2, '0')}
        </span>
      </div>
      <m.span
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-current opacity-20"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: EASE }}
      />
    </div>
  );
}
