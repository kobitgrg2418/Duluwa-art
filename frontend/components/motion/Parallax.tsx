'use client';
import { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface Props {
  /** Percentage of own height to travel (± speed). */
  speed?: number;
  className?: string;
  children: React.ReactNode;
}

export default function Parallax({ speed = 8, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : [`${speed}%`, `${-speed}%`]);
  return (
    <div ref={ref} className={className}>
      <m.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </m.div>
    </div>
  );
}
