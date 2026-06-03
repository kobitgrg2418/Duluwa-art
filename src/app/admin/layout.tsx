import { requireAdmin } from "@/lib/admin";
import { AdminShell } from "@/components/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <AdminShell userName={session.name}>{children}</AdminShell>;
}
