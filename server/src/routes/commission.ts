import { Router } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import { rateLimit } from "../lib/rate-limit";
import { prisma } from "../lib/db";
import { clientIp } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/commission  (multipart/form-data, optional `refImage` file)
router.post("/", upload.single("refImage"), async (req, res) => {
  // Rate limit: 5 inquiries per IP per 15 minutes
  const ip = clientIp(req);
  const { success } = rateLimit(`commission:${ip}`, { max: 5, windowMs: 15 * 60 * 1000 });
  if (!success) {
    return res.status(429).json({ error: "Too many inquiries. Please try again in a few minutes." });
  }

  try {
    const name = (req.body?.name as string)?.trim();
    const email = (req.body?.email as string)?.trim();
    const type = (req.body?.type as string)?.trim();
    const size = (req.body?.size as string)?.trim();
    const medium = (req.body?.medium as string)?.trim();
    const budget = (req.body?.budget as string)?.trim();
    const message = (req.body?.message as string)?.trim();
    const refImage = req.file;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const attachments: nodemailer.SendMailOptions["attachments"] = [];
    if (refImage && refImage.size > 0) {
      attachments.push({
        filename: refImage.originalname || "reference.jpg",
        content: refImage.buffer,
        contentType: refImage.mimetype,
      });
    }

    const htmlBody = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #232120;">
        <h2 style="color: #A6843E; margin-bottom: 4px;">New Commission Inquiry</h2>
        <hr style="border: none; border-top: 1px solid #E8E0D1; margin: 16px 0;" />
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr><td style="padding: 8px 0; color: #938B7D; width: 120px;">Name</td><td style="padding: 8px 0;"><strong>${esc(name)}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #938B7D;">Email</td><td style="padding: 8px 0;"><a href="mailto:${esc(email)}" style="color: #A6843E;">${esc(email)}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #938B7D;">Subject</td><td style="padding: 8px 0;">${esc(type || "Not specified")}</td></tr>
          <tr><td style="padding: 8px 0; color: #938B7D;">Size</td><td style="padding: 8px 0;">${esc(size || "Not specified")}</td></tr>
          <tr><td style="padding: 8px 0; color: #938B7D;">Medium</td><td style="padding: 8px 0;">${esc(medium || "Not specified")}</td></tr>
          ${budget ? `<tr><td style="padding: 8px 0; color: #938B7D;">Budget</td><td style="padding: 8px 0;">${esc(budget)}</td></tr>` : ""}
        </table>
        <hr style="border: none; border-top: 1px solid #E8E0D1; margin: 16px 0;" />
        <h3 style="color: #5B554C; font-size: 14px; margin-bottom: 8px;">Message</h3>
        <p style="line-height: 1.7; white-space: pre-wrap;">${esc(message || "No message provided.")}</p>
        ${refImage && refImage.size > 0 ? '<p style="color: #938B7D; font-size: 13px; margin-top: 16px;">&#128206; Reference image attached</p>' : ""}
        <hr style="border: none; border-top: 1px solid #E8E0D1; margin: 16px 0;" />
        <p style="font-size: 12px; color: #938B7D;">Sent from Duluwa Art Gallery commission form</p>
      </div>
    `;

    // Persist to database (survives even if email fails)
    await prisma.commissionInquiry.create({
      data: { name, email, type: type || "", size: size || "", medium: medium || "", budget: budget || "", message: message || "" },
    });

    await transporter.sendMail({
      from: `"Duluwa Art Gallery" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Commission Inquiry: ${type || "General"} — ${name}`,
      html: htmlBody,
      attachments,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Commission email error:", err);
    res.status(500).json({ error: "Failed to send inquiry. Please try again." });
  }
});

export default router;
