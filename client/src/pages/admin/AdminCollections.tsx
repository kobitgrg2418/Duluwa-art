import { api } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { CollectionsManager } from "@/components/admin-collections";
import type { Collection } from "@/lib/data";

export default function AdminCollections() {
  const { data, loading } = useApiData(() =>
    api.get("/api/collections").then((c) => c as Collection[]),
  );

  if (loading || !data) return <Loading />;
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Collections</h1>
        <p className="adm__subtitle">Insert, update, or delete collections</p>
      </div>
      <CollectionsManager collections={data} />
    </div>
  );
}
