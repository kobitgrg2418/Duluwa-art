import { Outlet } from "react-router-dom";
import { AdminShell } from "@/components/admin-shell";
import { useAuth } from "@/components/auth-provider";

export default function AdminLayout() {
  const { user } = useAuth();
  return (
    <AdminShell userName={user?.name ?? "Admin"}>
      <Outlet />
    </AdminShell>
  );
}
