"use client";

import Link from "next/link";
import { ArtFrame, Reveal, Eyebrow } from "./atoms";
import type { Artwork } from "@/lib/data";

export function Exhibition({ artworks }: { artworks: Artwork[] }) {
  const wall = [artworks[0], artworks[8], artworks[2], artworks[6], artworks[3]].filter(Boolean);

  return (
    <section className="section--tight section exhibition" id="exhibition">
      <div className="wrap">
        <div className="exhibition__head">
          <div>
            <Reveal><Eyebrow idx="04">Virtual Exhibition</Eyebrow></Reveal>
            <Reveal delay={1}><h2 className="display h-lg" style={{ marginTop: "1rem" }}>Walk the room</h2></Reveal>
          </div>
          <Reveal delay={2} className="exhibition__head-r">
            <p className="serif-body">A curated hang of eleven works, lit and spaced as they would be on the wall. Step inside and move at your own pace.</p>
          </Reveal>
        </div>
      </div>

      <Reveal className="exhibition__room">
        <div className="exhibition__wall" data-parallax="3">
          {wall.map((a, i) => (
            <figure className="exhibition__hang" key={a.id} style={{ "--i": i } as React.CSSProperties}>
              <ArtFrame
                hue={a.hue} ratio={a.ratio > 1 ? 1.18 : 0.78} fill
                image={a.image}
                style={{ height: i % 2 ? "240px" : "300px" }}
                label={a.title.toLowerCase()} sub={a.size}
              />
              <figcaption className="meta exhibition__plate">{a.title} · {a.year}</figcaption>
            </figure>
          ))}
        </div>
        <div className="exhibition__floor" />
        <Link href="/collections" className="exhibition__enter">
          <span className="btn" style={{ background: "var(--paper)", color: "var(--ink)" }}>Enter the exhibition <span className="arr">→</span></span>
        </Link>
      </Reveal>
    </section>
  );
}
