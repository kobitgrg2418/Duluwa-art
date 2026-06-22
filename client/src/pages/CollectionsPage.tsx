import { api } from "@/lib/api";
import { useApiData, useDocumentTitle } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { CollectionsClient } from "@/components/collections-client";
import type { Artwork, Collection } from "@/lib/data";

export default function CollectionsPage() {
  useDocumentTitle("Collections | Duluwa Art Gallery");
  const { data, loading } = useApiData(() =>
    Promise.all([api.get("/api/artworks"), api.get("/api/collections")]).then(
      ([artworks, collections]) => ({
        artworks: artworks as Artwork[],
        collections: collections as Collection[],
      }),
    ),
  );

  if (loading || !data) return <Loading />;
  return <CollectionsClient collections={data.collections} artworks={data.artworks} />;
}
