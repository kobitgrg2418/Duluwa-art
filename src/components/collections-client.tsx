"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArtFrame, Reveal, Eyebrow, useRevealEngine, useLightbox } from "@/components/atoms";
import { Nav } from "@/components/nav";
import { LightboxProvider } from "@/components/lightbox";
import { Footer } from "@/components/footer";
import { useCart } from "@/components/cart";
import type { Collection, Artwork } from "@/lib/data";

function collTitle(id: string, collections: Collection[]): string {
  const c = collections.find((x) => x.id === id);
  return c ? c.title : id;
}

function CollectionsContent({ collections, artworks }: { collections: Collection[]; artworks: Artwork[] }) {
  const C = collections;
  const A = artworks;
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { open } = useLightbox();
  const { add, remove, items } = useCart();
  const inCart = (id: string) => items.some((i) => i.artwork.id === id);

  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (h && C.some((c) => c.id === h)) setFilter(h);
  }, [C]);

  const shown = useMemo(() => {
    const q = search.toLowerCase();
    return A.filter((a) => {
      if (filter !== "all" && a.coll !== filter) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.medium.toLowerCase().includes(q) && !a.year.includes(q)) return false;
      return true;
    });
  }, [filter, search, A]);
  const idxOf = (id: string) => A.findIndex((a) => a.id === id);

  return (
    <main>
      <header className="cp-hero cp-hero--bg">
        <div className="cp-hero__img" style={{ backgroundImage: "url(/assets/IMG_9195.jpeg)" }} />
        <div className="cp-hero__scrim" />
        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          <Reveal><Eyebrow style={{ color: "rgba(250,248,243,0.7)" }}>The Archive</Eyebrow></Reveal>
          <Reveal delay={1}><h1 className="display h-xl" style={{ color: "var(--paper)" }}>Collections</h1></Reveal>
          <Reveal delay={2}>
            <p className="lede" style={{ maxWidth: "40ch", marginTop: "1.2rem", color: "rgba(250,248,243,0.8)" }}>
              One hundred and thirty works in water — sorted into the six worlds the artist returns to.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="cp-filters">
        <div className="wrap">
          <div className="cp-search-row">
            <div className="cp-search">
              <span className="cp-search__icon">&#128269;</span>
              <input
                type="text"
                className="cp-search__input"
                placeholder="Search artworks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="cp-search__clear" onClick={() => setSearch("")}>&times;</button>
              )}
            </div>
            {search && (
              <span className="cp-search__count mono">
                {shown.length} result{shown.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="cp-filters__row">
            <button className={`cp-chip ${filter === "all" ? "on" : ""}`} onClick={() => { setFilter("all"); setSearch(""); }}>
              All works <span className="cp-chip__n mono">{A.length}</span>
            </button>
            {C.map((c) => {
              const count = A.filter((a) => a.coll === c.id).length;
              return (
                <button key={c.id} className={`cp-chip ${filter === c.id ? "on" : ""}`} onClick={() => setFilter(c.id)}>
                  {c.title} <span className="cp-chip__n mono">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="section--tight section">
        <div className="wrap">
          {shown.length === 0 ? (
            <div style={{ padding: "clamp(4rem, 10vw, 8rem) 0", textAlign: "center" }}>
              <p className="serif-body" style={{ color: "var(--ink-faint)" }}>
                No artworks in this collection yet.
              </p>
              <button className="link-u" style={{ marginTop: "1rem" }} onClick={() => setFilter("all")}>
                View all works <span className="arr">&rarr;</span>
              </button>
            </div>
          ) : (
            <div className="cp-grid">
              {shown.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) + 1} className="cp-item">
                  <ArtFrame
                    hue={a.hue} ratio={1.25} clickable
                    image={a.image}
                    onOpen={() => open(idxOf(a.id))}
                    label={a.title.toLowerCase()} sub={a.size}
                  />
                  <div className="cp-item__cap">
                    <div>
                      <h3 className="display" style={{ fontSize: "1.5rem", margin: 0 }}>{a.title}</h3>
                      <span className="meta">{collTitle(a.coll, collections)}</span>
                    </div>
                    <span className="meta">{a.year}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="display" style={{ fontSize: "1.2rem", color: a.status === "SOLD_OUT" ? "var(--ink-faint)" : "var(--gold)" }}>
                      {a.status === "SOLD_OUT" ? "Sold Out" : `Rs ${a.price.toLocaleString()}`}
                    </span>
                    {a.status === "SOLD_OUT" ? (
                      <span className="add-cart-btn sold-out-badge">Sold Out</span>
                    ) : (
                      <button
                        className={`add-cart-btn ${inCart(a.id) ? "added" : ""}`}
                        onClick={() => inCart(a.id) ? remove(a.id) : add(a)}
                      >
                        {inCart(a.id) ? "Remove" : "Add to Cart"}
                      </button>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section is-dark" style={{ textAlign: "center" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal><Eyebrow style={{ justifyContent: "center" }}>Bring one home</Eyebrow></Reveal>
          <Reveal delay={1}>
            <h2 className="display h-lg" style={{ color: "var(--paper)", marginTop: "1rem" }}>
              Originals & commissions
            </h2>
          </Reveal>
          <Reveal delay={2} style={{ marginTop: "2rem" }}>
            <Link href="/commission" className="btn" style={{ background: "var(--paper)", color: "var(--ink)" }}>
              Inquire about a work <span className="arr">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export function CollectionsClient({ collections, artworks }: { collections: Collection[]; artworks: Artwork[] }) {
  useRevealEngine();

  return (
    <LightboxProvider items={artworks}>
      <Nav onDark />
      <CollectionsContent collections={collections} artworks={artworks} />
      <Footer />
    </LightboxProvider>
  );
}
