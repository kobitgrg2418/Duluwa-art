"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./cart";
import { useAuth } from "./auth-provider";
import { logout } from "@/app/actions/auth";

const NAV_LINKS = [
  { n: "01", label: "Works", href: "/#featured" },
  { n: "02", label: "Collections", href: "/collections" },
  { n: "03", label: "Story", href: "/#story" },
  { n: "04", label: "Process", href: "/#process" },
];

export function Nav({ onDark }: { onDark?: boolean }) {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const { count, setOpen } = useCart();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const dark = onDark && !solid;

  return (
    <>
      <nav className={`nav ${solid ? "nav--solid" : ""} ${dark ? "on-dark" : ""}`}>
        <Link href="/" className="nav__brand">
          Duluwa Art<small>Watercolours & Sketches · Kobit Gurung</small>
        </Link>
        <div className="nav__links">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href}>{l.label}</Link>
          ))}
          <Link href="/commission" className="nav__cta">Commission</Link>
          <button className="cart-badge" onClick={() => setOpen(true)} aria-label="Cart" style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", fontSize: "1.2rem" }}>
            &#x1F6D2;{count > 0 && <span className="cart-badge__count">{count}</span>}
          </button>
          {!authLoading && (
            user ? (
              <div className="nav__user">
                <Link href="/profile" className="nav__user-name">{user.name.split(" ")[0]}</Link>
                <form action={logout}><button type="submit" className="nav__logout">Logout</button></form>
              </div>
            ) : (
              <Link href="/login" className="nav__cta">Sign In</Link>
            )
          )}
        </div>
        <button className="nav__burger" aria-label="Menu" onClick={() => setMenu(true)}>
          <span></span><span></span>
        </button>
      </nav>

      <div className={`mmenu ${menu ? "open" : ""}`}>
        <button className="mmenu__close" onClick={() => setMenu(false)}>Close ✕</button>
        <div className="col" style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setMenu(false)}>
              <span className="n">{l.n}</span>{l.label}
            </Link>
          ))}
          <Link href="/commission" onClick={() => setMenu(false)}>
            <span className="n">06</span>Commission
          </Link>
        </div>
        {!authLoading && (
          user ? (
            <div style={{ marginTop: "1.4rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <span className="meta" style={{ fontSize: ".9rem" }}>Signed in as {user.name}</span>
              <form action={logout}><button type="submit" className="nav__logout" style={{ fontSize: ".9rem" }}>Logout</button></form>
            </div>
          ) : (
            <div style={{ marginTop: "1.4rem", display: "flex", gap: "1rem" }}>
              <Link href="/login" onClick={() => setMenu(false)} className="btn" style={{ fontSize: ".7rem" }}>Sign In</Link>
              <Link href="/register" onClick={() => setMenu(false)} className="btn" style={{ fontSize: ".7rem", background: "transparent", border: "1px solid var(--ink)" }}>Register</Link>
            </div>
          )
        )}
        <div className="mmenu__foot meta">
          <span>kobit.gurung@studio.np</span><span>Kathmandu · Nepal</span>
        </div>
      </div>
    </>
  );
}
