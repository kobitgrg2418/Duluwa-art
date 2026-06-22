import { api } from "@/lib/api";
import { useApiData, useDocumentTitle } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { CommissionPageClient } from "@/components/commission-page-client";
import type { CommissionTier } from "@/lib/data";

export default function CommissionPage() {
  useDocumentTitle("Commission | Duluwa Art Gallery");
  const { data, loading } = useApiData(() =>
    api.get("/api/commission-pricing").then((tiers) => tiers as CommissionTier[]),
  );

  if (loading || !data) return <Loading />;
  return <CommissionPageClient pricing={data} />;
}
