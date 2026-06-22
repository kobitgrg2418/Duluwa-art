import type { Request, Response, NextFunction } from "express";
import { getSession } from "../lib/session";

/** Requires a valid session; attaches it to req.session. */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).json({ error: "Please log in to continue." });
  }
  req.session = session;
  next();
}

/** Requires an admin session; attaches it to req.session. */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = await getSession(req);
  if (!session || session.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  req.session = session;
  next();
}

/** Best-effort client IP for rate limiting (honours x-forwarded-for behind a proxy). */
export function clientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  const first = Array.isArray(fwd) ? fwd[0] : fwd?.split(",")[0];
  return first?.trim() || req.ip || "unknown";
}
