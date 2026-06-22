import { Router } from "express";
import { setSession, getSession, clearSession } from "../lib/session";
import { findByEmail, createUser, hashPassword, verifyPassword, updateUser } from "../lib/users";
import { rateLimit } from "../lib/rate-limit";
import { clientIp } from "../middleware/auth";

const router = Router();

function publicUser(s: { id: string; name: string; email: string; role: "admin" | "user" }) {
  return { id: s.id, name: s.name, email: s.email, role: s.role };
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const ip = clientIp(req);
  const { success } = rateLimit(`login:${ip}`, { max: 10, windowMs: 15 * 60 * 1000 });
  if (!success) {
    return res.status(429).json({ error: "Too many login attempts. Please try again in a few minutes." });
  }

  const email = (req.body?.email as string)?.trim();
  const password = req.body?.password as string;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = await findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // Auto-upgrade legacy SHA-256 hashes to bcrypt
  if (/^[a-f0-9]{64}$/.test(user.password)) {
    const newHash = await hashPassword(password);
    await updateUser(user.id, { password: newHash });
  }

  await setSession(res, { id: user.id, name: user.name, email: user.email, role: user.role ?? "user" });
  res.json({ user: publicUser(user) });
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const name = (req.body?.name as string)?.trim();
  const email = (req.body?.email as string)?.trim();
  const password = req.body?.password as string;
  const confirm = req.body?.confirm as string;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  if (password !== confirm) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  const existing = await findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const hashed = await hashPassword(password);
  const user = await createUser(name, email, hashed);
  await setSession(res, { id: user.id, name: user.name, email: user.email, role: user.role ?? "user" });
  res.json({ user: publicUser(user) });
});

// POST /api/auth/logout
router.post("/logout", (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.json({ user: null });
  res.json({ user: { id: session.id, name: session.name, email: session.email, role: session.role ?? "user" } });
});

// POST /api/auth/google
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

async function verifyGoogleToken(credential: string) {
  const resp = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
  );
  if (!resp.ok) return null;
  const payload = (await resp.json()) as { aud: string; sub: string; email: string; name: string; picture?: string };
  if (payload.aud !== GOOGLE_CLIENT_ID) return null;
  return payload;
}

router.post("/google", async (req, res) => {
  const { credential } = req.body ?? {};
  if (!credential) {
    return res.status(400).json({ error: "Missing credential" });
  }

  const google = await verifyGoogleToken(credential);
  if (!google) {
    return res.status(401).json({ error: "Invalid Google token" });
  }

  let user = await findByEmail(google.email);
  if (!user) {
    user = await createUser(google.name, google.email, "");
  }

  await setSession(res, { id: user.id, name: user.name, email: user.email, role: user.role ?? "user" });
  res.json({ ok: true, user: publicUser(user) });
});

export default router;
