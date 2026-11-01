'use client';
import { createContext, useContext, useMemo } from 'react';
import type { Artwork } from '@/lib/types';
import type { Catalog } from '@/lib/api';
import { setRate } from '@/lib/price';
import { setShopConfig } from '@/lib/prints';

interface Ctx extends Catalog {
  byId: (id: string) => Artwork | undefined;
  bySlug: (slug: string) => Artwork | undefined;
}
const C = createContext<Ctx | null>(null);

export function CatalogProvider({ value, children }: { value: Catalog; children: React.ReactNode }) {
  // keep the pure helpers (price conversion, print options) in sync with the CMS before children render
  setRate(value.shop.rate);
  setShopConfig(value.shop);
  const ctx = useMemo<Ctx>(() => {
    const map = new Map<string, Artwork>();
    const add = (a: Artwork | null | undefined) => { if (a) map.set(a.id, a); };
    value.artworks.forEach(add);
    // artworks referenced by the home page may be unpublished from the shop; still resolvable
    value.home.hero.layers.forEach((l) => add(l.artwork));
    add(value.home.hero.finale); add(value.home.care.tall); add(value.home.care.wide); add(value.home.quote.artwork);
    value.home.fan.forEach(add);
    return { ...value, byId: (id) => map.get(id), bySlug: (s) => map.get(s) };
  }, [value]);
  return <C.Provider value={ctx}>{children}</C.Provider>;
}

export function useCatalog(): Ctx {
  const c = useContext(C);
  if (!c) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return c;
}
