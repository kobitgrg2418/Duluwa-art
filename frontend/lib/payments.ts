/**
 * PAYMENT INTEGRATION POINTS
 * --------------------------
 * Everything below is a mock that resolves after a short delay so the checkout UI can be exercised.
 * Replace each function body with the real provider call (server-side where noted).
 *
 *  - eSewa  : create a payment on your server (HMAC-SHA256 signature), redirect to eSewa ePay v2, verify on return.
 *  - Khalti : POST /epayment/initiate/ from your server with your secret key, redirect to `payment_url`, then lookup.
 *  - Card   : Stripe Checkout / Payment Element — create a PaymentIntent on your server, confirm on the client.
 *  - Bank   : show bank details and mark the order "awaiting payment" until you confirm manually.
 */
export type PaymentMethod = 'esewa' | 'khalti' | 'card' | 'bank';
export interface OrderPayload {
  method: PaymentMethod;
  amountNPR: number;
  email: string;
  items: { artworkId: string; option?: string; qty: number; unitNPR: number }[];
  shippingId: string;
}
export interface OrderResult { orderId: string; status: 'paid' | 'awaiting_payment' }

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const orderId = () => 'DA-' + Math.random().toString(36).slice(2, 8).toUpperCase();

export async function placeOrder(p: OrderPayload): Promise<OrderResult> {
  await wait(1200);
  // INTEGRATION STUB — branch on p.method and call your provider here.
  return { orderId: orderId(), status: p.method === 'bank' ? 'awaiting_payment' : 'paid' };
}
