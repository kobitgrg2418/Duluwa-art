import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = process.env.SESSION_SECRET ?? "duluwa-art-dev-secret-change-in-prod";
const key = new TextEncoder().encode(SECRET);
const COOKIE = "session";
const TTL = 7 * 24 * 60 * 60 * 1000;

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  expiresAt: string;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(user: { id: string; name: string; email: string; role: "admin" | "user" }) {
  const expiresAt = new Date(Date.now() + TTL);
  const token = await encrypt({ ...user, expiresAt: expiresAt.toISOString() });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return decrypt(token);
}

export async function deleteSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
