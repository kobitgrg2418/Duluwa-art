import { Router } from "express";
import multer from "multer";
import { put } from "@vercel/blob";
import { requireAdmin } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/upload  (admin only, multipart/form-data with `file`)
router.post("/", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime", "video/webm"];
    if (!allowed.includes(file.mimetype)) {
      return res.status(400).json({ error: "File type not allowed" });
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`artworks/${Date.now()}-${file.originalname}`, file.buffer, {
        access: "public",
        addRandomSuffix: true,
      });
      return res.json({ path: blob.url });
    }

    // Fallback: inline base64 data URL (no external blob storage configured)
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    res.json({ path: dataUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Upload failed" });
  }
});

export default router;
