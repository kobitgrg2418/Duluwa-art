import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import path from "path";
import fs from "fs/promises";

const SECRET = process.env.SESSION_SECRET ?? "duluwa-art-dev-secret-change-in-prod";
const key = new TextEncoder().encode(SECRET);

async function isAdmin(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get("session")?.value;
    if (!token) return false;
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return (payload as Record<string, unknown>).role === "admin";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
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
