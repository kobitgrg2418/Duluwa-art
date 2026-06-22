import { api } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { OrdersManager } from "@/components/admin-orders";

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

export default function AdminOrders() {
  const { data, loading } = useApiData(() =>
    api.get("/api/admin/orders").then((o) => o as OrderRow[]),
  );

  if (loading || !data) return <Loading />;
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Orders</h1>
        <p className="adm__subtitle">View and manage customer orders</p>
      </div>
      <OrdersManager orders={data} />
    </div>
  );
}
