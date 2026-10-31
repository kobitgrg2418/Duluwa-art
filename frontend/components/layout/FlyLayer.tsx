'use client';
import Image from 'next/image';
import { m } from 'framer-motion';
import { useStore, type Fly } from '@/store/useStore';
import { EASE_WIPE } from '@/lib/motion';

function Flyer({ f }: { f: Fly }) {
  const endFly = useStore((s) => s.endFly);
  const t = document.querySelector('[data-cart-target]')?.getBoundingClientRect();
  const tx = t ? t.left + t.width / 2 : window.innerWidth - 80;
  const ty = t ? t.top + t.height / 2 : 30;
  const cx = f.from.x + f.from.w / 2;
  const cy = f.from.y + f.from.h / 2;
  return (
    <m.div
      className="pointer-events-none fixed z-[160] bg-white shadow-matDeep"
      style={{ left: f.from.x, top: f.from.y, width: f.from.w, height: f.from.h }}
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{ x: tx - cx, y: ty - cy, scale: 0.08, opacity: 0.6 }}
      transition={{ duration: 0.85, ease: EASE_WIPE }}
      onAnimationComplete={() => endFly(f.id)}
    >
      <Image src={f.image} alt="" fill sizes="120px" className="object-cover" />
    </m.div>
  );
}

/** Thumbnail flies from the card into the header cart. */
export default function FlyLayer() {
  const flies = useStore((s) => s.flies);
  return <>{flies.map((f) => <Flyer key={f.id} f={f} />)}</>;
}
