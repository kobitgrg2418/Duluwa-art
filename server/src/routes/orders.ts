import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createOrder, getOrderById, getOrdersByUser } from "../lib/orders";
import { getArtworksByIds } from "../lib/store";
import { sendOrderConfirmation, sendNewOrderAdminAlert } from "../lib/mail";

const router = Router();

/** Payment methods that are actually wired up. Card/Khalti are not real integrations. */
const ALLOWED_METHODS = new Set(["esewa", "bank"]);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/orders
router.post("/", requireAuth, async (req, res) => {
  const session = req.session!;
  const input = req.body ?? {};

  const name = input.name?.trim();
  const email = input.email?.trim();
  if (!name || !email) return res.status(400).json({ error: "Name and email are required." });
  if (!isValidEmail(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (!ALLOWED_METHODS.has(input.paymentMethod)) {
    return res.status(400).json({ error: "Please choose a supported payment method." });
  }
  if (!input.items?.length) return res.status(400).json({ error: "Your cart is empty." });

  // Authoritative line items: trust the DB for price and availability, never the client.
  const ids = [...new Set((input.items as { artworkId: string }[]).map((i) => i.artworkId))];
  const artworks = await getArtworksByIds(ids);
  const byId = new Map(artworks.map((a) => [a.id, a]));

  const lineItems: { artworkId: string; qty: number; price: number }[] = [];
  for (const item of input.items as { artworkId: string; qty: number }[]) {
    const art = byId.get(item.artworkId);
    if (!art) return res.status(400).json({ error: "One of the items is no longer available." });
    if (art.status !== "IN_SALE") return res.status(400).json({ error: `"${art.title}" is sold out.` });
    const qty = Math.max(1, Math.floor(item.qty || 1));
    lineItems.push({ artworkId: art.id, qty, price: art.price });
  }

  let orderId: string;
  let total: number;
  try {
    const order = await createOrder({
      userId: session.id,
      paymentMethod: input.paymentMethod,
      name,
      email,
      phone: input.phone?.trim() ?? "",
      address: input.address?.trim() ?? "",
      city: input.city?.trim() ?? "",
      items: lineItems,
    });
    orderId = order.id;
    total = order.total;
  } catch (err) {
    console.error("placeOrder: failed to create order", err);
    return res.status(500).json({ error: "Could not place your order. Please try again." });
  }

  // Notifications must never block a successfully recorded order.
  try {
    const full = await getOrderById(orderId);
    if (full) {
      const reference = input.reference?.trim() || undefined;
      await Promise.allSettled([
        sendOrderConfirmation(full, reference),
        sendNewOrderAdminAlert(full, reference),
      ]);
    }
  } catch (err) {
    console.error("placeOrder: notification error", err);
  }

  res.json({ ok: true, orderId, total });
});

// GET /api/orders/me — orders for the logged-in user, newest first
router.get("/me", requireAuth, async (req, res) => {
  const session = req.session!;
  const orders = await getOrdersByUser(session.id);
  res.json(
    orders.map((o) => ({
      id: o.id,
      status: o.status,
      paymentMethod: o.paymentMethod,
      total: o.total,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((i) => ({ title: i.artwork?.title ?? "Artwork", qty: i.qty, price: i.price })),
    })),
  );
});

export default router;
