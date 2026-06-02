"use client";

import { useRevealEngine, useParallaxEngine } from "@/components/atoms";
import { Nav } from "@/components/nav";
import { LightboxProvider } from "@/components/lightbox";
import { Hero } from "@/components/hero";
import { Featured } from "@/components/featured";
import { CollectionsPreview } from "@/components/collections-preview";
import { ArtistStory } from "@/components/artist-story";
import { Exhibition } from "@/components/exhibition";
import { Process } from "@/components/process";
import { VideoShowcase } from "@/components/video-showcase";
import { Testimonials } from "@/components/testimonials";
import { CommissionSection } from "@/components/commission-section";
import { Footer } from "@/components/footer";
import { ARTWORKS } from "@/lib/data";

export default function HomePage() {
  useRevealEngine();
  useParallaxEngine();

  return (
    <LightboxProvider items={ARTWORKS}>
      <Nav onDark />
      <main>
        <Hero />
        <Featured />
        <CollectionsPreview />
        <ArtistStory />
        <Exhibition />
        <Process />
        <VideoShowcase />
        <Testimonials />
        <CommissionSection />
      </main>
      <Footer />
    </LightboxProvider>
  );
}
