import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import ordersRouter from "./routes/orders";
import commissionRouter from "./routes/commission";
import uploadRouter from "./routes/upload";
import contentRouter from "./routes/content";
import adminRouter from "./routes/admin";
import { findByEmail, createUser, hashPassword, updateUser } from "./lib/users";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.set("trust proxy", true);
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(cookieParser());
// Large limit: admin image uploads are sent inline as base64 data URLs.
app.use(express.json({ limit: "15mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// One-time admin bootstrap (creates admin@duluwa.art / admin123 if missing).
app.get("/api/seed", async (_req, res) => {
  const email = "admin@duluwa.art";
  let user = await findByEmail(email);
  if (!user) {
    const hashed = await hashPassword("admin123");
    user = await createUser("Admin", email, hashed);
  }
  await updateUser(user.id, { role: "admin" });
  res.json({ message: "Admin user ready", email, password: "admin123" });
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/commission", commissionRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/admin", adminRouter);
app.use("/api", contentRouter); // /api/artworks, /api/collections, etc.

// In production, serve the built React client (single origin for app + API).
if (process.env.NODE_ENV === "production") {
  const dist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => {
  console.log(`Duluwa Art API listening on http://localhost:${PORT}`);
});
