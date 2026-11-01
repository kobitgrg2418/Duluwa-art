'use client';
import { useCatalog } from '@/context/CatalogContext';

export default function Announcement() {
  const { site } = useCatalog();
  const announcement = site?.settings?.announcement;

  if (!announcement) return null;

  return (
    <div className="bg-ink py-2 text-center text-[12px] text-white">
      {announcement}
    </div>
  );
}
