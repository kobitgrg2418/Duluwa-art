"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSession, deleteSession } from "@/lib/session";
import { findByEmail, createUser, hashPassword, verifyPassword } from "@/lib/users";
import { rateLimit } from "@/lib/rate-limit";

export type AuthState = {
  error?: string;
} | undefined;

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit(`login:${ip}`, { max: 10, windowMs: 15 * 60 * 1000 });
  if (!success) {
    return { error: "Too many login attempts. Please try again in a few minutes." };
  }

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await findByEmail(email);
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    return { error: "Invalid email or password." };
  }

  // Auto-upgrade legacy SHA-256 hashes to bcrypt
  if (/^[a-f0-9]{64}$/.test(user.password)) {
    const { updateUser } = await import("@/lib/users");
    const newHash = await hashPassword(password);
    await updateUser(user.id, { password: newHash });
  }

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role ?? "user" });
  redirect("/");
}

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const existing = await findByEmail(email);
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashed = await hashPassword(password);
  const user = await createUser(name, email, hashed);
  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role ?? "user" });
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
