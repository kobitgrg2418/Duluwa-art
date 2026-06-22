import nodemailer from "nodemailer";

// ── Shared helpers ──

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function money(n: number): string {
  return `Rs ${n.toLocaleString("en-US")}`;
}

function shortRef(id: string): string {
  return id.slice(-8).toUpperCase();
}

function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

// ── Order shape (structurally matches getOrderById result) ──

type DbOrderItem = { qty: number; price: number; artwork: { title: string } | null };
export type OrderEmailData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  total: number;
  items: DbOrderItem[];
};

const PAY_LABEL: Record<string, string> = {
  esewa: "eSewa",
  khalti: "Khalti",
  card: "Card",
  bank: "Nabil Bank (QR)",
};

function payLabel(method: string): string {
  return PAY_LABEL[method] ?? method;
}

// ── Templates ──

function shell(heading: string, intro: string, body: string): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #232120;">
      <h2 style="color: #A6843E; margin-bottom: 4px;">${esc(heading)}</h2>
      <p style="line-height: 1.7; color: #5B554C;">${intro}</p>
      <hr style="border: none; border-top: 1px solid #E8E0D1; margin: 16px 0;" />
      ${body}
      <hr style="border: none; border-top: 1px solid #E8E0D1; margin: 16px 0;" />
      <p style="font-size: 12px; color: #938B7D;">Duluwa Art Gallery &middot; Kobit Gurung</p>
    </div>
  `;
}

function itemsTable(order: OrderEmailData): string {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #F0EBDF;">${esc(i.artwork?.title ?? "Artwork")}${i.qty > 1 ? ` &times; ${i.qty}` : ""}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #F0EBDF; text-align: right;">${money(i.price * i.qty)}</td>
      </tr>`
    )
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
      ${rows}
      <tr>
        <td style="padding: 12px 0 0; font-weight: bold;">Total</td>
        <td style="padding: 12px 0 0; text-align: right; font-weight: bold; color: #A6843E;">${money(order.total)}</td>
      </tr>
    </table>`;
}

function shippingBlock(order: OrderEmailData, reference?: string): string {
  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 20px;">
      <tr><td style="padding: 6px 0; color: #938B7D; width: 140px;">Order Ref</td><td style="padding: 6px 0;"><strong>#${shortRef(order.id)}</strong></td></tr>
      <tr><td style="padding: 6px 0; color: #938B7D;">Payment Method</td><td style="padding: 6px 0;">${esc(payLabel(order.paymentMethod))}</td></tr>
      ${reference ? `<tr><td style="padding: 6px 0; color: #938B7D;">Transaction ID</td><td style="padding: 6px 0;">${esc(reference)}</td></tr>` : ""}
      <tr><td style="padding: 6px 0; color: #938B7D; vertical-align: top;">Ship To</td><td style="padding: 6px 0;">${esc(order.name)}<br/>${esc(order.address)}, ${esc(order.city)}<br/>${esc(order.phone)}</td></tr>
    </table>`;
}

// ── Public senders ──

/** Order received — sent to the customer immediately at checkout (payment pending verification). */
export async function sendOrderConfirmation(order: OrderEmailData, reference?: string) {
  const html = shell(
    "Order Confirmed",
    `Thank you for your order, <strong>${esc(order.name)}</strong>. We&#39;ve received it and are verifying your payment. You&#39;ll get a follow-up email as soon as your payment is confirmed.`,
    itemsTable(order) + shippingBlock(order, reference)
  );

  await transporter().sendMail({
    from: `"Duluwa Art Gallery" <${process.env.GMAIL_USER}>`,
    to: order.email,
    subject: `Order Confirmed — Duluwa Art Gallery (#${shortRef(order.id)})`,
    html,
  });
}

/** Payment confirmed — sent to the customer when an admin marks the order PAID. */
export async function sendPaymentConfirmation(order: OrderEmailData) {
  const html = shell(
    "Payment Confirmed",
    `Good news, <strong>${esc(order.name)}</strong>! We&#39;ve confirmed your payment of <strong>${money(order.total)}</strong>. Your artwork is now being prepared for shipping.`,
    itemsTable(order) + shippingBlock(order)
  );

  await transporter().sendMail({
    from: `"Duluwa Art Gallery" <${process.env.GMAIL_USER}>`,
    to: order.email,
    subject: `Payment Confirmed — Duluwa Art Gallery (#${shortRef(order.id)})`,
    html,
  });
}

/** New-order alert — sent to the gallery inbox so payment can be verified. */
export async function sendNewOrderAdminAlert(order: OrderEmailData, reference?: string) {
  const html = shell(
    "New Order — Verify Payment",
    `A new order was placed by <strong>${esc(order.name)}</strong> (<a href="mailto:${esc(order.email)}" style="color:#A6843E;">${esc(order.email)}</a>). Verify the ${esc(payLabel(order.paymentMethod))} payment, then mark the order as PAID in the admin panel.`,
    itemsTable(order) + shippingBlock(order, reference)
  );

  await transporter().sendMail({
    from: `"Duluwa Art Gallery" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: order.email,
    subject: `New Order #${shortRef(order.id)} — ${order.name} (${money(order.total)})`,
    html,
  });
}
