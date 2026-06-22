import { api } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { CommissionPricingManager } from "@/components/admin-commission";
import type { CommissionTier } from "@/lib/data";

export default function AdminCommission() {
  const { data, loading } = useApiData(() =>
    api.get("/api/admin/commission-pricing").then((t) => t as CommissionTier[]),
  );

  if (loading || !data) return <Loading />;
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Commission Pricing</h1>
        <p className="adm__subtitle">Edit the guide pricing shown on the commission page</p>
      </div>
      <CommissionPricingManager initialTiers={data} />
    </div>
  );
}
