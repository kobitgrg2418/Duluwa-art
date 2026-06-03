export const dynamic = "force-dynamic";

import { getArtworks, getCollections, getProcess, getTestimonials } from "@/lib/store";
import { HomeClient } from "@/components/home-client";

export default async function HomePage() {
  const [artworks, collections, process, testimonials] = await Promise.all([
    getArtworks(),
    getCollections(),
    getProcess(),
    getTestimonials(),
  ]);

  return (
    <HomeClient
      artworks={artworks}
      collections={collections}
      process={process}
      testimonials={testimonials}
    />
  );
}
