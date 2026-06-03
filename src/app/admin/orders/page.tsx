import { adminGetOrders } from "@/app/actions/admin";
import { OrdersManager } from "@/components/admin-orders";

export default async function AdminOrders() {
  const orders = await adminGetOrders();

  const serialized = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    items: o.items.map((item) => ({
      ...item,
      artwork: { title: item.artwork.title },
    })),
    user: { name: o.user.name, email: o.user.email },
  }));

  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Orders</h1>
        <p className="adm__subtitle">View and manage customer orders</p>
      </div>
      <OrdersManager orders={serialized} />
    </div>
  );
}
