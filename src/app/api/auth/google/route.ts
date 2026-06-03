import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { findByEmail, createUser } from "@/lib/users";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

async function verifyGoogleToken(credential: string) {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  );
  if (!res.ok) return null;
  const payload = await res.json();
  if (payload.aud !== GOOGLE_CLIENT_ID) return null;
  return payload as { sub: string; email: string; name: string; picture?: string };
}

export async function POST(req: NextRequest) {
  const { credential } = await req.json();
  if (!credential) {
    return NextResponse.json({ error: "Missing credential" }, { status: 400 });
  }

  const google = await verifyGoogleToken(credential);
  if (!google) {
    return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
  }

  let user = await findByEmail(google.email);
  if (!user) {
    user = await createUser(google.name, google.email, "");
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? "user",
  });

  return NextResponse.json({ ok: true });
}
