"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { n: "01", label: "Works", href: "/#featured" },
  { n: "02", label: "Collections", href: "/collections" },
  { n: "03", label: "Story", href: "/#story" },
  { n: "04", label: "Exhibition", href: "/#exhibition" },
  { n: "05", label: "Process", href: "/#process" },
];

export function Nav({ onDark }: { onDark?: boolean }) {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

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
          Duluwa Art<small>Watercolours · Kobit Gurung</small>
        </Link>
        <div className="nav__links">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href}>{l.label}</Link>
          ))}
          <Link href="/commission" className="nav__cta">Commission</Link>
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
        <div className="mmenu__foot meta">
          <span>kobit.gurung@studio.np</span><span>Kathmandu · Nepal</span>
        </div>
      </div>
    </>
  );
}
