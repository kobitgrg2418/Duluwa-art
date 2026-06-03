import "server-only";
import { prisma } from "./db";
import type { OrderStatus } from "@/generated/prisma/client";

export interface CreateOrderInput {
  userId: string;
  paymentMethod: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: { artworkId: string; qty: number; price: number }[];
}

export async function createOrder(input: CreateOrderInput) {
  const subtotal = input.items.reduce((s, i) => s + i.price * i.qty, 0);
  return prisma.order.create({
    data: {
      userId: input.userId,
      paymentMethod: input.paymentMethod,
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      city: input.city,
      subtotal,
      total: subtotal,
      items: {
        create: input.items.map((i) => ({
          artworkId: i.artworkId,
          qty: i.qty,
          price: i.price,
        })),
      },
    },
    include: { items: true },
  });
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: { include: { artwork: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { artwork: true } }, user: true },
  });
}

export async function getAllOrders() {
  return prisma.order.findMany({
    include: { items: { include: { artwork: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}
