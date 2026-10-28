"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, X, ArrowUpRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function RevixNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Exhibitions & Art", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "About Duluwa", href: "/about" },
    { label: "Commission", href: "/commission" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top Gallery Information Bar */}
      <div className="rx-header-top hidden md:flex">
        <div className="flex items-center gap-6">
          <span>Location: Thamel, Kathmandu, Nepal</span>
          <span>•</span>
          <span>Gallery Hours: Daily 10 AM – 7 PM</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/contact" className="hover:text-black transition-colors">Visit Gallery</Link>
          <span>•</span>
          <a href="mailto:info@duluwaart.com" className="hover:text-black transition-colors">info@duluwaart.com</a>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className="rx-navbar">
        <div className="rx-navbar-inner">
          {/* Logo */}
          <Link href="/" className="rx-logo">
            Duluwa<span className="rx-logo-dot"></span>Art
          </Link>

          {/* Desktop Nav Links */}
          <div className="rx-nav-links">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rx-nav-link ${isActive ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions & Utilities */}
          <div className="rx-nav-actions">
            <Link
              href="/cart"
              className="relative p-2 text-black hover:opacity-70 transition-opacity"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/profile"
              className="p-2 text-black hover:opacity-70 transition-opacity"
              aria-label="Account Profile"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link href="/commission" className="rx-btn rx-btn-black hidden sm:inline-flex">
              Commission Artwork <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-black hover:opacity-70"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-black/10 bg-[#fcfcfc] px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold py-2 border-b border-black/5 flex justify-between items-center text-black"
              >
                {link.label}
                <ArrowUpRight className="w-4 h-4 text-black/40" />
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/commission"
                onClick={() => setMobileOpen(false)}
                className="rx-btn rx-btn-black w-full text-center"
              >
                Commission Artwork
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
