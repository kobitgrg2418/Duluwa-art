import { api } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { UsersManager } from "@/components/admin-users";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export default function AdminUsers() {
  const { data, loading } = useApiData(() =>
    api.get("/api/admin/users").then((u) => u as UserRow[]),
  );

  if (loading || !data) return <Loading />;
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Users</h1>
        <p className="adm__subtitle">Manage users and roles</p>
      </div>
      <UsersManager users={data} />
    </div>
  );
}
