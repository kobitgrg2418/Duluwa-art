"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";

const links = ["Gallery", "Collections", "Commission"];
const menu = ["Gallery", "Collections", "Commission", "Cart", "Profile", "Login", "Register", "Contact"];
const ease = [0.76, 0, 0.24, 1];
const line = (open, k) => ({
  y: open ? (k === 0 ? 7 : k === 2 ? -7 : 0) : 0,
  rotate: open ? (k === 0 ? 45 : k === 2 ? -45 : 0) : 0,
  opacity: open && k === 1 ? 0 : 1,
});

export default function DuluwaNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`duluwa-nav ${scrolled ? 'scrolled' : ''}`}>
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
          <Link href="/cart" className="nav-icon">
            <ShoppingCart className="w-5 h-5" />
          </Link>
          <Link href="/profile" className="nav-icon">
            <User className="w-5 h-5" />
          </Link>
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
                    href={m === "Cart" ? "/cart" : m === "Profile" ? "/profile" : m === "Login" ? "/login" : m === "Register" ? "/register" : m === "Contact" ? "#contact" : "/" + m.toLowerCase()} 
                    onClick={() => setOpen(false)}
                    variants={{ h: { y: 40, opacity: 0 }, s: { y: 0, opacity: 1 } }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {m}
                  </motion.a>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
