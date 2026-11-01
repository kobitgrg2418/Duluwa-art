'use client';
import { m, useTransform, type MotionValue } from 'framer-motion';
import { useSeqProgress } from '@/hooks/useSeqProgress';
import { useCatalog } from '@/context/CatalogContext';
import Art from '@/components/ui/Art';
import type { Artwork } from '@/lib/types';
import type { ArtistAPI } from '@/lib/api-types';

const DROPS = [
  'M50 6 C50 6 82 44 82 66 C82 84 68 94 50 94 C32 94 18 84 18 66 C18 44 50 6 50 6 Z',
  'M50 30 C70 30 94 50 94 68 C94 84 74 94 50 94 C26 94 6 84 6 68 C6 50 30 30 50 30 Z',
  'M50 10 C70 28 90 40 86 66 C82 88 64 94 50 94 C36 94 18 88 14 66 C10 40 30 28 50 10 Z',
  'M50 14 C58 36 76 48 76 68 C76 84 64 94 50 94 C36 94 24 84 24 68 C24 48 42 36 50 14 Z',
  'M50 10 C74 10 90 28 90 52 C90 76 74 92 50 92 C26 92 10 76 10 52 C10 28 26 10 50 10 Z',
];

const DEFAULT_STAGES = [
  { t: 'Sketch', d: 'A few light pencil lines to place the face, the horizon, the weight. Nothing more. Watercolor needs room to breathe.', filter: 'grayscale(1) contrast(3.4) brightness(1.55)', scale: 1, origin: '50% 50%' },
  { t: 'First wash', d: 'Clean water, then the palest pigment, pushed across wet paper. Edges dissolve. This is where the mood is decided.', filter: 'blur(14px) saturate(0.55)', scale: 1, origin: '50% 50%' },
  { t: 'Layers', d: 'Once the paper dries, darker glazes go on, one over another, until shadows have depth and the light has somewhere to live.', filter: 'blur(3.5px) saturate(0.9)', scale: 1, origin: '50% 50%' },
  { t: 'Details', d: 'The eyes, the hands, the fabric. Small brushes, steady breath, and the discipline to stop before it is too much.', filter: 'none', scale: 1.25, origin: '50% 38%' },
  { t: 'Signature', d: 'A red signature in the lower corner, the last mark. After that, the painting belongs to whoever hangs it.', filter: 'none', scale: 2.4, origin: '92% 94%' },
];

function Frame({ i, art, stage }: { i: number; art: Artwork; stage: { title: string; description: string; image?: string } }) {
  const t = stage.title;
  const d = stage.description;
  const filter = i === 0 ? 'grayscale(1) contrast(3.4) brightness(1.55)' : i === 1 ? 'blur(14px) saturate(0.55)' : i === 2 ? 'blur(3.5px) saturate(0.9)' : i === 3 ? 'none' : 'none';
  const scale = i === 4 ? 2.4 : i === 3 ? 1.25 : 1;
  const origin = i === 4 ? '92% 94%' : i === 3 ? '50% 38%' : '50% 50%';
  return (
    <div className="grid h-full w-screen shrink-0 grid-rows-[1fr_auto] items-center gap-4 px-[var(--pad)] pb-24 pt-24 md:grid-cols-2 md:grid-rows-1 md:gap-16 md:pb-16 md:pt-28">
      <div className="order-2 md:order-1">
        <p className="font-display text-[clamp(5rem,16vw,14rem)] font-bold leading-[0.8] tracking-tightest text-white/10">0{i + 1}</p>
        <h3 className="display-md mt-2">{t}</h3>
        <p className="mt-4 max-w-[420px] text-[14px] text-white/60 md:text-[15px]">{s.d}</p>
      </div>
      <div className="order-1 flex h-full max-h-[52vh] items-center justify-center md:order-2 md:max-h-[70vh]">
        <div className="relative h-full overflow-hidden bg-white shadow-matDeep" style={{ aspectRatio: art.aspect }}>
          <div className="absolute inset-0 transition-all" style={{ filter, transform: `scale(${scale})`, transformOrigin: origin }}>
            <Art a={art} fill sizes="(min-width:768px) 40vw, 80vw" className="object-cover" alt={`${t} stage of the painting ${art.title}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Drop({ p }: { p: MotionValue<number> }) {
  const d = useTransform(p, [0, 0.25, 0.5, 0.75, 1], DROPS);
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16 md:h-24 md:w-24" aria-hidden>
      <m.path d={d} fill="var(--accent)" />
    </svg>
  );
}

export default function ProcessSequence({ artist }: { artist?: ArtistAPI }) {
  const { ref, progress: p } = useSeqProgress<HTMLElement>(['start start', 'end end']);
  const { byId } = useCatalog();
  const art = byId(artist?.process_artwork || 'ceremonial-headdress');
  const stages = artist?.stages || DEFAULT_STAGES.map((s, i) => ({ title: s.t, description: s.d }));
  const x = useTransform(p, [0, 1], ['0vw', '-400vw']);
  const line = useTransform(p, [0, 1], [0, 1]);
  const step = useTransform(p, (v) => `0${Math.min(5, Math.floor(v * 5) + 1)} / 05`);

  return (
    <section ref={ref} className="relative h-[450vh] bg-night text-white" aria-label="Painting process">
      <div className="sticky top-0 h-screen overflow-hidden">
        <m.div style={{ x }} className="flex h-full w-[500vw] will-change-transform">
          {stages.map((stage, i) => art && <Frame key={i} i={i} art={art} stage={stage} />)}
        </m.div>
        <div className="pointer-events-none absolute right-[var(--pad)] top-24 z-10 md:top-28"><Drop p={p} /></div>
        <div className="absolute inset-x-[var(--pad)] bottom-8 z-10">
          <div className="mb-2 flex items-center justify-between"><span className="label text-white/50">How a painting is made</span><m.span className="label tabular-nums">{step}</m.span></div>
          <div className="h-px w-full bg-white/20"><m.div style={{ scaleX: line }} className="h-full origin-left bg-white" /></div>
        </div>
      </div>
    </section>
  );
}
