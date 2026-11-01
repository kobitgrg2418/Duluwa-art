'use client';
import Link from 'next/link';
import clsx from 'clsx';
import { m, type MotionValue, type MotionStyle } from 'framer-motion';
import type { Collection } from '@/lib/types';
import { useCatalog } from '@/context/CatalogContext';
import Art from '@/components/ui/Art';
import Chip from '@/components/ui/Chip';

interface Props {
  c: Collection;
  count: number;
  className?: string;
  /** scroll-linked grayscale amount (1 = grey). Hover always colourises. */
  gray?: MotionValue<number>;
  style?: MotionStyle;
  sizes?: string;
}

export default function CollectionCard({ c, count, className, gray, style, sizes = '(min-width:1024px) 25vw, 100vw' }: Props) {
  const { byId } = useCatalog();
  const art = byId(c.cover);
  if (!art) return null;
  const gs = gray ? ({ ['--gs' as string]: gray } as MotionStyle) : undefined;
  return (
    <m.div style={{ ...style, ...gs }} className={clsx('cc group relative overflow-hidden bg-panel text-white', className)}>
      <Link href={`/collections/${c.slug}`} data-cursor="view" className="absolute inset-0 block" aria-label={`${c.title}, ${count} works`}>
        <div className="cc-img absolute inset-0 scale-[1.22] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.3]">
          <Art a={art} fill sizes={sizes} className="object-cover" alt={`${c.title} series cover: ${art.title}`} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Chip>Series</Chip>
          <Chip>{count} works</Chip>
        </div>
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
          <h3 className="font-display text-lg font-semibold uppercase leading-none tracking-tight md:text-xl">{c.title}</h3>
          <span className="label shrink-0 pb-0.5">{count} works →</span>
        </div>
      </Link>
    </m.div>
  );
}
