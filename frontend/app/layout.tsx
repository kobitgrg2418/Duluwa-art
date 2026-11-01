import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import { LazyMotion, domMax } from 'framer-motion';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Cursor from '@/components/motion/Cursor';
import PageTransition from '@/components/motion/PageTransition';
import Header from '@/components/layout/Header';
import MenuOverlay from '@/components/layout/MenuOverlay';
import CartDrawer from '@/components/layout/CartDrawer';
import SearchOverlay from '@/components/layout/SearchOverlay';
import Preloader from '@/components/layout/Preloader';
import ToastHost from '@/components/layout/ToastHost';
import FlyLayer from '@/components/layout/FlyLayer';
import StoreHydrator from '@/components/layout/StoreHydrator';
import Announcement from '@/components/layout/Announcement';
import { CatalogProvider } from '@/context/CatalogContext';
import { getSite, getArtworks, getCollections, getShopConfig, mapArtwork, mapCollection } from '@/lib/api';
import { artworks as localArtworks } from '@/data/artworks';
import { collections as localCollections } from '@/data/collections';

const display = localFont({ src: './fonts/inter-tight-latin-wght-normal.woff2', variable: '--font-display', weight: '100 900', display: 'swap' });
const body = localFont({ src: './fonts/inter-latin-wght-normal.woff2', variable: '--font-body', weight: '100 900', display: 'swap' });
const serif = localFont({ src: './fonts/instrument-serif-latin-400-italic.woff2', variable: '--font-serif', weight: '400', style: 'italic', display: 'swap' });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://duluwa.art';

async function getCatalogData() {
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production';
  
  // During build, skip API fetch - will be fetched at runtime
  if (isBuild) {
    return { site: null, artworks: localArtworks, collections: localCollections, shopConfig: null };
  }
  
  // Development and production runtime: try to fetch from API
  let site = null;
  let artworks: any[] = localArtworks;
  let collections: any[] = localCollections;
  let shopConfig = null;

  try {
    const siteResult = await getSite();
    if (siteResult) site = siteResult;
  } catch (e) {
    // Silent fallback
  }

  try {
    const artworksResult = await getArtworks({ page_size: 500 });
    if (artworksResult?.results) {
      artworks = artworksResult.results.map(mapArtwork);
    }
  } catch (e) {
    // Silent fallback
  }

  try {
    const collectionsResult = await getCollections();
    if (collectionsResult) {
      collections = collectionsResult.map(mapCollection);
    }
  } catch (e) {
    // Silent fallback
  }

  try {
    const shopConfigResult = await getShopConfig();
    if (shopConfigResult) shopConfig = shopConfigResult;
  } catch (e) {
    // Silent fallback
  }

  return { site, artworks, collections, shopConfig };
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const site = await getSite();
    if (!site) throw new Error('Unable to load site metadata from the API');
    return {
      metadataBase: new URL(SITE),
      title: { default: site.settings.seo_title, template: '%s — Duluwa Art' },
      description: site.settings.seo_description,
      openGraph: { type: 'website', siteName: 'Duluwa Art' },
      twitter: { card: 'summary_large_image' },
    };
  } catch (error) {
    return {
      metadataBase: new URL(SITE),
      title: { default: 'Duluwa Art — Himalayan watercolors by Kobit Gurung', template: '%s — Duluwa Art' },
      description: 'Watercolors from the Himalaya — painted in Nepal, shipped to your wall. Original paintings and limited prints by Kobit Gurung.',
      openGraph: { type: 'website', siteName: 'Duluwa Art' },
      twitter: { card: 'summary_large_image' },
    };
  }
}

export const viewport: Viewport = { themeColor: '#f4f1ec' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site, artworks, collections, shopConfig } = await getCatalogData();

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable}`}>
      <body className="grain">
        <LazyMotion features={domMax}>
          <CatalogProvider
            initialArtworks={artworks}
            initialCollections={collections}
            initialSite={site}
            initialShopConfig={shopConfig}
          >
            <Announcement />
            <StoreHydrator />
            <SmoothScroll>
              <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:bg-ink focus:px-3 focus:py-2 focus:text-white">Skip to content</a>
              <Header />
              <MenuOverlay />
              <CartDrawer />
              <SearchOverlay />
              <main id="main">{children}</main>
            </SmoothScroll>
            <Cursor />
            <FlyLayer />
            <ToastHost />
            <PageTransition />
            <Preloader />
          </CatalogProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
