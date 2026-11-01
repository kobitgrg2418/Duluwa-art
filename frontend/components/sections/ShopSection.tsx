'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';
import { useCatalog } from '@/context/CatalogContext';
import type { Artwork } from '@/lib/types';
import ArtworkCard from '@/components/cards/ArtworkCard';
import CountHeader from '@/components/ui/CountHeader';
import SplitText from '@/components/motion/SplitText';
import Marquee from '@/components/motion/Marquee';
import MagneticButton from '@/components/motion/MagneticButton';
import { EASE } from '@/lib/motion';
import type { ShopSectionAPI } from '@/lib/api-types';

const ROW = 'md:h-[clamp(360px,37vw,640px)]';
const CARD = 'aspect-[4/5] md:aspect-auto md:h-full';

/** wide slot gets a landscape piece, narrow slot a portrait one */
function rhythm(list: Artwork[]): Artwork[] {
  const l = list.slice();
  const wi = l.findIndex((a) => a.orientation === 'landscape');
  const wide = wi >= 0 ? l.splice(wi, 1)[0] : l.shift()!;
  const ni = l.findIndex((a) => a.orientation === 'portrait');
  const narrow = ni >= 0 ? l.splice(ni, 1)[0] : l.shift()!;
  return [wide, narrow, ...l];
}

function RhythmGrid({ list }: { list: Artwork[] }) {
  const [wide, narrow, ...rest] = rhythm(list).slice(0, 5);
  return (
    <div className="mt-4 flex flex-col gap-3 md:gap-4">
      <div className={`grid gap-3 md:grid-cols-12 md:gap-4 ${ROW}`}>
        <div className="md:col-span-8"><ArtworkCard a={wide} index={0} className={CARD} sizes="(min-width:768px) 66vw, 100vw" /></div>
        <div className="md:col-span-4"><ArtworkCard a={narrow} index={1} className={CARD} sizes="(min-width:768px) 33vw, 100vw" /></div>
      </div>
      {rest.length > 0 && (
        <div className={`grid gap-3 md:grid-cols-3 md:gap-4 ${ROW}`}>
          {rest.map((a, i) => <ArtworkCard key={a.id} a={a} index={i} className={CARD} sizes="(min-width:768px) 33vw, 100vw" />)}
        </div>
      )}
    </div>
  );
}

export default function ShopSection({ shop }: { shop: ShopSectionAPI }) {
  const ref = useRef<HTMLElement>(null);
  const { byId, artworks } = useCatalog();

  const originals = shop.originals.items.map(id => byId(id)).filter((a): a is Artwork => a !== undefined);
  const prints = shop.prints.items.map(id => byId(id)).filter((a): a is Artwork => a !== undefined);
  const justPainted = shop.just_painted.items.map(id => byId(id)).filter((a): a is Artwork => a !== undefined);

  // Fallback to using all artworks if API data is empty (build time)
  const displayOriginals = originals.length > 0 ? originals : artworks.filter(a => a.type === 'original' && a.status === 'available').slice(0, 5);
  const displayPrints = prints.length > 0 ? prints : artworks.filter(a => a.type === 'print').slice(0, 5);
  const displayJustPainted = justPainted.length > 0 ? justPainted : artworks.filter(a => a.justPainted).slice(0, 3);

  return (
    <section ref={ref} className="relative bg-paper pb-24" aria-labelledby="shop-title">
      <Marquee className="border-y border-ink/10 py-3" items={['Free worldwide shipping on originals', 'Original watercolors', 'Signed & certified', 'Painted in Nepal', 'Prints on archival paper']} />

      <div className="page-pad">
        <div className="flex flex-col items-start justify-between gap-6 pb-6 pt-20 sm:flex-row sm:items-end md:pt-28">
          <h2 id="shop-title" className="display" aria-label="The collection">
            <SplitText text={shop.title[0]} by="char" className="block" />
            <SplitText text={shop.title[1]} by="char" className="block" delay={0.15} />
          </h2>
          <MagneticButton><Link href="/shop" className="btn mb-2" data-cursor="hide">View all</Link></MagneticButton>
        </div>
        <m.div className="h-px origin-left bg-ink/25" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} />

        {displayOriginals.length > 0 && (
          <>
            <CountHeader label={shop.originals.label} count={shop.originals.count || displayOriginals.length} />
            <RhythmGrid list={displayOriginals} />
            <div className="mt-6 text-right"><Link href="/shop?type=original" className="label underline-offset-4 hover:underline">All originals →</Link></div>
          </>
        )}

        {displayPrints.length > 0 && (
          <>
            <CountHeader label={shop.prints.label} count={shop.prints.count || displayPrints.length} />
            <RhythmGrid list={displayPrints} />
            <div className="mt-6 text-right"><Link href="/shop?type=print" className="label underline-offset-4 hover:underline">All prints →</Link></div>
          </>
        )}

        {displayJustPainted.length > 0 && (
          <>
            <CountHeader label={shop.just_painted.label} count={shop.just_painted.count || displayJustPainted.length} />
            <div className={`mt-4 grid gap-3 md:grid-cols-3 md:gap-4 ${ROW}`}>
              {displayJustPainted.map((a, i) => <ArtworkCard key={a.id} a={a} index={i} className={CARD} sizes="(min-width:768px) 33vw, 100vw" />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
