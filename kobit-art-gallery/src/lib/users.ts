import "server-only";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

const FILE = join(process.cwd(), "users.json");

async function load(): Promise<StoredUser[]> {
  try {
    const raw = await readFile(FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function save(users: StoredUser[]) {
  await writeFile(FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function findById(id: string) {
  const users = await load();
  return users.find((u) => u.id === id) ?? null;
}

export async function findByEmail(email: string) {
  const users = await load();
  return users.find((u) => u.email === email) ?? null;
}

export async function createUser(name: string, email: string, hashedPw: string) {
  const users = await load();
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPw,
  };
  users.push(user);
  await save(users);
  return user;
}

async function hashPassword(pw: string): Promise<string> {
  const data = new TextEncoder().encode(pw + SECRET_SALT);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const SECRET_SALT = "duluwa-salt-2024";

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  const h = await hashPassword(pw);
  return h === hash;
}

export async function updateUser(id: string, data: { name?: string; email?: string; password?: string }) {
  const users = await load();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  if (data.name) users[idx].name = data.name;
  if (data.email) users[idx].email = data.email;
  if (data.password) users[idx].password = data.password;
  await save(users);
  return users[idx];
}

export async function deleteUser(id: string) {
  const users = await load();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  await save(filtered);
  return true;
}

export { hashPassword };
