export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getArtworks, getCollections } from "@/lib/store";
import { CollectionsClient } from "@/components/collections-client";

export const metadata: Metadata = {
  title: "Collections",
  description: "Six collections of original watercolours and sketches — Nepalese culture, portraits, Himalayan landscapes, wildlife, traditional lifestyle and watercolour sketches.",
};

export default async function CollectionsPage() {
  const [artworks, collections] = await Promise.all([getArtworks(), getCollections()]);
  return <CollectionsClient collections={collections} artworks={artworks} />;
}
