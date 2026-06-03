import "server-only";
import { getSession } from "./session";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }
  return session;
}
