"use client";

import { useRevealEngine, useParallaxEngine } from "@/components/atoms";
import { Nav } from "@/components/nav";
import { LightboxProvider } from "@/components/lightbox";
import { Hero } from "@/components/hero";
import { Featured } from "@/components/featured";
import { CollectionsPreview } from "@/components/collections-preview";
import { ArtistStory } from "@/components/artist-story";
import { Process } from "@/components/process";
import { Testimonials } from "@/components/testimonials";
import { AboutSection } from "@/components/about-section";
import { CommissionSection } from "@/components/commission-section";
import { Footer } from "@/components/footer";
import type { Artwork, Collection, ProcessStep, SiteMedia, Testimonial } from "@/lib/data";

interface Props {
  artworks: Artwork[];
  collections: Collection[];
  process: ProcessStep[];
  testimonials: Testimonial[];
  siteMedia: SiteMedia[];
}

export function HomeClient({ artworks, collections, process, testimonials, siteMedia }: Props) {
  useRevealEngine();
  useParallaxEngine();

  const mediaMap = Object.fromEntries(siteMedia.map((m) => [m.key, m.value]));

  return (
    <LightboxProvider items={artworks}>
      <Nav onDark />
      <main>
        <Hero heroImage={mediaMap.hero_image} />
        <Featured artworks={artworks} collections={collections} />
        <CollectionsPreview collections={collections} artworks={artworks} />
        <ArtistStory artworks={artworks} />
        <Process steps={process} />
        <Testimonials testimonials={testimonials} />
        <AboutSection />
        <CommissionSection />
      </main>
      <Footer />
    </LightboxProvider>
  );
}
