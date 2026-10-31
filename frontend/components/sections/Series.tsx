'use client';
import Link from 'next/link';
import { m, useTransform, type MotionValue } from 'framer-motion';
import { useSeqProgress } from '@/hooks/useSeqProgress';
import { collections } from '@/data/collections';
import { artworks } from '@/data/artworks';
import CollectionCard from '@/components/cards/CollectionCard';
import Reveal from '@/components/motion/Reveal';

const count = (slug: string) => artworks.filter((a) => a.series === slug).length;

function RisingCard({ i, p }: { i: number; p: MotionValue<number> }) {
  const c = collections[i];
  const s = 0.14 + i * 0.1;
  const y = useTransform(p, [s, s + 0.3], ['110vh', '0vh']);
  const gray = useTransform(p, [s + 0.28, s + 0.5], [1, 0.45]);
  return <CollectionCard c={c} count={count(c.slug)} gray={gray} style={{ y }} className="h-full" sizes="25vw" />;
}

export default function Series() {
  const { ref, progress: p } = useSeqProgress<HTMLDivElement>(['start start', 'end end']);
  const hY = useTransform(p, [0.06, 0.5], ['0vh', '-39vh']);
  const hScale = useTransform(p, [0.06, 0.5], [1, 0.4]);
  const btn = useTransform(p, [0.5, 0.6], [0, 1]);

  return (
    <section className="relative bg-night text-white" aria-labelledby="series-title">
      {/* desktop: pinned sequence */}
      <div ref={ref} className="relative hidden h-[250vh] md:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <m.div style={{ y: hY, scale: hScale }} className="absolute inset-0 flex items-center justify-center will-change-transform">
            <h2 id="series-title" className="display !text-[clamp(5rem,22vw,22rem)]">Series</h2>
          </m.div>
          <m.div style={{ opacity: btn }} className="absolute right-[var(--pad)] top-[17vh] z-10">
            <Link href="/collections" className="btn btn-light">View all</Link>
          </m.div>
          <div className="absolute inset-x-0 bottom-[5vh] grid h-[62vh] grid-cols-4 gap-3 px-[var(--pad)] lg:gap-4">
            {collections.map((c, i) => <RisingCard key={c.slug} i={i} p={p} />)}
          </div>
        </div>
      </div>

      {/* mobile: stacked */}
      <div className="page-pad py-20 md:hidden">
        <h2 className="display mb-8">Series</h2>
        <div className="flex flex-col gap-3">
          {collections.map((c) => (
            <Reveal key={c.slug}>
              <CollectionCard c={c} count={count(c.slug)} className="aspect-[4/5]" />
            </Reveal>
          ))}
        </div>
        <Link href="/collections" className="btn btn-light mt-8">View all</Link>
      </div>
    </section>
  );
}
