import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime", "video/webm"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  // Validate file size (max 50MB)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
  }

  // Generate unique filename
  const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const safeName = file.name
    .replace(ext, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 60);
  const uniqueName = `${safeName}_${Date.now()}${ext}`;

  // Save to public/assets/
  const assetsDir = path.join(process.cwd(), "public", "assets");
  await fs.mkdir(assetsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(assetsDir, uniqueName);
  await fs.writeFile(filePath, buffer);

  const publicPath = `/assets/${uniqueName}`;
  return NextResponse.json({ path: publicPath });
}
