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
import { CommissionSection } from "@/components/commission-section";
import { Footer } from "@/components/footer";
import type { Artwork, Collection, ProcessStep, Testimonial } from "@/lib/data";

interface Props {
  artworks: Artwork[];
  collections: Collection[];
  process: ProcessStep[];
  testimonials: Testimonial[];
}

export function HomeClient({ artworks, collections, process, testimonials }: Props) {
  useRevealEngine();
  useParallaxEngine();

  return (
    <LightboxProvider items={artworks}>
      <Nav onDark />
      <main>
        <Hero />
        <Featured artworks={artworks} />
        <CollectionsPreview collections={collections} artworks={artworks} />
        <ArtistStory artworks={artworks} />
        <Process steps={process} />
        <Testimonials testimonials={testimonials} />
        <CommissionSection />
      </main>
      <Footer />
    </LightboxProvider>
  );
}
