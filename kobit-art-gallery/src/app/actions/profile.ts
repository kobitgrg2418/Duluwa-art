"use server";

import { redirect } from "next/navigation";
import { getSession, createSession, deleteSession } from "@/lib/session";
import { findById, findByEmail, updateUser, deleteUser, hashPassword } from "@/lib/users";

export type ProfileState = {
  error?: string;
  success?: string;
} | undefined;

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  if (email !== session.email) {
    const existing = await findByEmail(email);
    if (existing && existing.id !== session.id) {
      return { error: "An account with this email already exists." };
    }
  }

  const updates: { name?: string; email?: string; password?: string } = { name, email };

  if (newPassword) {
    if (newPassword.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }
    if (newPassword !== confirmPassword) {
      return { error: "Passwords do not match." };
    }
    updates.password = await hashPassword(newPassword);
  }

  const updated = await updateUser(session.id, updates);
  if (!updated) {
    return { error: "User not found." };
  }

  await createSession({ id: updated.id, name: updated.name, email: updated.email });

  return { success: "Profile updated successfully." };
}

export async function deleteAccount(): Promise<ProfileState> {
  const session = await getSession();
  if (!session) redirect("/login");

  await deleteUser(session.id);
  await deleteSession();
  redirect("/");
}
