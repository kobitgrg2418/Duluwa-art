
import { useEffect, useState } from "react";
import Link from "@/components/link";
import { api } from "@/lib/api";

interface MyOrderItem { title: string; qty: number; price: number; }
interface MyOrder {
  id: string;
  status: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  items: MyOrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#b5862f",
  PAID: "#4a8a4a",
  SHIPPED: "#3f72b0",
  DELIVERED: "#5b554c",
  CANCELLED: "#a33",
};

const PAY_LABEL: Record<string, string> = {
  esewa: "eSewa",
  khalti: "Khalti",
  card: "Card",
  bank: "Nabil Bank",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function MyOrders() {
  const [orders, setOrders] = useState<MyOrder[] | null>(null);

  useEffect(() => {
    let active = true;
    api.get("/api/orders/me")
      .then((o) => active && setOrders(o))
      .catch(() => active && setOrders([]));
    return () => { active = false; };
  }, []);

  return (
    <section id="orders" className="orders-sec">
      <div className="profile-divider" />
      <h2 className="display h-sm" style={{ marginBottom: "1.4rem" }}>My Orders</h2>

      {orders === null && <p className="meta">Loading your orders…</p>}

      {orders !== null && orders.length === 0 && (
        <div className="orders-empty">
          <p className="serif-body" style={{ margin: "0 0 1rem" }}>You haven&rsquo;t placed any orders yet.</p>
          <Link href="/collections" className="link-u">Browse Collections <span className="arr">→</span></Link>
        </div>
      )}

      {orders !== null && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((o) => (
            <article key={o.id} className="order-card">
              <header className="order-card__head">
                <div>
                  <span className="order-card__ref">Order #{o.id.slice(-8).toUpperCase()}</span>
                  <span className="meta">{fmtDate(o.createdAt)}</span>
                </div>
                <span className="order-status" style={{ color: STATUS_COLORS[o.status] || "var(--ink-soft)", borderColor: STATUS_COLORS[o.status] || "var(--line)" }}>
                  {o.status.charAt(0) + o.status.slice(1).toLowerCase()}
                </span>
              </header>

              <div className="order-card__items">
                {o.items.map((it, i) => (
                  <div key={i} className="order-card__row">
                    <span className="order-card__title">{it.title}{it.qty > 1 ? ` × ${it.qty}` : ""}</span>
                    <span className="order-card__price">Rs {(it.price * it.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <footer className="order-card__foot">
                <span className="meta">{PAY_LABEL[o.paymentMethod] || o.paymentMethod}</span>
                <span className="order-card__total">Rs {o.total.toLocaleString()}</span>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
