"use client";

import { useState } from "react";
import { adminUpdateOrderStatus, adminDeleteOrder } from "@/app/actions/admin";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#fb923c",
  PAID: "#4ade80",
  SHIPPED: "#60a5fa",
  DELIVERED: "#a78bfa",
  CANCELLED: "#ef4444",
};

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

interface OrderRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
  items: { id: string; qty: number; price: number; artwork: { title: string } }[];
}

export function OrdersManager({ orders }: { orders: OrderRow[] }) {
  const [detail, setDetail] = useState<OrderRow | null>(null);

  async function handleStatusChange(id: string, status: string) {
    await adminUpdateOrderStatus(id, status);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this order permanently?")) return;
    await adminDeleteOrder(id);
    window.location.reload();
  }

  return (
    <>
      {detail && (
        <div className="adm__modal-overlay" onClick={() => setDetail(null)}>
          <div className="adm__modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm__modal-head">
              <h2>Order Details</h2>
              <button onClick={() => setDetail(null)} className="adm__modal-close">&times;</button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div className="adm__form-grid">
                <div className="adm__field">
                  <label>Order ID</label>
                  <div style={{ fontFamily: "monospace", fontSize: ".85rem" }}>{detail.id}</div>
                </div>
                <div className="adm__field">
                  <label>Date</label>
                  <div>{new Date(detail.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="adm__field">
                  <label>Customer</label>
                  <div>{detail.name}</div>
                </div>
                <div className="adm__field">
                  <label>Email</label>
                  <div>{detail.email}</div>
                </div>
                <div className="adm__field">
                  <label>Phone</label>
                  <div>{detail.phone || "—"}</div>
                </div>
                <div className="adm__field">
                  <label>Payment</label>
                  <div>{detail.paymentMethod}</div>
                </div>
                <div className="adm__field adm__field--full">
                  <label>Address</label>
                  <div>{detail.address}{detail.city ? `, ${detail.city}` : ""}</div>
                </div>
              </div>
              <h3 style={{ marginTop: "1.5rem", marginBottom: ".75rem", fontSize: "1.1rem" }}>Items</h3>
              <table className="adm__table">
                <thead>
                  <tr><th>Artwork</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                  {detail.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.artwork.title}</td>
                      <td>{item.qty}</td>
                      <td>Rs {item.price.toLocaleString()}</td>
                      <td>Rs {(item.price * item.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: "1rem", textAlign: "right", fontSize: "1.2rem", fontWeight: 600 }}>
                Total: Rs {detail.total.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="adm__table-wrap">
        <table className="adm__table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <div>
                    <strong>{o.name}</strong>
                    <div className="meta">{o.email}</div>
                  </div>
                </td>
                <td>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                <td className="adm__cell-mono">Rs {o.total.toLocaleString()}</td>
                <td>{o.paymentMethod}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    style={{
                      background: STATUS_COLORS[o.status] || "#888",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: ".8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="adm__actions">
                    <button onClick={() => setDetail(o)} className="adm__btn adm__btn--sm">View</button>
                    <button onClick={() => handleDelete(o.id)} className="adm__btn adm__btn--sm adm__btn--danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-faint)" }}>No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
