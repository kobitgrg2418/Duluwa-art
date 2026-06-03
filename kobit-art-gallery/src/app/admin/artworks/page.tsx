import { getArtworks, getCollections } from "@/lib/store";
import { ArtworksManager } from "@/components/admin-artworks";

export default async function AdminArtworks() {
  const [artworks, collections] = await Promise.all([getArtworks(), getCollections()]);
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Artworks</h1>
        <p className="adm__subtitle">Insert, update, or delete artworks</p>
      </div>
      <ArtworksManager artworks={artworks} collections={collections} />
    </div>
  );
}
