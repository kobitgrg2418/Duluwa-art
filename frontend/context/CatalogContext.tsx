'use client';
import { createContext, useContext, ReactNode } from 'react';
import type { Artwork, Collection } from '@/lib/types';
import type { SiteAPI, ShopConfigAPI } from '@/lib/api-types';

interface CatalogContextType {
  artworks: Artwork[];
  collections: Collection[];
  site: SiteAPI | null | undefined;
  shopConfig: ShopConfigAPI | null | undefined;
  loading: boolean;
  error: string | null;
  byId: (id: string) => Artwork | undefined;
  bySlug: (slug: string) => Artwork | undefined;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({
  children,
  initialArtworks,
  initialCollections,
  initialSite,
  initialShopConfig,
}: {
  children: ReactNode;
  initialArtworks?: Artwork[];
  initialCollections?: Collection[];
  initialSite?: SiteAPI | null;
  initialShopConfig?: ShopConfigAPI | null;
}) {
  const artworks = initialArtworks || [];
  const collections = initialCollections || [];
  const site = initialSite ?? null;
  const shopConfig = initialShopConfig ?? null;

  const byId = (id: string) => artworks.find((a) => a.id === id);
  const bySlug = (slug: string) => artworks.find((a) => a.slug === slug);

  return (
    <CatalogContext.Provider
      value={{
        artworks,
        collections,
        site,
        shopConfig,
        loading: false,
        error: null,
        byId,
        bySlug,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within CatalogProvider');
  }
  return context;
}
