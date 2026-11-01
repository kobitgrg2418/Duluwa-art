'use client';
import { useState } from 'react';
import Link from 'next/link';
import { m, useScroll, useMotionValueEvent } from 'framer-motion';
import { useStore, cartCount } from '@/store/useStore';
import { EASE } from '@/lib/motion';
import { useCatalog } from '@/context/CatalogContext';

/** Fixed header. mix-blend-mode: difference keeps it legible over paper, photos and the dark sections. */
export default function Header() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const count = useStore((s) => cartCount(s.lines));
  const menuOpen = useStore((s) => s.menuOpen);
  const setMenu = useStore((s) => s.setMenu);
  const setCart = useStore((s) => s.setCart);
  const setSearch = useStore((s) => s.setSearch);
  const { site } = useCatalog();

  const shipsFromLabel = site?.settings?.header_ships_from_label || 'Ships from';
  const shipsFromValue = site?.settings?.header_ships_from_value || 'Pokhara, Nepal';
  const shippingLabel = site?.settings?.header_shipping_label || 'Worldwide shipping';
  const shippingValue = site?.settings?.header_shipping_value || 'Tracked & insured';
  const wordmark = site?.settings?.wordmark || 'Duluwa';

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    const d = v - prev;
    if (menuOpen) return setHidden(false);
    if (v > 140 && d > 6) setHidden(true);
    else if (d < -4 || v < 140) setHidden(false);
  });

  return (
    <m.header
      className="fixed inset-x-0 top-0 z-[100] text-white mix-blend-difference"
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="page-pad flex items-start justify-between gap-6 pt-4">
        <Link href="/" className="flex items-start gap-1.5" aria-label={`${wordmark} Art — home`}>
          <span className="font-display text-[26px] font-bold uppercase leading-none tracking-tightest md:text-[30px]">{wordmark}</span>
          <span className="label mt-0.5 border border-current px-1 py-[2px] !text-[8px]">Art</span>
        </Link>

        <div className="hidden flex-1 justify-end gap-14 pr-10 md:flex">
          <div>
            <p className="label opacity-60">{shipsFromLabel}</p>
            <p className="label mt-1">{shipsFromValue}</p>
          </div>
          <div>
            <p className="label opacity-60">{shippingLabel}</p>
            <p className="label mt-1">{shippingValue}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setSearch(true)} className="label hidden px-2 py-2 sm:block" aria-label="Search the collection">
            Search
          </button>
          <button
            type="button"
            data-cart-target
            onClick={() => setCart(true)}
            className="label flex items-center gap-2 border border-current px-3 py-[9px]"
            aria-label={`Open cart, ${count} items`}
          >
            Cart
            <m.span key={count} initial={{ scale: 1.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="inline-block min-w-[1ch] tabular-nums">
              {count}
            </m.span>
          </button>
          <button
            type="button"
            onClick={() => setMenu(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="relative h-10 w-10 bg-white"
          >
            <m.span className="absolute left-1/2 top-1/2 block h-[2px] w-[18px] -translate-x-1/2 bg-black" animate={{ y: menuOpen ? 0 : -3, rotate: menuOpen ? 45 : 0 }} />
            <m.span className="absolute left-1/2 top-1/2 block h-[2px] w-[18px] -translate-x-1/2 bg-black" animate={{ y: menuOpen ? 0 : 3, rotate: menuOpen ? -45 : 0 }} />
          </button>
        </div>
      </div>
    </m.header>
  );
}
