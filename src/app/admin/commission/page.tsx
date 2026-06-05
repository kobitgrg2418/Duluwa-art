import { getCommissionPricing } from "@/lib/store";
import { CommissionPricingManager } from "@/components/admin-commission";

export default async function AdminCommission() {
  const tiers = await getCommissionPricing();
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Commission Pricing</h1>
        <p className="adm__subtitle">Edit the guide pricing shown on the commission page</p>
      </div>
      <CommissionPricingManager initialTiers={tiers} />
    </div>
  );
}
