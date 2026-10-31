import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts } from '@/data/journal';
import { byId } from '@/data/artworks';
import PageHead from '@/components/ui/PageHead';
import Art from '@/components/ui/Art';
import Reveal from '@/components/motion/Reveal';
import type { Artwork } from '@/lib/types';

export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const p = posts.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const a = byId(p.cover) as Artwork;
  return (
    <>
      <PageHead eyebrow={`${p.tag} · ${new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`} title={p.title} />
      <article className="page-pad grid gap-10 pb-28 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <div className="relative bg-card p-[10%]"><div className="relative bg-white shadow-matDeep" style={{ aspectRatio: a.aspect }}><Art a={a} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" /></div></div>
        </Reveal>
        <Reveal className="space-y-5 text-[16px] leading-relaxed text-ink/80 md:col-span-5 md:col-start-8" delay={0.1}>
          {p.body.map((t, i) => <p key={i}>{t}</p>)}
          <Link href={`/artwork/${a.slug}`} className="btn mt-4">See the painting</Link>
        </Reveal>
      </article>
    </>
  );
}
