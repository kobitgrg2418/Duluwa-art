"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./cart";
import { useAuth } from "./auth-provider";
import { logout } from "@/app/actions/auth";

const NAV_LINKS = [
  { n: "01", label: "Works", href: "/#featured" },
  { n: "02", label: "Collections", href: "/collections" },
  { n: "03", label: "Gallery", href: "/gallery" },
  { n: "04", label: "Story", href: "/#story" },
  { n: "05", label: "Process", href: "/#process" },
  { n: "06", label: "About", href: "/#about" },
];

export function Nav({ onDark }: { onDark?: boolean }) {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!dropOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropOpen]);

  const dark = onDark && !solid;

  return (
    <>
      <nav className={`nav ${solid ? "nav--solid" : ""} ${dark ? "on-dark" : ""}`}>
        <Link href="/" className="nav__brand">
          <Image src="/assets/logo.jpg" alt="Duluwa Art Gallery" width={42} height={42} className="nav__logo" priority />
          <span>Duluwa Art<small>Watercolours & Sketches · Kobit Gurung</small></span>
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
              <div className="nav__dropdown" ref={dropRef}>
                <button
                  className="nav__avatar-btn"
                  onClick={() => setDropOpen((p) => !p)}
                  aria-expanded={dropOpen}
                  aria-label="User menu"
                >
                  <span className="nav__avatar-name">{user.name}</span>
                  <span className="nav__avatar-arrow">{dropOpen ? "▲" : "▼"}</span>
                </button>
                {dropOpen && (
                  <div className="nav__drop">
                    <div className="nav__drop-header">
                      <span className="nav__drop-name">{user.name}</span>
                      <span className="nav__drop-email">{user.email}</span>
                    </div>
                    <div className="nav__drop-divider" />
                    <Link href="/profile" className="nav__drop-item" onClick={() => setDropOpen(false)}>
                      Profile
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin" className="nav__drop-item" onClick={() => setDropOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="nav__drop-divider" />
                    <form action={logout}>
                      <button type="submit" className="nav__drop-item nav__drop-item--logout">
                        Sign Out
                      </button>
                    </form>
                  </div>
                )}
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
            <span className="n">07</span>Commission
          </Link>
        </div>
        {!authLoading && (
          user ? (
            <div style={{ marginTop: "1.4rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/profile" onClick={() => setMenu(false)} className="meta" style={{ fontSize: ".9rem" }}>
                {user.name} — Profile
              </Link>
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
          <span>kobit.gurung@studio.np</span><span>Pokhara · Nepal</span>
        </div>
      </div>
    </>
  );
}
