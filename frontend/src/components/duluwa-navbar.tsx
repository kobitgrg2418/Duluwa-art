"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = ["Gallery", "Collections", "Commission"];
const menu = ["Gallery", "Collections", "Commission", "Cart", "Profile", "Contact"];
const ease = [0.76, 0, 0.24, 1];
const line = (open, k) => ({
  y: open ? (k === 0 ? 7 : k === 2 ? -7 : 0) : 0,
  rotate: open ? (k === 0 ? 45 : k === 2 ? -45 : 0) : 0,
  opacity: open && k === 1 ? 0 : 1,
});

export default function DuluwaNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="duluwa-nav">
        <Link href="#top" className="logo">DULUWA-ART</Link>
        <nav className="nav-links">
          {links.map((l) => (
            <Link 
              key={l} 
              href={"/" + l.toLowerCase()} 
              className={pathname === "/" + l.toLowerCase() ? "on" : ""}
            >
              {l}
            </Link>
          ))}
        </nav>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {[0, 1, 2].map((k) => (
            <motion.i key={k} animate={line(open, k)} transition={{ duration: 0.4, ease }} />
          ))}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.45, ease } }}
            transition={{ duration: 0.65, ease }}>
            <motion.ul initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}>
              {menu.map((m) => (
                <li key={m}>
                  <motion.a 
                    href={m === "Cart" ? "/cart" : m === "Profile" ? "/profile" : m === "Contact" ? "#contact" : "/" + m.toLowerCase()} 
                    onClick={() => setOpen(false)}
                    variants={{ h: { y: 40, opacity: 0 }, s: { y: 0, opacity: 1 } }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {m}
                  </motion.a>
                </li>
              ))}
            </motion.ul>
            <motion.div className="menu-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <a href="mailto:hello@duluwa-art.com" className="u">hello@duluwa-art.com</a>
              <span><a href="#">Privacy policy</a> <a href="#">Terms &amp; conditions</a></span>
              <span>© 2025 DULUWA-ART</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
