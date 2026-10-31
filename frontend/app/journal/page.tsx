import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/data/journal';
import { byId } from '@/data/artworks';
import PageHead from '@/components/ui/PageHead';
import Art from '@/components/ui/Art';
import Chip from '@/components/ui/Chip';
import Reveal from '@/components/motion/Reveal';
import type { Artwork } from '@/lib/types';

export const metadata: Metadata = { title: 'Journal', description: 'Notes on process, series and caring for watercolors.' };

export default function JournalPage() {
  return (
    <>
      <PageHead eyebrow="Journal" title="Journal" intro="Notes from the studio." />
      <div className="page-pad grid gap-3 pb-28 md:grid-cols-3 md:gap-4">
        {posts.map((p, i) => {
          const a = byId(p.cover) as Artwork;
          return (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link href={`/journal/${p.slug}`} data-cursor="view" className="group block bg-card">
                <div className="art-stage relative aspect-[4/5]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative bg-white shadow-mat transition-transform duration-700 group-hover:scale-[1.04]" style={{ aspectRatio: a.aspect, width: `min(78cqw, calc(62cqh * ${a.aspect.toFixed(3)}))` }}>
                      <Art a={a} fill sizes="(min-width:768px) 30vw, 100vw" className="object-cover" />
                    </div>
                  </div>
                  <div className="absolute left-3 top-3"><Chip>{p.tag}</Chip></div>
                </div>
                <div className="p-4">
                  <p className="label text-mute">{new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <h2 className="mt-1 font-display text-xl font-semibold uppercase leading-tight tracking-tight">{p.title}</h2>
                  <p className="mt-2 text-sm text-ink/65">{p.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
