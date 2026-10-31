'use client';
import { useState } from 'react';
import { m, useTransform, useMotionValueEvent } from 'framer-motion';
import { useSeqProgress } from '@/hooks/useSeqProgress';
import { byId } from '@/data/artworks';
import Art from '@/components/ui/Art';
import SplitText from '@/components/motion/SplitText';
import type { Artwork } from '@/lib/types';

export default function Quote() {
  const { ref, progress: p } = useSeqProgress<HTMLElement>(['start start', 'end end']);
  const [play, setPlay] = useState(false);
  const art = byId('yak-caravan') as Artwork;
  const imgY = useTransform(p, [0, 1], ['-15%', '15%']);
  const cardY = useTransform(p, [0.12, 0.5], ['110vh', '0vh']);
  useMotionValueEvent(p, 'change', (v) => setPlay(v > 0.42));

  return (
    <section ref={ref} className="relative h-[190vh] bg-night" aria-label="Quote">
      <div className="sticky top-0 h-screen overflow-hidden">
        <m.div style={{ y: imgY }} className="absolute inset-[-18%] will-change-transform" aria-hidden>
          <div className="absolute inset-0 scale-[1.5] origin-[50%_35%] grayscale">
            <Art a={art} fill sizes="100vw" className="object-cover" alt="" />
          </div>
        </m.div>
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex items-center justify-center px-[var(--pad)]">
          <m.figure style={{ y: cardY }} className="w-full max-w-[640px] bg-white p-8 text-ink shadow-matDeep md:p-12">
            <blockquote>
              <SplitText
                text="Every brushstroke carries a face, a path, a mountain of home."
                by="word"
                play={play}
                stagger={0.04}
                as="p"
                className="font-display text-[clamp(1.6rem,3.4vw,2.8rem)] font-bold uppercase leading-[0.95] tracking-tightest"
              />
            </blockquote>
            <figcaption className="mt-8 flex items-end justify-between">
              <span className="label text-mute">The artist</span>
              <span className="-rotate-3 font-serif text-4xl italic text-accent md:text-5xl">Kobit Gurung</span>
            </figcaption>
          </m.figure>
        </div>
      </div>
    </section>
  );
}
