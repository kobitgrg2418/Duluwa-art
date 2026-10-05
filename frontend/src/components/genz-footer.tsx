"use client";

import React from "react";
import "./genz-footer.css";

const SOCIALS = [
  { label: "Facebook", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Instagram", href: "#" },
];

const FOOTER_GROUPS = [
  {
    title: "ABOUT US",
    links: ["Pricing", "Contact", "FAQ", "Blog"],
  },
  {
    title: "SUPPORT",
    links: ["Help Center", "Terms", "Privacy", "Security"],
  },
  {
    title: "COMMUNITY",
    links: ["Forum", "Events", "Partners", "Affiliates", "Career"],
  },
  {
    title: "PRESS",
    links: [
      "Investors",
      "Terms of Use",
      "Privacy Policy",
      "Cookie Policy",
      "Legal",
    ],
  },
];

const BRAND_NAME = "DULUWA-ART";

export default function GenZGlassyFooter() {
  return (
    <footer className="kex-footer">
      <div className="kex-footer-inner">
        <nav
          className="kex-socials"
          aria-label="Social media links"
        >
          {SOCIALS.map((social) => (
            <a
              className="kex-social"
              href={social.href}
              key={social.label}
            >
              <span className="kex-social-name">
                {social.label}
              </span>

              <span
                className="kex-arrow"
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        <div className="kex-columns">
          {FOOTER_GROUPS.map((group) => (
            <section
              className="kex-column"
              key={group.title}
            >
              <h2 className="kex-column-title">
                {group.title}
              </h2>

              <ul className="kex-link-list">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      className="kex-footer-link"
                      href="#"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div
        className="kex-brand-zone"
        aria-label={BRAND_NAME}
      >
        <div className="kex-brand-glow" />

        <p
          className="kex-brand"
          data-brand={BRAND_NAME}
          aria-hidden="true"
        >
          {BRAND_NAME}
        </p>
      </div>

      <div className="kex-footer-bar">
        <a href="mailto:hello@duluwa-art.com" className="kex-footer-email">hello@duluwa-art.com</a>
        <div className="kex-footer-links">
          <a href="#" className="kex-footer-small-link">Privacy policy</a>
          <a href="#" className="kex-footer-small-link">Terms & conditions</a>
        </div>
        <span className="kex-footer-copyright">© 2025 DULUWA-ART</span>
      </div>
    </footer>
  );
}
