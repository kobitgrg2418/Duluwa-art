'use client';
import { useEffect, useState } from 'react';
import { m, useMotionValue, useSpring } from 'framer-motion';
import { SPRING_CURSOR } from '@/lib/motion';
import { useFinePointer } from '@/hooks/useFinePointer';

type Mode = 'default' | 'view' | 'drag' | 'add' | 'link' | 'text' | 'hide';
const LABEL: Partial<Record<Mode, string>> = { view: 'View', drag: 'Drag', add: 'Add +' };

/** Global spring-follow cursor. Elements opt in with data-cursor="view|drag|add|text|hide". */
export default function Cursor() {
  const fine = useFinePointer();
  const [mode, setMode] = useState<Mode>('default');
  const [shown, setShown] = useState(false);
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, SPRING_CURSOR);
  const y = useSpring(my, SPRING_CURSOR);

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add('has-cursor');
    const move = (e: PointerEvent) => { mx.set(e.clientX); my.set(e.clientY); setShown(true); };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest<HTMLElement>('[data-cursor]');
      if (el) return setMode(el.dataset.cursor as Mode);
      if (t?.closest('input,textarea,select')) return setMode('hide');
      if (t?.closest('a,button,[role="button"],label')) return setMode('link');
      if (t?.closest('h1,h2,h3,p')) return setMode('text');
      setMode('default');
    };
    const leave = () => setShown(false);
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [fine, mx, my]);

  if (!fine) return null;
  const label = LABEL[mode];
  const size = label ? 84 : mode === 'link' ? 36 : mode === 'text' ? 6 : mode === 'hide' ? 0 : 12;

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference"
      style={{ x, y, opacity: shown ? 1 : 0 }}
    >
      <m.div
        className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-white text-black"
        animate={{ width: size, height: size, borderRadius: label || mode === 'link' ? 999 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {label && <span className="label !text-[10px] font-semibold text-black">{label}</span>}
      </m.div>
    </m.div>
  );
}
