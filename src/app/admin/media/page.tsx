import { getSiteMedia } from "@/lib/store";
import { SiteMediaManager } from "@/components/admin-media";

export default async function AdminMedia() {
  const media = await getSiteMedia();
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Site Media</h1>
        <p className="adm__subtitle">Manage hero image, studio video, and other site-wide media</p>
      </div>
      <SiteMediaManager media={media} />
    </div>
  );
}
