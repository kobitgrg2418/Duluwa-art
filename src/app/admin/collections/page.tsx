import { getCollections } from "@/lib/store";
import { CollectionsManager } from "@/components/admin-collections";

export default async function AdminCollections() {
  const collections = await getCollections();
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Collections</h1>
        <p className="adm__subtitle">Insert, update, or delete collections</p>
      </div>
      <CollectionsManager collections={collections} />
    </div>
  );
}
