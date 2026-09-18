import { Metadata } from "next";
import { Hero } from "@/components/hero";
import { FeaturedArtworks } from "@/components/featured-artworks";
import { CollectionsPreview } from "@/components/collections-preview";
import { ArtistStory } from "@/components/artist-story";
import { ProcessSection } from "@/components/process-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { NewsletterSection } from "@/components/newsletter-section";
import type { Artwork, Collection, ProcessStep, Testimonial } from "@/types";

export const metadata: Metadata = {
  title: "Duluwa Art Gallery - Discover Unique Artworks",
  description: "Explore curated collections of exceptional artworks. Commission custom pieces from talented artists.",
};

// Mock data fallbacks
const mockCollections: Collection[] = [
  {
    id: "1",
    no: "01",
    title: "Himalaya",
    count: 15,
    hue: 200,
    blurb: "Majestic peaks and serene valleys of the Himalayas",
    cover: "/assets/auth-brushes.png",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  }
];

const mockArtworks: Artwork[] = [
  {
    id: "1",
    title: "Mountain Reflection",
    year: "2023",
    medium: "Watercolor on paper",
    size: "16x20 inches",
    collection: mockCollections[0],
    collection_id: "1",
    hue: 200,
    ratio: 1.25,
    featured: true,
    note: "A serene mountain landscape",
    image: "/assets/auth-brushes.png",
    video: "",
    price: 500,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  }
];

const mockProcessSteps: ProcessStep[] = [
  {
    no: "01",
    title: "Observation",
    hue: 200,
    text: "Study the subject and plan the composition"
  },
  {
    no: "02", 
    title: "Sketch",
    hue: 150,
    text: "Create initial pencil sketches and outlines"
  },
  {
    no: "03",
    title: "Paint",
    hue: 100,
    text: "Apply watercolor layers with precision"
  },
  {
    no: "04",
    title: "Refine",
    hue: 50,
    text: "Add final details and finishing touches"
  }
];

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    quote: "Beautiful artworks that capture the essence of Nepal",
    who: "Art Collector",
    role: "Private Collector",
    created_at: "2023-01-01"
  }
];

async function getSafeData() {
  try {
    // Try to import and use the API functions
    const { getFeaturedArtworks, getCollections, getProcessSteps, getTestimonials, getSiteMedia } = await import("@/lib/data");
    
    const [featuredArtworks, collections, processSteps, testimonials, siteMedia] = await Promise.all([
      getFeaturedArtworks().catch(() => mockArtworks),
      getCollections().catch(() => mockCollections),
      getProcessSteps().catch(() => mockProcessSteps),
      getTestimonials().catch(() => mockTestimonials),
      getSiteMedia().catch(() => [])
    ]);

    const heroImage = siteMedia.find((m) => m.key === "hero_image")?.value || "/assets/auth-brushes.png";
    const videoSrc = siteMedia.find((m) => m.key === "video_src")?.value;
    const videoPoster = siteMedia.find((m) => m.key === "video_poster")?.value;

    return {
      featuredArtworks,
      collections,
      processSteps,
      testimonials,
      heroImage,
      videoSrc,
      videoPoster
    };
  } catch (error) {
    // If everything fails, return mock data
    console.error("API error, using mock data:", error);
    return {
      featuredArtworks: mockArtworks,
      collections: mockCollections,
      processSteps: mockProcessSteps,
      testimonials: mockTestimonials,
      heroImage: "/assets/auth-brushes.png",
      videoSrc: undefined,
      videoPoster: undefined
    };
  }
}

export default async function HomePage() {
  const data = await getSafeData();

  return (
    <main className="min-h-screen">
      <Hero heroImage={data.heroImage} videoSrc={data.videoSrc} videoPoster={data.videoPoster} />
      <FeaturedArtworks artworks={data.featuredArtworks} collections={data.collections} />
      <CollectionsPreview collections={data.collections} artworks={data.featuredArtworks} />
      <ArtistStory artworks={data.featuredArtworks} />
      <ProcessSection steps={data.processSteps} />
      <TestimonialsSection testimonials={data.testimonials} />
      <NewsletterSection />
    </main>
  );
}
