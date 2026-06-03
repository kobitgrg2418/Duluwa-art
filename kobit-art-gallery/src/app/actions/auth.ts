"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { findByEmail, createUser, hashPassword, verifyPassword } from "@/lib/users";

export type AuthState = {
  error?: string;
} | undefined;

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
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

  await createSession({ id: user.id, name: user.name, email: user.email });
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
  await createSession({ id: user.id, name: user.name, email: user.email });
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
