import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
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
          <tr><td style="padding: 8px 0; color: #938B7D; width: 120px;">Name</td><td style="padding: 8px 0;"><strong>${name}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #938B7D;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #A6843E;">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #938B7D;">Subject</td><td style="padding: 8px 0;">${type || "Not specified"}</td></tr>
          <tr><td style="padding: 8px 0; color: #938B7D;">Size</td><td style="padding: 8px 0;">${size || "Not specified"}</td></tr>
          <tr><td style="padding: 8px 0; color: #938B7D;">Medium</td><td style="padding: 8px 0;">${medium || "Not specified"}</td></tr>
          ${budget ? `<tr><td style="padding: 8px 0; color: #938B7D;">Budget</td><td style="padding: 8px 0;">${budget}</td></tr>` : ""}
        </table>
        <hr style="border: none; border-top: 1px solid #E8E0D1; margin: 16px 0;" />
        <h3 style="color: #5B554C; font-size: 14px; margin-bottom: 8px;">Message</h3>
        <p style="line-height: 1.7; white-space: pre-wrap;">${message || "No message provided."}</p>
        ${refImage && refImage.size > 0 ? '<p style="color: #938B7D; font-size: 13px; margin-top: 16px;">&#128206; Reference image attached</p>' : ""}
        <hr style="border: none; border-top: 1px solid #E8E0D1; margin: 16px 0;" />
        <p style="font-size: 12px; color: #938B7D;">Sent from Duluwa Art Gallery commission form</p>
      </div>
    `;

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
