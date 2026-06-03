"use client";

import { useState, useActionState } from "react";
import { adminCreateUser, adminUpdateUserRole, adminDeleteUser } from "@/app/actions/admin";
import type { AdminState } from "@/app/actions/admin";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export function UsersManager({ users }: { users: UserRow[] }) {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState(adminCreateUser, undefined as AdminState);

  async function handleToggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Change role to ${newRole}?`)) return;
    await adminUpdateUserRole(id, newRole as "admin" | "user");
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user permanently?")) return;
    await adminDeleteUser(id);
    window.location.reload();
  }

  if (state?.ok && showForm) {
    setShowForm(false);
    window.location.reload();
  }

  return (
    <>
      <button className="adm__btn adm__btn--primary" onClick={() => setShowForm(true)}>+ Add User</button>

      {showForm && (
        <div className="adm__modal-overlay" onClick={() => setShowForm(false)}>
          <div className="adm__modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm__modal-head">
              <h2>Create User</h2>
              <button onClick={() => setShowForm(false)} className="adm__modal-close">&times;</button>
            </div>
            {state?.error && <div className="adm__error">{state.error}</div>}
            <form action={formAction} className="adm__form">
              <div className="adm__form-grid">
                <div className="adm__field">
                  <label>Name *</label>
                  <input name="name" required />
                </div>
                <div className="adm__field">
                  <label>Email *</label>
                  <input name="email" type="email" required />
                </div>
                <div className="adm__field">
                  <label>Password *</label>
                  <input name="password" type="password" required />
                </div>
                <div className="adm__field">
                  <label>Role</label>
                  <select name="role">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="adm__form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="adm__btn">Cancel</button>
                <button type="submit" className="adm__btn adm__btn--primary" disabled={pending}>
                  {pending ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="adm__table-wrap">
        <table className="adm__table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>
                  <span className={`adm__badge ${u.role === "admin" ? "adm__badge--admin" : ""}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <div className="adm__actions">
                    <button onClick={() => handleToggleRole(u.id, u.role)} className="adm__btn adm__btn--sm">
                      {u.role === "admin" ? "Make User" : "Make Admin"}
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="adm__btn adm__btn--sm adm__btn--danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-faint)" }}>No users yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
