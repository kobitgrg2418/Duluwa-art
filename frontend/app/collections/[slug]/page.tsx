import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { collections, collectionBySlug } from '@/data/collections';
import { artworks } from '@/data/artworks';
import PageHead from '@/components/ui/PageHead';
import Art from '@/components/ui/Art';
import Chip from '@/components/ui/Chip';
import Reveal from '@/components/motion/Reveal';
import Parallax from '@/components/motion/Parallax';

export function generateStaticParams() { return collections.map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = collectionBySlug((await params).slug);
  return c ? { title: c.title, description: c.intro } : {};
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const c = collectionBySlug(slug);
  if (!c) notFound();
  const works = artworks.filter((a) => a.series === c.slug);
  const next = collections[(collections.findIndex((x) => x.slug === c.slug) + 1) % collections.length];
  return (
    <>
      <PageHead eyebrow={`Series · ${works.length} works`} title={c.title} intro={c.intro} />
      <div className="page-pad flex flex-col gap-20 pb-24 md:gap-32">
        {works.map((a, i) => (
          <article key={a.id} className={`grid items-center gap-6 md:grid-cols-12 md:gap-10 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <Link href={`/artwork/${a.slug}`} data-cursor="view" className="group md:col-span-7" aria-label={a.title}>
              <div className="relative aspect-[5/4] overflow-hidden bg-card">
                <Parallax speed={6} className="absolute inset-[-7%]">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="relative bg-white shadow-matDeep transition-transform duration-700 group-hover:scale-[1.03]" style={{ aspectRatio: a.aspect, height: a.aspect < 1 ? '72%' : undefined, width: a.aspect >= 1 ? '66%' : undefined }}>
                      <Art a={a} fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
                    </div>
                  </div>
                </Parallax>
              </div>
            </Link>
            <Reveal className="md:col-span-5">
              <p className="label mb-3 text-mute">{String(i + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}</p>
              <div className="mb-4 flex flex-wrap gap-1.5"><Chip>{a.type}</Chip><Chip>{a.status === 'sold' ? 'sold' : 'available'}</Chip><Chip>{a.widthCm}×{a.heightCm} cm</Chip></div>
              <h2 className="display-md">{a.title}</h2>
              <p className="mt-4 max-w-[420px] text-[15px] text-ink/70">{a.description}</p>
              <Link href={`/artwork/${a.slug}`} className="btn mt-6">View work</Link>
            </Reveal>
          </article>
        ))}
      </div>
      <div className="page-pad border-t border-ink/10 py-16">
        <p className="label mb-3 text-mute">Next series</p>
        <Link href={`/collections/${next.slug}`} className="display-md hover:text-accent">{next.title} →</Link>
      </div>
    </>
  );
}
