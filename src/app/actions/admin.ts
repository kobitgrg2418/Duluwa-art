"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import {
  getArtworks, saveArtwork, deleteArtworkById, batchUpdateArtworkStatus,
  getCollections, saveCollection, deleteCollectionById,
  getProcess, saveProcessStep, deleteProcessStepByNo,
  getTestimonials, getTestimonialIds, saveTestimonial, deleteTestimonialById,
  getSiteMedia, saveSiteMedia, deleteSiteMediaByKey,
  getCommissionPricing, saveCommissionPricing,
  type CommissionTier,
} from "@/lib/store";
import { getAllUsers, updateUser, deleteUser, createUser, hashPassword } from "@/lib/users";
import type { Artwork, ArtworkStatus, Collection, ProcessStep, SiteMedia, Testimonial } from "@/lib/data";

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
  const video = (fd.get("video") as string)?.trim() || "";
  const price = Number(fd.get("price")) || 0;
  const status = (fd.get("status") as string) === "SOLD_OUT" ? "SOLD_OUT" : "IN_SALE";

  if (!title || !year || !medium || !coll) {
    return { error: "Title, year, medium, and collection are required." };
  }

  const artwork: Artwork = { id: id || `a${Date.now()}`, title, year, medium, size, coll, hue, ratio, feat, note, image, video, price, status: status as ArtworkStatus };

  if (id) {
    const items = await getArtworks();
    if (!items.find((a) => a.id === id)) return { error: "Artwork not found." };
  }

  await saveArtwork(artwork);
  revalidatePath("/admin/artworks");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteArtwork(id: string): Promise<AdminState> {
  await requireAdmin();
  const ok = await deleteArtworkById(id);
  if (!ok) return { error: "Not found." };
  revalidatePath("/admin/artworks");
  revalidatePath("/");
  return { ok: true };
}

export async function batchSetArtworkStatus(ids: string[], status: ArtworkStatus): Promise<AdminState> {
  await requireAdmin();
  if (ids.length === 0) return { error: "No artworks selected." };
  await batchUpdateArtworkStatus(ids, status);
  revalidatePath("/admin/artworks");
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/gallery");
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
  const cover = (fd.get("cover") as string)?.trim() || "";
  const editId = fd.get("editId") as string;

  if (!id || !no || !title) {
    return { error: "ID, number, and title are required." };
  }

  const coll: Collection = { id, no, title, count, hue, blurb, cover };

  if (editId) {
    const items = await getCollections();
    if (!items.find((c) => c.id === editId)) return { error: "Collection not found." };
    await saveCollection(coll, editId);
  } else {
    const items = await getCollections();
    if (items.find((c) => c.id === id)) return { error: "A collection with this ID already exists." };
    await saveCollection(coll);
  }

  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteCollection(id: string): Promise<AdminState> {
  await requireAdmin();
  const ok = await deleteCollectionById(id);
  if (!ok) return { error: "Not found." };
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

  const step: ProcessStep = { no, title, hue, text };

  if (editNo) {
    const items = await getProcess();
    if (!items.find((s) => s.no === editNo)) return { error: "Step not found." };
    await saveProcessStep(step, editNo);
  } else {
    await saveProcessStep(step);
  }

  revalidatePath("/admin/process");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProcess(no: string): Promise<AdminState> {
  await requireAdmin();
  const ok = await deleteProcessStepByNo(no);
  if (!ok) return { error: "Not found." };
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

  const testimonial: Testimonial = { quote, who, role: role || "" };

  if (editIdx !== null && editIdx !== "") {
    const idx = Number(editIdx);
    const ids = await getTestimonialIds();
    if (idx < 0 || idx >= ids.length) return { error: "Testimonial not found." };
    await saveTestimonial(testimonial, ids[idx]);
  } else {
    await saveTestimonial(testimonial);
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteTestimonial(idx: number): Promise<AdminState> {
  await requireAdmin();
  const ids = await getTestimonialIds();
  if (idx < 0 || idx >= ids.length) return { error: "Not found." };
  const ok = await deleteTestimonialById(ids[idx]);
  if (!ok) return { error: "Not found." };
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

// ── Orders ──

import { getAllOrders, updateOrderStatus } from "@/lib/orders";
import { prisma } from "@/lib/db";
import type { OrderStatus } from "@/generated/prisma/client";

export async function adminGetOrders() {
  await requireAdmin();
  return getAllOrders();
}

export async function adminUpdateOrderStatus(orderId: string, status: string): Promise<AdminState> {
  await requireAdmin();
  try {
    await updateOrderStatus(orderId, status as OrderStatus);
    revalidatePath("/admin/orders");
    return { ok: true };
  } catch {
    return { error: "Order not found." };
  }
}

export async function adminDeleteOrder(orderId: string): Promise<AdminState> {
  await requireAdmin();
  try {
    await prisma.order.delete({ where: { id: orderId } });
    revalidatePath("/admin/orders");
    return { ok: true };
  } catch {
    return { error: "Order not found." };
  }
}

// ── Site Media ──

export async function upsertSiteMedia(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const key = (fd.get("key") as string)?.trim();
  const value = (fd.get("value") as string)?.trim() || "";
  const label = (fd.get("label") as string)?.trim() || "";

  if (!key) {
    return { error: "Key is required." };
  }

  await saveSiteMedia({ key, value, label });
  revalidatePath("/admin/media");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteSiteMedia(key: string): Promise<AdminState> {
  await requireAdmin();
  const ok = await deleteSiteMediaByKey(key);
  if (!ok) return { error: "Not found." };
  revalidatePath("/admin/media");
  revalidatePath("/");
  return { ok: true };
}

// ── Commission Pricing ──

export async function adminGetCommissionPricing(): Promise<CommissionTier[]> {
  await requireAdmin();
  return getCommissionPricing();
}

export async function adminSaveCommissionPricing(tiers: CommissionTier[]): Promise<AdminState> {
  await requireAdmin();
  if (!tiers.length) return { error: "At least one pricing tier is required." };
  for (const t of tiers) {
    if (!t.label || !t.price) return { error: "Each tier needs a label and price." };
  }
  await saveCommissionPricing(tiers);
  revalidatePath("/admin/commission");
  revalidatePath("/commission");
  revalidatePath("/");
  return { ok: true };
}
