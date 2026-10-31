'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { m, useAnimationControls } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { EASE_WIPE } from '@/lib/motion';
import { useStore } from '@/store/useStore';

/**
 * Route transition: a paper-coloured panel wipes up over the page, the route changes
 * underneath it, then the panel wipes away. Intercepts internal <a> clicks.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const controls = useAnimationControls();
  const lenis = useLenis();
  const busy = useRef(false);
  const pending = useRef<string | null>(null);
  const setMenu = useStore((s) => s.setMenu);
  const setCart = useStore((s) => s.setCart);
  const setSearch = useStore((s) => s.setSearch);

  useEffect(() => {
    controls.set({ y: '100%' });
  }, [controls]);

  // Route has changed → reveal.
  useEffect(() => {
    setMenu(false); setCart(false); setSearch(false);
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    if (pending.current) {
      pending.current = null;
      controls.start({ y: '-100%', transition: { duration: 0.8, ease: EASE_WIPE, delay: 0.1 } }).then(() => {
        controls.set({ y: '100%' });
        busy.current = false;
      });
    }
  }, [pathname, controls, lenis, setMenu, setCart, setSearch]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // hash / same page
      e.preventDefault();
      e.stopPropagation(); // keep next/link from navigating before the wipe covers the page
      if (busy.current) return;
      busy.current = true;
      pending.current = url.pathname + url.search;
      controls.start({ y: '0%', transition: { duration: 0.7, ease: EASE_WIPE } }).then(() => {
        setMenu(false); setCart(false); setSearch(false);
        router.push(url.pathname + url.search + url.hash);
        // safety: if the route doesn't change (e.g. only search params), still reveal
        setTimeout(() => {
          if (pending.current) {
            pending.current = null;
            controls.start({ y: '-100%', transition: { duration: 0.8, ease: EASE_WIPE } }).then(() => {
              controls.set({ y: '100%' });
              busy.current = false;
            });
          }
        }, 4000);
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [controls, router, setMenu, setCart, setSearch]);

  return (
    <m.div
      aria-hidden
      animate={controls}
      initial={{ y: '100%' }}
      className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center bg-paper"
    >
      <span className="font-display text-[12vw] font-bold uppercase tracking-tightest text-ink/90">Duluwa</span>
    </m.div>
  );
}
