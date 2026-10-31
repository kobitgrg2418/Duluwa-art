'use client';
import { m, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/motion';

interface Props {
  text?: string;
  by?: 'char' | 'word' | 'line';
  /** For by="line": pass lines explicitly with `lines`. */
  lines?: string[];
  className?: string;
  delay?: number;
  stagger?: number;
  /** Controlled trigger. When undefined, plays when scrolled into view. */
  play?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
}

/** Masked reveal: each unit rises from 110% inside an overflow-hidden wrapper. */
export default function SplitText({ text, by = 'word', lines, className, delay = 0, stagger, play, as = 'div' }: Props) {
  const reduced = useReducedMotion();
  const Tag = m[as] as typeof m.div;
  const t = text ?? (lines ? lines.join(' ') : '');
  const units: string[] = by === 'line' ? (lines ?? [t]) : by === 'char' ? Array.from(t) : t.split(' ');
  const st = stagger ?? (by === 'char' ? 0.03 : by === 'word' ? 0.06 : 0.12);

  const trigger =
    play === undefined
      ? { whileInView: 'show', viewport: { once: true, margin: '-10%' } }
      : { animate: play ? 'show' : 'hide' };

  return (
    <Tag
      className={className}
      aria-label={t}
      initial="hide"
      variants={{ hide: {}, show: { transition: { staggerChildren: st, delayChildren: delay } } }}
      {...trigger}
    >
      {units.map((u, i) => (
        <span
          key={i}
          aria-hidden
          className={by === 'line' ? 'block overflow-hidden pb-[0.08em] -mb-[0.08em]' : 'inline-block overflow-hidden align-top pb-[0.08em] -mb-[0.08em]'}
        >
          <m.span
            className="inline-block will-change-transform"
            variants={{
              hide: { y: reduced ? 0 : '110%', opacity: reduced ? 0 : 1 },
              show: { y: 0, opacity: 1, transition: { duration: 0.9, ease: EASE } },
            }}
          >
            {u === ' ' ? ' ' : u}
            {by === 'word' && i < units.length - 1 ? ' ' : ''}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}
