"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Image,
  Layers,
  Package,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";

interface DashboardStats {
  total_users: number;
  total_artworks: number;
  total_collections: number;
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  recent_orders: Array<{
    id: string;
    user_name: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  top_artworks: Array<{
    id: string;
    title: string;
    order_count: number;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/dashboard/");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Users", value: stats?.total_users || 0, icon: Users, color: "bg-blue-500", href: "/admin/users" },
    { label: "Artworks", value: stats?.total_artworks || 0, icon: Image, color: "bg-green-500", href: "/admin/artworks" },
    { label: "Collections", value: stats?.total_collections || 0, icon: Layers, color: "bg-purple-500", href: "/admin/collections" },
    { label: "Total Orders", value: stats?.total_orders || 0, icon: Package, color: "bg-orange-500", href: "/admin/orders" },
    { label: "Pending Orders", value: stats?.pending_orders || 0, icon: Clock, color: "bg-yellow-500", href: "/admin/orders?status=pending" },
    { label: "Revenue", value: formatPrice(stats?.total_revenue || 0), icon: DollarSign, color: "bg-emerald-500", href: "/admin/orders" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="animate-pulse h-8 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your gallery's performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/admin/artworks/new">Add Artwork</a>
          </Button>
          <Button asChild>
            <a href="/admin/collections/new">New Collection</a>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
                  <a href={stat.href}>View details <ArrowUpRight className="ml-1 h-4 w-4" /></a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recent_orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No recent orders</p>
              ) : (
                <div className="space-y-4">
                  {stats?.recent_orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                      <div>
                        <p className="font-medium">Order {order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">{order.user_name} • {formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{formatPrice(order.total)}</p>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="mt-1">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Artworks</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.top_artworks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No sales data yet</p>
              ) : (
                <div className="space-y-4">
                  {stats?.top_artworks.map((artwork, index) => (
                    <div key={artwork.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-muted-foreground/30">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{artwork.title}</p>
                          <p className="text-sm text-muted-foreground">{artwork.order_count} orders</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/admin/artworks/${artwork.id}`}>View</a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "paid":
      return "default";
    case "shipped":
      return "secondary";
    case "delivered":
      return "default";
    case "pending":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}