import type { Metadata } from 'next';
import PageHead from '@/components/ui/PageHead';
import ProcessSequence from '@/components/sections/ProcessSequence';
import Reveal from '@/components/motion/Reveal';
import Art from '@/components/ui/Art';
import { byId } from '@/data/artworks';
import type { Artwork } from '@/lib/types';
import Link from 'next/link';

export const metadata: Metadata = { title: 'The artist', description: 'Kobit Gurung paints the faces, paths and mountains of Nepal in watercolor.' };

export default function ArtistPage() {
  const a = byId('child-with-bowl') as Artwork;
  return (
    <>
      <PageHead eyebrow="The artist" title="Kobit Gurung" />
      <div className="page-pad grid gap-10 pb-24 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="relative aspect-[4/5] bg-card">
            <div className="absolute inset-[12%] bg-white shadow-matDeep"><Art a={a} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" /></div>
          </div>
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
          {/* Placeholder biography — replace with your own words. */}
          <p className="font-serif text-3xl italic leading-tight md:text-5xl">I paint the people and places I grew up beside.</p>
          <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-ink/75">
            <p>I am a watercolor artist from Pokhara, Nepal, working on cotton paper with a limited palette and a lot of water. My subjects are the faces of elders and children, porters and yaks on high trails, the small wild lives at the edge of villages, and the fishtail peak that watches over all of it.</p>
            <p>Watercolor is honest. It shows hesitation, and it rewards trust. Each painting is a conversation between pigment, paper and the minute I decide to stop.</p>
            <p>Every original is signed in red and shipped with a certificate. Prints are made in small, numbered editions on archival paper.</p>
          </div>
          <div className="mt-8 flex gap-3"><Link href="/shop" className="btn">Shop the work</Link><Link href="/commission" className="btn btn-ghost">Commission a painting</Link></div>
        </Reveal>
      </div>
      <ProcessSequence />
    </>
  );
}
