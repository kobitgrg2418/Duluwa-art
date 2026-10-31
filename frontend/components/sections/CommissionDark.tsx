'use client';
import Link from 'next/link';
import { m, useTransform } from 'framer-motion';
import { useSeqProgress } from '@/hooks/useSeqProgress';
import { byId } from '@/data/artworks';
import Art from '@/components/ui/Art';
import InfoTile from '@/components/ui/InfoTile';
import Parallax from '@/components/motion/Parallax';
import Reveal from '@/components/motion/Reveal';
import type { Artwork } from '@/lib/types';

export default function CommissionDark() {
  const { ref, progress: p } = useSeqProgress<HTMLElement>(['start end', 'end start']);
  const bg = useTransform(p, [0.1, 0.38], ['#f4f1ec', '#0b0b0b']);
  const hOpacity = useTransform(p, [0.26, 0.42], [0, 1]);
  const hY = useTransform(p, [0.26, 0.42], ['40px', '0px']);
  const tall = byId('young-woman-clasped') as Artwork;
  const wide = byId('village-machhapuchhre') as Artwork;

  return (
    <m.section ref={ref} style={{ backgroundColor: bg }} className="relative text-white" aria-labelledby="care-title">
      <div className="page-pad pb-20 pt-24 md:pt-36">
        <div className="grid gap-12 md:grid-cols-2 md:gap-6">
          <m.div style={{ opacity: hOpacity, y: hY }} className="flex flex-col justify-between gap-10">
            <h2 id="care-title" className="display">Commission<br />&amp; Care</h2>
            <div>
              <p className="mb-6 max-w-[380px] text-[15px] text-white/60">
                Every painting is signed, certified and shipped in archival packaging. Want something made for a specific wall or a specific face? Commission it.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/commission" className="btn btn-light">Commission a painting</Link>
                <a href="mailto:hello@duluwa.art" className="btn btn-ghost">Contact the artist</a>
              </div>
            </div>
          </m.div>
          <div className="grid grid-cols-2 gap-3">
            <InfoTile label="Shipping" value="Worldwide, tracked" sub="Framed or rolled, fully insured." delay={0} />
            <InfoTile label="Payment" value="eSewa · Khalti · Card" sub="Or bank transfer." delay={0.08} />
            <InfoTile label="Authenticity" value="Signed original + certificate" sub="Each piece is 1 of 1." delay={0.16} />
            <InfoTile label="WhatsApp / Email" value="hello@duluwa.art" sub="Replies within a day." delay={0.24} />
          </div>
        </div>

        <div className="mt-16 grid gap-3 md:mt-24 md:grid-cols-12 md:gap-4">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-panel">
              <Parallax speed={7} className="absolute inset-[-8%]">
                <div className="flex h-full w-full items-center justify-center p-[14%]">
                  <div className="relative w-full bg-white shadow-matDeep" style={{ aspectRatio: tall.aspect, maxHeight: '100%' }}>
                    <Art a={tall} fill sizes="(min-width:768px) 40vw, 90vw" className="object-cover" />
                  </div>
                </div>
              </Parallax>
            </div>
          </Reveal>
          <Reveal className="md:col-span-7" delay={0.1}>
            <div className="relative aspect-[16/11] overflow-hidden bg-panel md:mt-[18%]">
              <Parallax speed={9} className="absolute inset-[-10%]">
                <div className="relative h-full w-full scale-[1.15]">
                  <Art a={wide} fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
                </div>
              </Parallax>
            </div>
          </Reveal>
        </div>
      </div>
    </m.section>
  );
}
