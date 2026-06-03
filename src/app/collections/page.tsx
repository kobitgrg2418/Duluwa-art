export const dynamic = "force-dynamic";

import { getArtworks, getCollections } from "@/lib/store";
import { CollectionsClient } from "@/components/collections-client";

export default async function CollectionsPage() {
  const [artworks, collections] = await Promise.all([getArtworks(), getCollections()]);
  return <CollectionsClient collections={collections} artworks={artworks} />;
}
