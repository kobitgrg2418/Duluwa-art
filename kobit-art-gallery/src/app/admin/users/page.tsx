import { adminGetUsers } from "@/app/actions/admin";
import { UsersManager } from "@/components/admin-users";

export default async function AdminUsers() {
  const users = await adminGetUsers();
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Users</h1>
        <p className="adm__subtitle">Manage users and roles</p>
      </div>
      <UsersManager users={users} />
    </div>
  );
}
