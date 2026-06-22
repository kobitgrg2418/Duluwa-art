import { api } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { SiteMediaManager } from "@/components/admin-media";
import type { SiteMedia } from "@/lib/data";

export default function AdminMedia() {
  const { data, loading } = useApiData(() =>
    api.get("/api/admin/media").then((m) => m as SiteMedia[]),
  );

  if (loading || !data) return <Loading />;
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Site Media</h1>
        <p className="adm__subtitle">Manage hero image, studio video, and other site-wide media</p>
      </div>
      <SiteMediaManager media={data} />
    </div>
  );
}
