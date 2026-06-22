import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import {
  getArtworks, saveArtwork, deleteArtworkById, batchUpdateArtworkStatus,
  getCollections, saveCollection, deleteCollectionById,
  getProcess, saveProcessStep, deleteProcessStepByNo,
  getTestimonials, getTestimonialIds, saveTestimonial, deleteTestimonialById,
  getSiteMedia, saveSiteMedia, deleteSiteMediaByKey,
  getCommissionPricing, saveCommissionPricing,
  type CommissionTier,
} from "../lib/store";
import { getAllUsers, updateUser, deleteUser, createUser, hashPassword } from "../lib/users";
import { getAllOrders, getOrderById, updateOrderStatus } from "../lib/orders";
import { sendPaymentConfirmation } from "../lib/mail";
import { prisma } from "../lib/db";
import type { Artwork, ArtworkStatus, Collection, ProcessStep, Testimonial } from "../lib/data";
import type { OrderStatus } from "../generated/prisma/client";

const router = Router();
router.use(requireAdmin); // every admin endpoint requires an admin session

// ── Artworks ──

router.post("/artworks", async (req, res) => {
  const b = req.body ?? {};
  const id = (b.id as string) || "";
  const title = (b.title as string)?.trim();
  const year = (b.year as string)?.trim();
  const medium = (b.medium as string)?.trim();
  const size = (b.size as string)?.trim() || "";
  const coll = (b.coll as string)?.trim();
  const hue = Number(b.hue) || 0;
  const ratio = Number(b.ratio) || 1;
  const feat = b.feat === true || b.feat === "on" || b.feat === "true";
  const note = (b.note as string)?.trim() || "";
  const image = (b.image as string)?.trim() || "";
  const video = (b.video as string)?.trim() || "";
  const price = Number(b.price) || 0;
  const status = b.status === "SOLD_OUT" ? "SOLD_OUT" : "IN_SALE";

  if (!title || !year || !medium || !coll) {
    return res.status(400).json({ error: "Title, year, medium, and collection are required." });
  }

  const artwork: Artwork = { id: id || `a${Date.now()}`, title, year, medium, size, coll, hue, ratio, feat, note, image, video, price, status: status as ArtworkStatus };

  if (id) {
    const items = await getArtworks();
    if (!items.find((a) => a.id === id)) return res.status(404).json({ error: "Artwork not found." });
  }

  await saveArtwork(artwork);
  res.json({ ok: true });
});

router.delete("/artworks/:id", async (req, res) => {
  const ok = await deleteArtworkById(req.params.id);
  if (!ok) return res.status(404).json({ error: "Not found." });
  res.json({ ok: true });
});

router.post("/artworks/batch-status", async (req, res) => {
  const ids = (req.body?.ids as string[]) ?? [];
  const status = req.body?.status as ArtworkStatus;
  if (!ids.length) return res.status(400).json({ error: "No artworks selected." });
  await batchUpdateArtworkStatus(ids, status);
  res.json({ ok: true });
});

// ── Collections ──

router.post("/collections", async (req, res) => {
  const b = req.body ?? {};
  const id = (b.id as string)?.trim();
  const no = (b.no as string)?.trim();
  const title = (b.title as string)?.trim();
  const count = Number(b.count) || 0;
  const hue = Number(b.hue) || 0;
  const blurb = (b.blurb as string)?.trim() || "";
  const cover = (b.cover as string)?.trim() || "";
  const editId = (b.editId as string) || "";

  if (!id || !no || !title) {
    return res.status(400).json({ error: "ID, number, and title are required." });
  }

  const coll: Collection = { id, no, title, count, hue, blurb, cover };

  if (editId) {
    const items = await getCollections();
    if (!items.find((c) => c.id === editId)) return res.status(404).json({ error: "Collection not found." });
    await saveCollection(coll, editId);
  } else {
    const items = await getCollections();
    if (items.find((c) => c.id === id)) return res.status(409).json({ error: "A collection with this ID already exists." });
    await saveCollection(coll);
  }

  res.json({ ok: true });
});

router.delete("/collections/:id", async (req, res) => {
  const ok = await deleteCollectionById(req.params.id);
  if (!ok) return res.status(404).json({ error: "Not found." });
  res.json({ ok: true });
});

// ── Process ──

router.post("/process", async (req, res) => {
  const b = req.body ?? {};
  const no = (b.no as string)?.trim();
  const title = (b.title as string)?.trim();
  const hue = Number(b.hue) || 0;
  const text = (b.text as string)?.trim() || "";
  const editNo = (b.editNo as string) || "";

  if (!no || !title) {
    return res.status(400).json({ error: "Number and title are required." });
  }

  const step: ProcessStep = { no, title, hue, text };

  if (editNo) {
    const items = await getProcess();
    if (!items.find((s) => s.no === editNo)) return res.status(404).json({ error: "Step not found." });
    await saveProcessStep(step, editNo);
  } else {
    await saveProcessStep(step);
  }

  res.json({ ok: true });
});

router.delete("/process/:no", async (req, res) => {
  const ok = await deleteProcessStepByNo(req.params.no);
  if (!ok) return res.status(404).json({ error: "Not found." });
  res.json({ ok: true });
});

// ── Testimonials ──

router.post("/testimonials", async (req, res) => {
  const b = req.body ?? {};
  const quote = (b.quote as string)?.trim();
  const who = (b.who as string)?.trim();
  const role = (b.role as string)?.trim();
  const editIdx = b.editIdx;

  if (!quote || !who) {
    return res.status(400).json({ error: "Quote and name are required." });
  }

  const testimonial: Testimonial = { quote, who, role: role || "" };

  if (editIdx !== null && editIdx !== undefined && editIdx !== "") {
    const idx = Number(editIdx);
    const ids = await getTestimonialIds();
    if (idx < 0 || idx >= ids.length) return res.status(404).json({ error: "Testimonial not found." });
    await saveTestimonial(testimonial, ids[idx]);
  } else {
    await saveTestimonial(testimonial);
  }

  res.json({ ok: true });
});

router.delete("/testimonials/:idx", async (req, res) => {
  const idx = Number(req.params.idx);
  const ids = await getTestimonialIds();
  if (idx < 0 || idx >= ids.length) return res.status(404).json({ error: "Not found." });
  const ok = await deleteTestimonialById(ids[idx]);
  if (!ok) return res.status(404).json({ error: "Not found." });
  res.json({ ok: true });
});

// ── Users ──

router.get("/users", async (_req, res) => {
  const users = await getAllUsers();
  res.json(users.map(({ password: _pw, ...u }) => u));
});

router.post("/users", async (req, res) => {
  const b = req.body ?? {};
  const name = (b.name as string)?.trim();
  const email = (b.email as string)?.trim();
  const password = b.password as string;
  const role = b.role as "admin" | "user";

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const hashed = await hashPassword(password);
  const user = await createUser(name, email, hashed);
  if (role === "admin") {
    await updateUser(user.id, { role: "admin" });
  }
  res.json({ ok: true });
});

router.patch("/users/:id/role", async (req, res) => {
  const role = req.body?.role as "admin" | "user";
  const result = await updateUser(req.params.id, { role });
  if (!result) return res.status(404).json({ error: "User not found." });
  res.json({ ok: true });
});

router.delete("/users/:id", async (req, res) => {
  const ok = await deleteUser(req.params.id);
  if (!ok) return res.status(404).json({ error: "User not found." });
  res.json({ ok: true });
});

// ── Orders ──

router.get("/orders", async (_req, res) => {
  const orders = await getAllOrders();
  res.json(
    orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      items: o.items.map((item) => ({ ...item, artwork: { title: item.artwork.title } })),
      user: { name: o.user.name, email: o.user.email },
    })),
  );
});

router.patch("/orders/:id/status", async (req, res) => {
  const status = req.body?.status as string;
  try {
    const before = await getOrderById(req.params.id);
    await updateOrderStatus(req.params.id, status as OrderStatus);

    // On first transition to PAID: mark the purchased artworks sold out and notify the buyer.
    if (status === "PAID" && before && before.status !== "PAID") {
      const artworkIds = before.items.map((i) => i.artworkId);
      if (artworkIds.length) {
        await prisma.artwork.updateMany({
          where: { id: { in: artworkIds } },
          data: { status: "SOLD_OUT" },
        });
      }
      try {
        await sendPaymentConfirmation(before);
      } catch (err) {
        console.error("updateOrderStatus: payment confirmation email failed", err);
      }
    }
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: "Order not found." });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    await prisma.order.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: "Order not found." });
  }
});

// ── Site Media ──

router.get("/media", async (_req, res) => {
  res.json(await getSiteMedia());
});

router.post("/media", async (req, res) => {
  const key = (req.body?.key as string)?.trim();
  const value = (req.body?.value as string)?.trim() || "";
  const label = (req.body?.label as string)?.trim() || "";

  if (!key) return res.status(400).json({ error: "Key is required." });

  await saveSiteMedia({ key, value, label });
  res.json({ ok: true });
});

router.delete("/media/:key", async (req, res) => {
  const ok = await deleteSiteMediaByKey(req.params.key);
  if (!ok) return res.status(404).json({ error: "Not found." });
  res.json({ ok: true });
});

// ── Commission Pricing ──

router.get("/commission-pricing", async (_req, res) => {
  res.json(await getCommissionPricing());
});

router.post("/commission-pricing", async (req, res) => {
  const tiers = (req.body?.tiers as CommissionTier[]) ?? [];
  if (!tiers.length) return res.status(400).json({ error: "At least one pricing tier is required." });
  for (const t of tiers) {
    if (!t.label || !t.price) return res.status(400).json({ error: "Each tier needs a label and price." });
  }
  await saveCommissionPricing(tiers);
  res.json({ ok: true });
});

export default router;
