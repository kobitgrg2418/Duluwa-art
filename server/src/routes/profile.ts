import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { setSession, clearSession } from "../lib/session";
import { findByEmail, updateUser, deleteUser, hashPassword } from "../lib/users";

const router = Router();

// PATCH /api/profile
router.patch("/", requireAuth, async (req, res) => {
  const session = req.session!;
  const name = (req.body?.name as string)?.trim();
  const email = (req.body?.email as string)?.trim();
  const newPassword = req.body?.newPassword as string;
  const confirmPassword = req.body?.confirmPassword as string;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  if (email !== session.email) {
    const existing = await findByEmail(email);
    if (existing && existing.id !== session.id) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
  }

  const updates: { name?: string; email?: string; password?: string } = { name, email };

  if (newPassword) {
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }
    updates.password = await hashPassword(newPassword);
  }

  const updated = await updateUser(session.id, updates);
  if (!updated) {
    return res.status(404).json({ error: "User not found." });
  }

  await setSession(res, { id: updated.id, name: updated.name, email: updated.email, role: updated.role ?? "user" });
  res.json({
    success: "Profile updated successfully.",
    user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role },
  });
});

// DELETE /api/profile
router.delete("/", requireAuth, async (req, res) => {
  const session = req.session!;
  await deleteUser(session.id);
  clearSession(res);
  res.json({ ok: true });
});

export default router;
