'use client';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { frame, cancelFrame } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const locked = useStore((s) => s.menuOpen || s.cartOpen || s.searchOpen || s.lightboxOpen);

  useEffect(() => {
    const update = (d: { timestamp: number }) => lenisRef.current?.lenis?.raf(d.timestamp);
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  // Pause Lenis while any overlay is open.
  useEffect(() => {
    const l = lenisRef.current?.lenis;
    if (!l) return;
    if (locked) l.stop();
    else l.start();
  }, [locked]);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.08, smoothWheel: true, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
