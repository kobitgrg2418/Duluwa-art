"use client";

import Link from "next/link";
import { Reveal, Eyebrow } from "./atoms";

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap">
        <Reveal><Eyebrow idx="10">Studio</Eyebrow></Reveal>
        <Reveal delay={1}><h2 className="footer__word">Duluwa<br />Art</h2></Reveal>
        <div className="footer__grid">
          <div>
            <h5>The Studio</h5>
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", lineHeight: 1.45, color: "rgba(250,248,243,0.82)" }}>
              Duluwa Art is the studio of Kobit Gurung — a self-taught watercolourist and sketch artist working from a Pokhara courtyard, painting and drawing the people, peaks and wildlife of Nepal.
            </p>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              <li><Link href="/#featured">Featured Works</Link></li>
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/#story">Artist Story</Link></li>
              <li><Link href="/#exhibition">Virtual Exhibition</Link></li>
            </ul>
          </div>
          <div>
            <h5>Connect</h5>
            <ul>
              <li><Link href="/commission">Commission a Work</Link></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Behance</a></li>
              <li><a href="#">Newsletter</a></li>
            </ul>
          </div>
          <div>
            <h5>Visit</h5>
            <p style={{ color: "rgba(250,248,243,0.78)" }}>
              Studio by appointment<br />Lakeside<br />Pokhara, Nepal
            </p>
            <a href="mailto:kobit.gurung@studio.np" className="link-u" style={{ color: "var(--paper)", marginTop: ".4rem" }}>
              kobit.gurung@studio.np <span className="arr">→</span>
            </a>
          </div>
        </div>
        <div className="footer__fine">
          <span>© 2026 Duluwa Art — All works © Kobit Gurung.</span>
          <span>Watercolour on cotton rag · Pokhara</span>
        </div>
      </div>
    </footer>
  );
}
