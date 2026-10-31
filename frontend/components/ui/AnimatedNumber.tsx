'use client';
import { useEffect } from 'react';
import { animate, m, useMotionValue, useTransform } from 'framer-motion';
import { money } from '@/lib/price';
import type { Currency } from '@/store/useStore';

/** Price that ticks to its new value. */
export default function AnimatedNumber({ npr, currency, className }: { npr: number; currency: Currency; className?: string }) {
  const mv = useMotionValue(npr);
  const text = useTransform(mv, (v) => money(Math.round(v), currency));
  useEffect(() => {
    const c = animate(mv, npr, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [npr, mv]);
  return <m.span className={className}>{text}</m.span>;
}
