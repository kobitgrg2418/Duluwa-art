import { api } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { HomeClient } from "@/components/home-client";
import type { Artwork, Collection, ProcessStep, SiteMedia, Testimonial } from "@/lib/data";

export default function HomePage() {
  const { data, loading } = useApiData(() =>
    Promise.all([
      api.get("/api/artworks"),
      api.get("/api/collections"),
      api.get("/api/process"),
      api.get("/api/testimonials"),
      api.get("/api/site-media"),
    ]).then(([artworks, collections, process, testimonials, siteMedia]) => ({
      artworks: artworks as Artwork[],
      collections: collections as Collection[],
      process: process as ProcessStep[],
      testimonials: testimonials as Testimonial[],
      siteMedia: siteMedia as SiteMedia[],
    })),
  );

  if (loading || !data) return <Loading />;

  return (
    <HomeClient
      artworks={data.artworks}
      collections={data.collections}
      process={data.process}
      testimonials={data.testimonials}
      siteMedia={data.siteMedia}
    />
  );
}
