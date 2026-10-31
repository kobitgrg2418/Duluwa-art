'use client';
import { useRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { Artwork } from '@/lib/types';
import Art from '@/components/ui/Art';
import Chip from '@/components/ui/Chip';
import { useStore } from '@/store/useStore';
import { money } from '@/lib/price';
import { printOption, printPrice } from '@/lib/prints';
import { EASE } from '@/lib/motion';

interface Props {
  a: Artwork;
  index?: number;
  /** sizing classes: card must have a definite height (aspect-ratio or h-full) */
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ArtworkCard({ a, index = 0, className = 'aspect-[4/5]', sizes = '(min-width:1024px) 33vw, 100vw', priority }: Props) {
  const ref = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['6%', '-6%']);

  const currency = useStore((s) => s.currency);
  const wished = useStore((s) => s.wishlist.includes(a.id));
  const toggleWish = useStore((s) => s.toggleWish);
  const addLine = useStore((s) => s.addLine);
  const fly = useStore((s) => s.fly);
  const toast = useStore((s) => s.toast);

  const sold = a.status === 'sold';
  const isPrint = a.type === 'print';
  const unit = isPrint ? printPrice(a, 0, 0) : a.priceNPR;
  const shownNPR = isPrint ? unit : a.priceNPR;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const r = imgRef.current?.getBoundingClientRect();
    if (r && !reduced) fly({ image: a.image, aspect: a.aspect, from: { x: r.left, y: r.top, w: r.width, h: r.height } });
    addLine({ key: isPrint ? `${a.id}|${printOption(0, 0)}` : a.id, artworkId: a.id, option: isPrint ? printOption(0, 0) : undefined, unitNPR: unit });
    toast(`“${a.title}” added to cart`);
  };

  // artwork fits the stage via container query units (card keeps its own height)
  const artStyle: React.CSSProperties = {
    aspectRatio: String(a.aspect),
    width: `min(78cqw, calc(66cqh * ${a.aspect.toFixed(4)}))`,
  };

  return (
    <m.article
      ref={ref}
      className={clsx('group relative', className)}
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 3) * 0.08 }}
    >
      <Link
        href={`/artwork/${a.slug}`}
        data-cursor="view"
        aria-label={`${a.title}, ${a.series.replace(/-/g, ' ')}, ${sold ? 'sold' : money(shownNPR, currency)}`}
        className="art-stage absolute inset-0 block overflow-hidden bg-card"
      >
        <div className="absolute inset-0 flex items-center justify-center pb-[7%]">
          <m.div style={{ y }} className="will-change-transform">
            <div
              ref={imgRef}
              style={artStyle}
              className="relative bg-white shadow-mat transition-[transform,box-shadow] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:scale-[1.04] group-hover:shadow-matDeep"
            >
              <Art a={a} fill sizes={sizes} priority={priority} className="object-cover" />
            </div>
          </m.div>
        </div>

        {/* chips */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Chip className={clsx(sold && 'border-accent text-accent')}>
            {sold && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />}
            {sold ? 'Sold' : a.oneOfOne ? '1 of 1' : 'Available'}
          </Chip>
          {[a.type, a.category, `${a.widthCm}×${a.heightCm} cm`].map((t) => (
            <Chip key={t} className="translate-y-1 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-85 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-85">
              {t}
            </Chip>
          ))}
        </div>

        {/* title + price */}
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
          <h3 className="font-display text-[13px] font-semibold uppercase leading-tight tracking-tight md:text-sm">{a.title}</h3>
          <p className="shrink-0 text-right text-[11px] leading-tight">
            <span className="font-semibold">{isPrint ? 'from ' : ''}{money(shownNPR, currency)}</span>
            <span className="block text-mute">{money(shownNPR, currency === 'NPR' ? 'USD' : 'NPR')}</span>
          </p>
        </div>
      </Link>

      {/* controls sit outside the link so we never nest interactives */}
      <button
        type="button"
        onClick={() => toggleWish(a.id)}
        aria-pressed={wished}
        aria-label={wished ? `Remove ${a.title} from saved` : `Save ${a.title}`}
        className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center bg-paper/80 backdrop-blur transition hover:bg-paper"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill={wished ? 'var(--accent)' : 'none'} stroke={wished ? 'var(--accent)' : 'currentColor'} strokeWidth="2"><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.5 3 5 6.4 5c2 0 3.6 1.1 5.6 3.3C14 6.1 15.600 5 17.600 5 21 5 22.800 8.500 21.500 11.700 19.500 16.400 12 21 12 21z" /></svg>
      </button>

      {sold ? (
        <Link
          href={`/commission?similar=${a.slug}`}
          className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 translate-y-2 whitespace-nowrap bg-ink px-3 py-2 text-[10px] font-semibold uppercase tracking-label text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 [@media(hover:none)]:hidden"
        >
          Request similar
        </Link>
      ) : (
        <button
          type="button"
          data-cursor="add"
          onClick={quickAdd}
          className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 translate-y-2 whitespace-nowrap bg-ink px-3 py-2 text-[10px] font-semibold uppercase tracking-label text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 [@media(hover:none)]:hidden"
        >
          Quick add +
        </button>
      )}
    </m.article>
  );
}
