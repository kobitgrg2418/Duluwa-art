export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getArtworks, getCollections } from "@/lib/store";
import { GalleryClient } from "@/components/gallery-client";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse the complete collection of original watercolour paintings and sketches by Kobit Gurung. Portraits, landscapes, wildlife and Himalayan scenes from Nepal.",
};

export default async function GalleryPage() {
  const [artworks, collections] = await Promise.all([getArtworks(), getCollections()]);
  return <GalleryClient artworks={artworks} collections={collections} />;
}
