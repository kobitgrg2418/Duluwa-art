'use client';
import Link from 'next/link';
import { m, useTransform, type MotionValue } from 'framer-motion';
import { useSeqProgress } from '@/hooks/useSeqProgress';
import { useCatalog } from '@/context/CatalogContext';
import CollectionCard from '@/components/cards/CollectionCard';
import Reveal from '@/components/motion/Reveal';
import type { SeriesAPI } from '@/lib/api-types';

function RisingCard({ i, p, c, count }: { i: number; p: MotionValue<number>; c: any; count: number }) {
  const s = 0.14 + i * 0.1;
  const y = useTransform(p, [s, s + 0.3], ['110vh', '0vh']);
  const gray = useTransform(p, [s + 0.28, s + 0.5], [1, 0.45]);
  return <CollectionCard c={c} count={count} gray={gray} style={{ y }} className="h-full" sizes="25vw" />;
}

export default function Series({ series }: { series: SeriesAPI }) {
  const { ref, progress: p } = useSeqProgress<HTMLDivElement>(['start start', 'end end']);
  const { collections } = useCatalog();
  const hY = useTransform(p, [0.06, 0.5], ['0vh', '-39vh']);
  const hScale = useTransform(p, [0.06, 0.5], [1, 0.4]);
  const btn = useTransform(p, [0.5, 0.6], [0, 1]);

  const mappedCollections = series.items.map(apiItem => collections.find(c => c.slug === apiItem.slug)).filter((c): c is any => c !== undefined);

  return (
    <section className="relative bg-night text-white" aria-labelledby="series-title">
      {/* desktop: pinned sequence */}
      <div ref={ref} className="relative hidden h-[250vh] md:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <m.div style={{ y: hY, scale: hScale }} className="absolute inset-0 flex items-center justify-center will-change-transform">
            <h2 id="series-title" className="display !text-[clamp(5rem,22vw,22rem)]">{series.heading}</h2>
          </m.div>
          <m.div style={{ opacity: btn }} className="absolute right-[var(--pad)] top-[17vh] z-10">
            <Link href="/collections" className="btn btn-light">View all</Link>
          </m.div>
          <div className="absolute inset-x-0 bottom-[5vh] grid h-[62vh] grid-cols-4 gap-3 px-[var(--pad)] lg:gap-4">
            {mappedCollections.map((c, i) => <RisingCard key={c.slug} i={i} p={p} c={c} count={series.items[i]?.artwork_count || 0} />)}
          </div>
        </div>
      </div>

      {/* mobile: stacked */}
      <div className="page-pad py-20 md:hidden">
        <h2 className="display mb-8">{series.heading}</h2>
        <div className="flex flex-col gap-3">
          {mappedCollections.map((c, i) => (
            <Reveal key={c.slug}>
              <CollectionCard c={c} count={series.items[i]?.artwork_count || 0} className="aspect-[4/5]" />
            </Reveal>
          ))}
        </div>
        <Link href="/collections" className="btn btn-light mt-8">View all</Link>
      </div>
    </section>
  );
}
