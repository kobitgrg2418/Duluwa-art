import "server-only";
import { prisma } from "./db";
import type { Role } from "@/generated/prisma/client";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

function toRole(r: Role): "admin" | "user" {
  return r === "ADMIN" ? "admin" : "user";
}

function toStoredUser(u: { id: string; name: string; email: string; password: string; role: Role }): StoredUser {
  return { id: u.id, name: u.name, email: u.email, password: u.password, role: toRole(u.role) };
}

export async function findById(id: string): Promise<StoredUser | null> {
  const u = await prisma.user.findUnique({ where: { id } });
  return u ? toStoredUser(u) : null;
}

export async function findByEmail(email: string): Promise<StoredUser | null> {
  const u = await prisma.user.findUnique({ where: { email } });
  return u ? toStoredUser(u) : null;
}

export async function createUser(name: string, email: string, hashedPw: string): Promise<StoredUser> {
  const u = await prisma.user.create({
    data: { name, email, password: hashedPw, role: "USER" },
  });
  return toStoredUser(u);
}

const SECRET_SALT = "duluwa-salt-2024";

async function hashPassword(pw: string): Promise<string> {
  const data = new TextEncoder().encode(pw + SECRET_SALT);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  const h = await hashPassword(pw);
  return h === hash;
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string; password?: string; role?: "admin" | "user" },
): Promise<StoredUser | null> {
  try {
    const u = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.password !== undefined && { password: data.password }),
        ...(data.role !== undefined && { role: data.role === "admin" ? "ADMIN" : "USER" }),
      },
    });
    return toStoredUser(u);
  } catch {
    return null;
  }
}

export async function getAllUsers(): Promise<StoredUser[]> {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return users.map(toStoredUser);
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export { hashPassword };
