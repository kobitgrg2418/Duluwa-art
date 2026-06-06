export const revalidate = 60;

import { getArtworks, getCollections, getProcess, getTestimonials, getSiteMedia } from "@/lib/store";
import { HomeClient } from "@/components/home-client";

export default async function HomePage() {
  const [artworks, collections, process, testimonials, siteMedia] = await Promise.all([
    getArtworks(),
    getCollections(),
    getProcess(),
    getTestimonials(),
    getSiteMedia(),
  ]);

  return (
    <HomeClient
      artworks={artworks}
      collections={collections}
      process={process}
      testimonials={testimonials}
      siteMedia={siteMedia}
    />
  );
}
