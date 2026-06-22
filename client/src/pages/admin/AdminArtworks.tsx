import { api } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { ArtworksManager } from "@/components/admin-artworks";
import type { Artwork, Collection } from "@/lib/data";

export default function AdminArtworks() {
  const { data, loading } = useApiData(() =>
    Promise.all([api.get("/api/artworks"), api.get("/api/collections")]).then(
      ([artworks, collections]) => ({
        artworks: artworks as Artwork[],
        collections: collections as Collection[],
      }),
    ),
  );

  if (loading || !data) return <Loading />;
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Artworks</h1>
        <p className="adm__subtitle">Insert, update, or delete artworks</p>
      </div>
      <ArtworksManager artworks={data.artworks} collections={data.collections} />
    </div>
  );
}
