"use client";

import Link from "next/link";
import { ArtFrame, Reveal, Eyebrow } from "./atoms";
import { ARTWORKS } from "@/lib/data";

function ScrollCue({ dark }: { dark?: boolean }) {
  return (
    <Link href="#featured" className="hero-cue" style={{ color: dark ? "var(--paper)" : "var(--ink)" }}>
      <span className="meta" style={{ color: "inherit", opacity: 0.7 }}>Scroll</span>
      <span className="hero-cue__line" />
    </Link>
  );
}

function HeroImmersion() {
  const hero = ARTWORKS[2];
  return (
    <header className="hero hero--imm" id="top">
      <ArtFrame hue={hero.hue} fill parallax={14} className="hero--imm__bg"
                image={hero.image} label={hero.title.toLowerCase()} sub={hero.size} />
      <div className="hero--imm__scrim" />
      <div className="wrap hero--imm__inner">
        <Reveal className="hero--imm__top"><Eyebrow>Watercolour · Nepal · Est. 2009</Eyebrow></Reveal>
        <div className="hero--imm__btm">
          <Reveal delay={1}>
            <h1 className="display h-xl" style={{ color: "var(--paper)" }}>
              The Himalaya,<br /><em style={{ fontStyle: "italic", fontWeight: 300 }}>in water.</em>
            </h1>
          </Reveal>
          <Reveal delay={2} className="hero--imm__meta">
            <p className="serif-body" style={{ color: "rgba(250,248,243,0.82)", maxWidth: "34ch" }}>
              The watercolours of Kobit Gurung — a self-taught painter of Nepal&apos;s people, peaks and wild places.
            </p>
            <Link href="#featured" className="btn" style={{ background: "var(--paper)", color: "var(--ink)" }}>
              Enter the gallery <span className="arr">→</span>
            </Link>
          </Reveal>
        </div>
      </div>
      <ScrollCue dark />
    </header>
  );
}

export function Hero() {
  return <HeroImmersion />;
}
