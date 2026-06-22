import { api } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { ProcessManager } from "@/components/admin-process";
import type { ProcessStep } from "@/lib/data";

export default function AdminProcess() {
  const { data, loading } = useApiData(() =>
    api.get("/api/process").then((s) => s as ProcessStep[]),
  );

  if (loading || !data) return <Loading />;
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Process Steps</h1>
        <p className="adm__subtitle">Insert, update, or delete process steps</p>
      </div>
      <ProcessManager steps={data} />
    </div>
  );
}
