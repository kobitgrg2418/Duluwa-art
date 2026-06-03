"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/artworks", label: "Artworks", icon: "image" },
  { href: "/admin/collections", label: "Collections", icon: "folder" },
  { href: "/admin/process", label: "Process", icon: "layers" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "quote" },
  { href: "/admin/users", label: "Users", icon: "users" },
];

const ICONS: Record<string, string> = {
  grid: "◻",
  image: "🖼",
  folder: "📁",
  layers: "☰",
  quote: "❝",
  users: "👤",
};

export function AdminShell({ children, userName }: { children: React.ReactNode; userName: string }) {
  const pathname = usePathname();

  return (
    <div className="adm">
      <aside className="adm__side">
        <div className="adm__side-top">
          <Link href="/" className="adm__brand">
            <span className="adm__brand-name">Duluwa Art</span>
            <span className="adm__brand-sub">Admin Panel</span>
          </Link>
          <nav className="adm__nav">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`adm__nav-item ${pathname === l.href ? "adm__nav-item--active" : ""}`}
              >
                <span className="adm__nav-icon">{ICONS[l.icon]}</span>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="adm__side-bot">
          <div className="adm__user">
            <span className="adm__user-name">{userName}</span>
            <span className="adm__user-role">Administrator</span>
          </div>
          <div style={{ display: "flex", gap: ".6rem" }}>
            <Link href="/" className="adm__side-link">View Site</Link>
            <form action={logout}>
              <button type="submit" className="adm__side-link adm__side-link--logout">Logout</button>
            </form>
          </div>
        </div>
      </aside>
      <main className="adm__main">{children}</main>
    </div>
  );
}
