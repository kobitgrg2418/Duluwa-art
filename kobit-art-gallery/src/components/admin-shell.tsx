"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard", no: "01" },
  { href: "/admin/artworks", label: "Artworks", no: "02" },
  { href: "/admin/collections", label: "Collections", no: "03" },
  { href: "/admin/process", label: "Process", no: "04" },
  { href: "/admin/testimonials", label: "Testimonials", no: "05" },
  { href: "/admin/users", label: "Users", no: "06" },
];

export function AdminShell({ children, userName }: { children: React.ReactNode; userName: string }) {
  const pathname = usePathname();

  return (
    <div className="adm">
      <aside className="adm__side">
        <div className="adm__side-top">
          <Link href="/" className="adm__brand">
            <Image src="/assets/logo.jpg" alt="Duluwa Art" width={38} height={38} className="adm__brand-logo" />
            <div>
              <span className="adm__brand-name">Duluwa Art</span>
              <span className="adm__brand-sub">Curator&rsquo;s Panel</span>
            </div>
          </Link>

          <div className="adm__side-divider" />

          <nav className="adm__nav">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`adm__nav-item ${pathname === l.href ? "adm__nav-item--active" : ""}`}
              >
                <span className="adm__nav-no">{l.no}</span>
                <span className="adm__nav-label">{l.label}</span>
                {pathname === l.href && <span className="adm__nav-dot" />}
              </Link>
            ))}
          </nav>
        </div>

        <div className="adm__side-bot">
          <div className="adm__side-divider" />
          <div className="adm__user">
            <span className="adm__user-avatar">{userName.charAt(0).toUpperCase()}</span>
            <div className="adm__user-info">
              <span className="adm__user-greeting">Signed in as</span>
              <span className="adm__user-name">{userName}</span>
            </div>
          </div>
          <div className="adm__side-actions">
            <Link href="/" className="adm__side-link">
              <span className="adm__side-link-arrow">&larr;</span> View Gallery
            </Link>
            <form action={logout}>
              <button type="submit" className="adm__side-link adm__side-link--logout">Sign Out</button>
            </form>
          </div>
        </div>
      </aside>

      <div className="adm__content">
        <header className="adm__topbar">
          <span className="adm__topbar-crumb">
            <Link href="/admin" className="adm__topbar-root">Admin</Link>
            {pathname !== "/admin" && (
              <>
                <span className="adm__topbar-sep">/</span>
                <span className="adm__topbar-page">{LINKS.find(l => l.href === pathname)?.label ?? ""}</span>
              </>
            )}
          </span>
          <span className="adm__topbar-meta">Duluwa Art Gallery</span>
        </header>
        <main className="adm__main">{children}</main>
      </div>
    </div>
  );
}
