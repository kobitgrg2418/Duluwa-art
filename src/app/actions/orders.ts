"use server";

import { getSession } from "@/lib/session";
import { createOrder, getOrderById } from "@/lib/orders";
import { sendOrderConfirmation, sendNewOrderAdminAlert } from "@/lib/mail";

export interface PlaceOrderInput {
  paymentMethod: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: { artworkId: string; qty: number; price: number }[];
  /** eSewa / bank transaction reference entered by the buyer, if any. */
  reference?: string;
}

export type PlaceOrderResult = { ok: true; orderId: string } | { error: string };

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
  if (!input.items?.length) return { error: "Your cart is empty." };

  let orderId: string;
  try {
    const order = await createOrder({
      userId: session.id,
      paymentMethod: input.paymentMethod,
      name,
      email,
      phone: input.phone?.trim() ?? "",
      address: input.address?.trim() ?? "",
      city: input.city?.trim() ?? "",
      items: input.items,
    });
    orderId = order.id;
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

  return { ok: true, orderId };
}
