import { getCommissionPricing } from "@/lib/store";
import { CommissionPageClient } from "@/components/commission-page-client";

export default async function CommissionPage() {
  const pricing = await getCommissionPricing();
  return <CommissionPageClient pricing={pricing} />;
}
