export const dynamic = "force-dynamic";

import { getArtworks, getCollections } from "@/lib/store";
import { GalleryClient } from "@/components/gallery-client";

export default async function GalleryPage() {
  const [artworks, collections] = await Promise.all([getArtworks(), getCollections()]);
  return <GalleryClient artworks={artworks} collections={collections} />;
}
