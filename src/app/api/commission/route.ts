import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";

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

export async function POST(req: NextRequest) {
  // Rate limit: 5 inquiries per IP per 15 minutes
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit(`commission:${ip}`, { max: 5, windowMs: 15 * 60 * 1000 });
  if (!success) {
    return NextResponse.json(
      { error: "Too many inquiries. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();

    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const type = (formData.get("type") as string)?.trim();
    const size = (formData.get("size") as string)?.trim();
    const medium = (formData.get("medium") as string)?.trim();
    const budget = (formData.get("budget") as string)?.trim();
    const message = (formData.get("message") as string)?.trim();
    const refImage = formData.get("refImage") as File | null;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
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
      const buffer = Buffer.from(await refImage.arrayBuffer());
      attachments.push({
        filename: refImage.name || "reference.jpg",
        content: buffer,
        contentType: refImage.type,
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Commission email error:", err);
    return NextResponse.json(
      { error: "Failed to send inquiry. Please try again." },
      { status: 500 }
    );
  }
}
