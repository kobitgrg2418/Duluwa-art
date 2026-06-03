"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import {
  getArtworks, saveArtworks,
  getCollections, saveCollections,
  getProcess, saveProcess,
  getTestimonials, saveTestimonials,
} from "@/lib/store";
import { getAllUsers, updateUser, deleteUser, createUser, hashPassword } from "@/lib/users";
import type { Artwork, Collection, ProcessStep, Testimonial } from "@/lib/data";

export type AdminState = { ok?: boolean; error?: string } | undefined;

// ── Artworks ──

export async function upsertArtwork(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const id = fd.get("id") as string;
  const title = (fd.get("title") as string)?.trim();
  const year = (fd.get("year") as string)?.trim();
  const medium = (fd.get("medium") as string)?.trim();
  const size = (fd.get("size") as string)?.trim();
  const coll = (fd.get("coll") as string)?.trim();
  const hue = Number(fd.get("hue")) || 0;
  const ratio = Number(fd.get("ratio")) || 1;
  const feat = fd.get("feat") === "on";
  const note = (fd.get("note") as string)?.trim() || "";
  const image = (fd.get("image") as string)?.trim() || "";
  const price = Number(fd.get("price")) || 0;

  if (!title || !year || !medium || !coll) {
    return { error: "Title, year, medium, and collection are required." };
  }

  const items = await getArtworks();
  const artwork: Artwork = { id: id || `a${Date.now()}`, title, year, medium, size, coll, hue, ratio, feat, note, image, price };

  if (id) {
    const idx = items.findIndex((a) => a.id === id);
    if (idx === -1) return { error: "Artwork not found." };
    items[idx] = artwork;
  } else {
    items.push(artwork);
  }

  await saveArtworks(items);
  revalidatePath("/admin/artworks");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteArtwork(id: string): Promise<AdminState> {
  await requireAdmin();
  const items = await getArtworks();
  const filtered = items.filter((a) => a.id !== id);
  if (filtered.length === items.length) return { error: "Not found." };
  await saveArtworks(filtered);
  revalidatePath("/admin/artworks");
  revalidatePath("/");
  return { ok: true };
}

// ── Collections ──

export async function upsertCollection(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const id = (fd.get("id") as string)?.trim();
  const no = (fd.get("no") as string)?.trim();
  const title = (fd.get("title") as string)?.trim();
  const count = Number(fd.get("count")) || 0;
  const hue = Number(fd.get("hue")) || 0;
  const blurb = (fd.get("blurb") as string)?.trim() || "";
  const editId = fd.get("editId") as string;

  if (!id || !no || !title) {
    return { error: "ID, number, and title are required." };
  }

  const items = await getCollections();
  const coll: Collection = { id, no, title, count, hue, blurb };

  if (editId) {
    const idx = items.findIndex((c) => c.id === editId);
    if (idx === -1) return { error: "Collection not found." };
    items[idx] = coll;
  } else {
    if (items.find((c) => c.id === id)) return { error: "A collection with this ID already exists." };
    items.push(coll);
  }

  await saveCollections(items);
  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteCollection(id: string): Promise<AdminState> {
  await requireAdmin();
  const items = await getCollections();
  const filtered = items.filter((c) => c.id !== id);
  if (filtered.length === items.length) return { error: "Not found." };
  await saveCollections(filtered);
  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { ok: true };
}

// ── Process ──

export async function upsertProcess(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const no = (fd.get("no") as string)?.trim();
  const title = (fd.get("title") as string)?.trim();
  const hue = Number(fd.get("hue")) || 0;
  const text = (fd.get("text") as string)?.trim() || "";
  const editNo = fd.get("editNo") as string;

  if (!no || !title) {
    return { error: "Number and title are required." };
  }

  const items = await getProcess();
  const step: ProcessStep = { no, title, hue, text };

  if (editNo) {
    const idx = items.findIndex((s) => s.no === editNo);
    if (idx === -1) return { error: "Step not found." };
    items[idx] = step;
  } else {
    items.push(step);
  }

  await saveProcess(items);
  revalidatePath("/admin/process");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProcess(no: string): Promise<AdminState> {
  await requireAdmin();
  const items = await getProcess();
  const filtered = items.filter((s) => s.no !== no);
  if (filtered.length === items.length) return { error: "Not found." };
  await saveProcess(filtered);
  revalidatePath("/admin/process");
  revalidatePath("/");
  return { ok: true };
}

// ── Testimonials ──

export async function upsertTestimonial(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const quote = (fd.get("quote") as string)?.trim();
  const who = (fd.get("who") as string)?.trim();
  const role = (fd.get("role") as string)?.trim();
  const editIdx = fd.get("editIdx") as string;

  if (!quote || !who) {
    return { error: "Quote and name are required." };
  }

  const items = await getTestimonials();
  const testimonial: Testimonial = { quote, who, role: role || "" };

  if (editIdx !== null && editIdx !== "") {
    const idx = Number(editIdx);
    if (idx < 0 || idx >= items.length) return { error: "Testimonial not found." };
    items[idx] = testimonial;
  } else {
    items.push(testimonial);
  }

  await saveTestimonials(items);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteTestimonial(idx: number): Promise<AdminState> {
  await requireAdmin();
  const items = await getTestimonials();
  if (idx < 0 || idx >= items.length) return { error: "Not found." };
  items.splice(idx, 1);
  await saveTestimonials(items);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { ok: true };
}

// ── Users ──

export async function adminGetUsers() {
  await requireAdmin();
  const users = await getAllUsers();
  return users.map(({ password: _, ...u }) => u);
}

export async function adminUpdateUserRole(userId: string, role: "admin" | "user"): Promise<AdminState> {
  await requireAdmin();
  const result = await updateUser(userId, { role });
  if (!result) return { error: "User not found." };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function adminDeleteUser(userId: string): Promise<AdminState> {
  await requireAdmin();
  const ok = await deleteUser(userId);
  if (!ok) return { error: "User not found." };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function adminCreateUser(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const name = (fd.get("name") as string)?.trim();
  const email = (fd.get("email") as string)?.trim();
  const password = fd.get("password") as string;
  const role = (fd.get("role") as string) as "admin" | "user";

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  const hashed = await hashPassword(password);
  const user = await createUser(name, email, hashed);
  if (role === "admin") {
    await updateUser(user.id, { role: "admin" });
  }
  revalidatePath("/admin/users");
  return { ok: true };
}
