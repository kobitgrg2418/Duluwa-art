import { getProcess } from "@/lib/store";
import { ProcessManager } from "@/components/admin-process";

export default async function AdminProcess() {
  const steps = await getProcess();
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Process Steps</h1>
        <p className="adm__subtitle">Insert, update, or delete process steps</p>
      </div>
      <ProcessManager steps={steps} />
    </div>
  );
}
