"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { useAuth } from "@/components/auth-provider";
import { updateProfile, deleteAccount, ProfileState } from "@/app/actions/profile";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, undefined);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return (
      <>
        <Nav />
        <main className="section" style={{ paddingTop: "clamp(140px, 18vh, 220px)" }}>
          <div className="wrap" style={{ maxWidth: 560, margin: "0 auto" }}>
            <p className="serif-body">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteAccount();
  }

  return (
    <>
      <Nav />
      <main className="section" style={{ paddingTop: "clamp(140px, 18vh, 220px)" }}>
        <div className="wrap" style={{ maxWidth: 560, margin: "0 auto" }}>
          <span className="eyebrow"><span className="idx">●</span> My Account</span>
          <h1 className="display h-md" style={{ marginTop: ".5rem", marginBottom: ".4rem" }}>Profile</h1>
          <p className="serif-body" style={{ marginBottom: "2.4rem" }}>
            Manage your account details below.
          </p>

          {state?.error && <div className="auth-error">{state.error}</div>}
          {state?.success && <div className="profile-success">{state.success}</div>}

          <form action={action} className="auth-form">
            <div className="field">
              <label className="field__label" htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name}
                placeholder="Your name"
                required
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="profile-divider" />

            <p className="meta" style={{ marginBottom: "-.4rem" }}>Leave blank to keep your current password</p>
            <div className="field">
              <label className="field__label" htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Min. 6 characters"
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat new password"
              />
            </div>

            <button
              type="submit"
              className="btn"
              style={{ width: "100%", justifyContent: "center", marginTop: ".6rem" }}
              disabled={pending}
            >
              {pending ? "Saving…" : "Update Profile"} <span className="arr">→</span>
            </button>
          </form>

          <div className="profile-danger">
            <h3 className="profile-danger__title">Danger Zone</h3>
            <p className="meta">Permanently delete your account and all associated data. This cannot be undone.</p>
            {!showDelete ? (
              <button
                type="button"
                className="profile-danger__btn"
                onClick={() => setShowDelete(true)}
              >
                Delete Account
              </button>
            ) : (
              <div className="profile-danger__confirm">
                <p className="serif-body" style={{ fontSize: "1rem", color: "#a33", margin: 0 }}>
                  Are you sure? This action is permanent.
                </p>
                <div style={{ display: "flex", gap: "1rem", marginTop: ".8rem" }}>
                  <button
                    type="button"
                    className="profile-danger__btn profile-danger__btn--confirm"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting…" : "Yes, delete my account"}
                  </button>
                  <button
                    type="button"
                    className="profile-danger__btn profile-danger__btn--cancel"
                    onClick={() => setShowDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="auth-switch" style={{ marginBottom: "3rem" }}>
            <Link href="/" className="link-u" style={{ fontSize: "inherit", letterSpacing: "normal", textTransform: "none" }}>
              Back to gallery
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
