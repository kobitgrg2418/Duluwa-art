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
import Footer from '@/components/sections/Footer';

const display = localFont({ src: './fonts/inter-tight-latin-wght-normal.woff2', variable: '--font-display', weight: '100 900', display: 'swap' });
const body = localFont({ src: './fonts/inter-latin-wght-normal.woff2', variable: '--font-body', weight: '100 900', display: 'swap' });
const serif = localFont({ src: './fonts/instrument-serif-latin-400-italic.woff2', variable: '--font-serif', weight: '400', style: 'italic', display: 'swap' });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://duluwa.art';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Duluwa Art — Himalayan watercolors by Kobit Gurung', template: '%s — Duluwa Art' },
  description: 'Watercolors from the Himalaya — painted in Nepal, shipped to your wall. Original paintings and limited prints by Kobit Gurung.',
  openGraph: { type: 'website', siteName: 'Duluwa Art', images: ['/artworks/yak-caravan-1600.webp'] },
  twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { themeColor: '#f4f1ec' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable}`}>
      <body className="grain">
        <LazyMotion features={domMax}>
          <StoreHydrator />
          <SmoothScroll>
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:bg-ink focus:px-3 focus:py-2 focus:text-white">Skip to content</a>
            <Header />
            <MenuOverlay />
            <CartDrawer />
            <SearchOverlay />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>
          <Cursor />
          <FlyLayer />
          <ToastHost />
          <PageTransition />
          <Preloader />
        </LazyMotion>
      </body>
    </html>
  );
}
