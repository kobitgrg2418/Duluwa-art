import type { Metadata } from 'next';
import { collections } from '@/data/collections';
import { artworks } from '@/data/artworks';
import PageHead from '@/components/ui/PageHead';
import CollectionCard from '@/components/cards/CollectionCard';
import Reveal from '@/components/motion/Reveal';

export const metadata: Metadata = { title: 'Collections', description: 'Four series of Himalayan watercolors: faces, paths, small wild lives and portraits of youth.' };

export default function CollectionsPage() {
  return (
    <>
      <PageHead eyebrow="Series" title="Collections" intro="Four ongoing series. Each one is a way of looking at the same place." />
      <div className="page-pad grid gap-3 pb-28 md:grid-cols-2 md:gap-4">
        {collections.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 2) * 0.1}>
            <CollectionCard c={c} count={artworks.filter((a) => a.series === c.slug).length} className="aspect-[4/5] md:aspect-[5/4]" sizes="(min-width:768px) 50vw, 100vw" />
            <p className="mt-3 max-w-[440px] text-[14px] text-ink/65">{c.intro}</p>
          </Reveal>
        ))}
      </div>
    </>
  );
}
