'use client';
import { m, useTransform } from 'framer-motion';
import type { MotionValue as MV } from 'framer-motion';
import { useSeqProgress } from '@/hooks/useSeqProgress';
import { useCatalog } from '@/context/CatalogContext';
import Art from '@/components/ui/Art';
import SplitText from '@/components/motion/SplitText';
import { useStore } from '@/store/useStore';
import type { Artwork } from '@/lib/types';
import type { MotionValue } from 'framer-motion';
import type { HeroAPI } from '@/lib/api-types';

// left (vw), width (vw), start offset below the fold (vh), speed factor (higher = quicker)
const LAYERS_DEFAULT = [
  { id: 'child-with-bowl', left: 6, w: 19, start: 52, speed: 1.0, mobile: true },
  { id: 'village-machhapuchhre', left: 62, w: 27, start: 88, speed: 1.4, mobile: true },
  { id: 'bearded-elder', left: 33, w: 22, start: 120, speed: 0.7, mobile: false },
  { id: 'ceremonial-headdress', left: 25, w: 15, start: 150, speed: 1.1, mobile: true },
  { id: 'two-sparrows', left: 3, w: 25, start: 175, speed: 1.6, mobile: false },
  { id: 'bison', left: 42, w: 16, start: 200, speed: 0.9, mobile: true },
  { id: 'mountain-hut', left: 16, w: 26, start: 228, speed: 1.25, mobile: false },
  { id: 'young-woman-clasped', left: 60, w: 14, start: 255, speed: 0.8, mobile: true },
];

const HEAD_DEFAULT = ['Duluwa Art showcases', 'Himalayan life in', 'water, pigment', 'and light'];

function Layer({ L, i, p, reduced }: { L: { id: string; left: number; w: number; start: number; speed: number; mobile: boolean }; i: number; p: MotionValue<number>; reduced: boolean }) {
  const { byId } = useCatalog();
  const a = byId(L.id);
  const p1 = Math.min(0.62, 0.5 / L.speed + 0.12);
  const y = useTransform(p, [0, p1], reduced ? [`${12 + i * 7}vh`, `${12 + i * 7}vh`] : [`${L.start}vh`, '-75vh']);
  if (!a) return null;
  return (
    <m.div
      style={{ y, left: `${L.left}vw`, width: `${L.w}vw` }}
      className={'absolute top-0 will-change-transform ' + (L.mobile ? '' : 'hidden md:block')}
      aria-hidden
    >
      <div className="relative bg-white shadow-mat" style={{ aspectRatio: a.aspect }}>
        <Art a={a} fill sizes="(min-width:768px) 27vw, 40vw" className="object-cover" priority={i < 2} alt="" />
      </div>
    </m.div>
  );
}

/** One headline line: types in per character, then flings out on scroll (slide + skew + stretch). */
function KineticLine({ text, i, p, ready, reduced }: { text: string; i: number; p: MV<number>; ready: boolean; reduced: boolean }) {
  const dir = i % 2 === 0 ? -1 : 1;
  const a = 0.03 + i * 0.045;
  const b = a + 0.22;
  const x = useTransform(p, [a, b], reduced ? ['0vw', '0vw'] : ['0vw', `${dir * 85}vw`]);
  const y = useTransform(p, [a, b], reduced ? ['0vh', '0vh'] : ['0vh', `${(i % 2 ? 1 : -1) * 22}vh`]);
  const skew = useTransform(p, [a, b], reduced ? [0, 0] : [0, dir * -28]);
  const sy = useTransform(p, [a, b], reduced ? [1, 1] : [1, 1.7]);
  const opacity = useTransform(p, [a + 0.08, b], [1, 0]);
  return (
    <m.span style={{ x, y, skewX: skew, scaleY: sy, opacity }} className="block origin-center will-change-transform">
      <SplitText text={text} by="char" play={ready} stagger={0.018} delay={0.1 + i * 0.12} as="span" className="block" />
    </m.span>
  );
}

export default function Hero({ hero }: { hero: HeroAPI }) {
  const { ref, progress: p, reduced } = useSeqProgress<HTMLElement>(['start start', 'end end']);
  const ready = useStore((s) => s.ready);
  const { byId } = useCatalog();

  // Use API data if available, otherwise use fallback
  const LAYERS = hero.layers && hero.layers.length > 0
    ? hero.layers.map(l => ({
        id: l.artwork,
        left: l.left_vw,
        w: l.width_vw,
        start: l.start_vh,
        speed: l.speed,
        mobile: l.show_on_mobile,
      }))
    : LAYERS_DEFAULT;

  const HEAD = hero.lines && hero.lines.length > 0 ? hero.lines : HEAD_DEFAULT;
  const finale = hero.finale_artwork ? byId(hero.finale_artwork) : byId('yak-caravan');
  const TAGLINE = hero.tagline || 'Watercolors from the Himalaya — painted in Nepal, shipped to your wall.';
  const SCROLL_HINT = hero.scroll_hint || 'Scroll';

  const clip = useTransform(p, [0.52, 0.9], ['inset(36% 40% 36% 40%)', 'inset(0% 0% 0% 0%)']);
  const finOpacity = useTransform(p, [0.46, 0.56], [0, 1]);
  const finY = useTransform(p, [0.46, 0.6], ['14vh', '0vh']);
  const hint = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <section ref={ref} className={reduced ? 'relative h-[115vh]' : 'relative h-[300vh]'} aria-label="Introduction">
      <div className="sticky top-0 h-screen overflow-hidden bg-paper">
        {LAYERS.map((L, i) => <Layer key={L.id} L={L} i={i} p={p} reduced={!!reduced} />)}

        {!reduced && finale && (
          <m.div style={{ clipPath: clip, opacity: finOpacity, y: finY }} className="absolute inset-0 will-change-[clip-path]" aria-hidden>
            <div className="absolute inset-0 scale-[1.22]">
              <Art a={finale} fill sizes="100vw" className="object-cover" alt="" />
            </div>
          </m.div>
        )}

        {/* pinned headline — difference blend inverts letters where paintings pass beneath */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-[var(--pad)] text-center text-white mix-blend-difference">
          <h1 className="font-display text-[clamp(2.1rem,7.4vw,8.2rem)] font-bold uppercase leading-[0.9] tracking-tightest" aria-label={HEAD.join(' ')}>
            {HEAD.map((t, i) => <KineticLine key={t} text={t} i={i} p={p} ready={ready} reduced={!!reduced} />)}
          </h1>
        </div>

        <m.div style={{ opacity: hint }} className="absolute bottom-6 left-[var(--pad)] z-20 flex items-center gap-3 text-white mix-blend-difference">
          <span className="label">{SCROLL_HINT}</span>
          <span className="relative block h-10 w-px overflow-hidden bg-white/30"><span className="scroll-line absolute inset-0 bg-white" /></span>
        </m.div>
        <m.p style={{ opacity: hint }} className="label absolute bottom-6 right-[var(--pad)] z-20 hidden max-w-[260px] text-right text-white mix-blend-difference md:block">
          {TAGLINE}
        </m.p>
      </div>
    </section>
  );
}
