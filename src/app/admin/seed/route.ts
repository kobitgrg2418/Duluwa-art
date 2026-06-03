import { NextResponse } from "next/server";
import { findByEmail, createUser, hashPassword, updateUser } from "@/lib/users";

export async function GET() {
  const email = "admin@duluwa.art";
  let user = await findByEmail(email);

  if (!user) {
    const hashed = await hashPassword("admin123");
    user = await createUser("Admin", email, hashed);
  }

  await updateUser(user.id, { role: "admin" });

  return NextResponse.json({
    message: "Admin user ready",
    email,
    password: "admin123",
  });
}
