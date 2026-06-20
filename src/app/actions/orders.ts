"use server";

import { getSession } from "@/lib/session";
import { createOrder, getOrderById, getOrdersByUser } from "@/lib/orders";
import { getArtworksByIds } from "@/lib/store";
import { sendOrderConfirmation, sendNewOrderAdminAlert } from "@/lib/mail";

/** Payment methods that are actually wired up. Card/Khalti are not real integrations. */
const ALLOWED_METHODS = new Set(["esewa", "bank"]);

export interface PlaceOrderInput {
  paymentMethod: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  /** Prices are NOT trusted from the client — only the artwork id and quantity. */
  items: { artworkId: string; qty: number }[];
  /** eSewa / bank transaction reference entered by the buyer, if any. */
  reference?: string;
}

export type PlaceOrderResult = { ok: true; orderId: string; total: number } | { error: string };

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const session = await getSession();
  if (!session) return { error: "Please log in to place an order." };

  const name = input.name?.trim();
  const email = input.email?.trim();
  if (!name || !email) return { error: "Name and email are required." };
  if (!isValidEmail(email)) return { error: "Please enter a valid email address." };
  if (!ALLOWED_METHODS.has(input.paymentMethod)) {
    return { error: "Please choose a supported payment method." };
  }
  if (!input.items?.length) return { error: "Your cart is empty." };

  // Authoritative line items: trust the DB for price and availability, never the client.
  const ids = [...new Set(input.items.map((i) => i.artworkId))];
  const artworks = await getArtworksByIds(ids);
  const byId = new Map(artworks.map((a) => [a.id, a]));

  const lineItems: { artworkId: string; qty: number; price: number }[] = [];
  for (const item of input.items) {
    const art = byId.get(item.artworkId);
    if (!art) return { error: "One of the items is no longer available." };
    if (art.status !== "IN_SALE") return { error: `"${art.title}" is sold out.` };
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
    return { error: "Could not place your order. Please try again." };
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

  return { ok: true, orderId, total };
}

export interface MyOrderItem { title: string; qty: number; price: number; }
export interface MyOrder {
  id: string;
  status: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  items: MyOrderItem[];
}

/** Orders belonging to the currently logged-in user, newest first. */
export async function getMyOrders(): Promise<MyOrder[]> {
  const session = await getSession();
  if (!session) return [];
  const orders = await getOrdersByUser(session.id);
  return orders.map((o) => ({
    id: o.id,
    status: o.status,
    paymentMethod: o.paymentMethod,
    total: o.total,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({ title: i.artwork?.title ?? "Artwork", qty: i.qty, price: i.price })),
  }));
}
