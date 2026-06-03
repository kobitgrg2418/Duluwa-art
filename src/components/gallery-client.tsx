"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { LightboxProvider } from "@/components/lightbox";
import { Reveal, Eyebrow, useRevealEngine, useLightbox } from "@/components/atoms";
import type { Artwork, Collection } from "@/lib/data";

const BENTO_PATTERNS = [
  { col: "1 / 3", row: "span 2" },
  { col: "3 / 4", row: "span 1" },
  { col: "4 / 5", row: "span 1" },
  { col: "3 / 5", row: "span 2" },
  { col: "1 / 2", row: "span 1" },
  { col: "2 / 3", row: "span 1" },
  { col: "1 / 3", row: "span 1" },
  { col: "3 / 5", row: "span 1" },
  { col: "1 / 2", row: "span 2" },
  { col: "2 / 4", row: "span 1" },
  { col: "4 / 5", row: "span 2" },
  { col: "2 / 4", row: "span 1" },
];

function collTitle(id: string, collections: Collection[]): string {
  const c = collections.find((x) => x.id === id);
  return c ? c.title : id;
}

function GalleryCard({ artwork, index, onOpen, collections }: { artwork: Artwork; index: number; onOpen: () => void; collections: Collection[] }) {
  const [hovered, setHovered] = useState(false);
  const pattern = BENTO_PATTERNS[index % BENTO_PATTERNS.length];

  return (
    <Reveal
      delay={(index % 3) + 1}
      className="gl-card"
      style={{ gridColumn: pattern.col, gridRow: pattern.row }}
    >
      <button
        className="gl-card__inner"
        onClick={onOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {artwork.image ? (
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover", transition: "transform 1.2s var(--ease-slow)" , transform: hovered ? "scale(1.06)" : "scale(1)" }}
          />
        ) : (
          <div className="gl-card__placeholder" />
        )}
        <div className={`gl-card__overlay ${hovered ? "gl-card__overlay--active" : ""}`}>
          <div className="gl-card__info">
            <span className="gl-card__coll">{collTitle(artwork.coll, collections)}</span>
            <h3 className="gl-card__title">{artwork.title}</h3>
            <span className="gl-card__meta">{artwork.medium} · {artwork.year}</span>
          </div>
          <span className="gl-card__view">View</span>
        </div>
        {artwork.status === "SOLD_OUT" && (
          <span className="gl-card__sold-badge">Sold Out</span>
        )}
      </button>
    </Reveal>
  );
}

function GalleryContent({ artworks, collections }: { artworks: Artwork[]; collections: Collection[] }) {
  const { open } = useLightbox();
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? artworks : artworks.filter((a) => a.coll === filter);
  const idxOf = (id: string) => artworks.findIndex((a) => a.id === id);

  return (
    <main className="gl-page">
      <header className="gl-hero">
        <div className="wrap">
          <Reveal><Eyebrow style={{ color: "rgba(250,248,243,0.5)" }}>The Collection</Eyebrow></Reveal>
          <Reveal delay={1}><h1 className="display h-lg" style={{ color: "var(--paper)", marginTop: ".6rem" }}>Gallery</h1></Reveal>
          <Reveal delay={2}>
            <p className="lede" style={{ maxWidth: "44ch", marginTop: "1rem", color: "rgba(250,248,243,0.65)" }}>
              A visual archive — browse every watercolour and sketch in the studio.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="gl-filters">
        <div className="wrap">
          <div className="gl-filters__row">
            <button className={`gl-chip ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>
              All <span className="gl-chip__n">{artworks.length}</span>
            </button>
            {collections.map((c) => (
              <button key={c.id} className={`gl-chip ${filter === c.id ? "on" : ""}`} onClick={() => setFilter(c.id)}>
                {c.title} <span className="gl-chip__n">{artworks.filter((a) => a.coll === c.id).length}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="gl-grid-section">
        <div className="wrap">
          <div className="gl-grid">
            {shown.map((a, i) => (
              <GalleryCard key={a.id} artwork={a} index={i} onOpen={() => open(idxOf(a.id))} collections={collections} />
            ))}
          </div>
        </div>
      </section>

      <section className="section is-dark" style={{ textAlign: "center" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal><Eyebrow style={{ justifyContent: "center" }}>Commission a piece</Eyebrow></Reveal>
          <Reveal delay={1}>
            <h2 className="display h-md" style={{ color: "var(--paper)", marginTop: "1rem" }}>
              Want something unique?
            </h2>
          </Reveal>
          <Reveal delay={2} style={{ marginTop: "2rem" }}>
            <Link href="/commission" className="btn" style={{ background: "var(--paper)", color: "var(--ink)" }}>
              Start a commission <span className="arr">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export function GalleryClient({ artworks, collections }: { artworks: Artwork[]; collections: Collection[] }) {
  useRevealEngine();
  return (
    <LightboxProvider items={artworks}>
      <Nav onDark />
      <GalleryContent artworks={artworks} collections={collections} />
      <Footer />
    </LightboxProvider>
  );
}
