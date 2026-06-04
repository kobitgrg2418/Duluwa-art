"use client";

import { useState, useEffect } from "react";
import { ArtFrame, Reveal, Eyebrow } from "./atoms";
import type { Artwork } from "@/lib/data";

export function ArtistStory({ artworks }: { artworks: Artwork[] }) {
  const SLIDES = artworks.filter((a) => a.image).slice(0, 6);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (SLIDES.length === 0) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % SLIDES.length), 2000);
    return () => clearInterval(t);
  }, [SLIDES.length]);

  const cur = SLIDES[idx];
  if (!cur) return null;

  return (
    <section className="section story" id="story">
      <div className="wrap story__grid">
        <div className="story__col-img">
          <Reveal clip>
            <ArtFrame hue={cur.hue} ratio={1.22} label={cur.title.toLowerCase()} sub={cur.size}
                      image={cur.image} />
          </Reveal>
          <Reveal delay={2} className="story__cap meta">{cur.title} · {cur.year}</Reveal>
        </div>
        <div className="story__col-txt">
          <Reveal><Eyebrow idx="03">The Artist</Eyebrow></Reveal>
          <Reveal delay={1}>
            <h2 className="display h-md" style={{ marginTop: "1.2rem" }}>
              It started with tiny stickers and a brother to beat.
            </h2>
          </Reveal>
          <Reveal delay={2} className="story__body">
            <p className="serif-body">
              At seven or eight, Kobit Gurung was hunched over anime stickers with his brother, racing to see who could copy the characters more faithfully. It was never homework &mdash; it was a dare, a game, a quiet obsession that refused to stay quiet.
            </p>
            <p className="serif-body">
              As the years passed, the stickers gave way to sketchbooks, and the kitchen-table rivalry grew into something larger. He began representing his school in district-level competitions, discovering that the thing he did for fun was also the thing he did best.
            </p>
            <Reveal className="story__quote" as="blockquote">
              <span className="story__mark">&ldquo;</span>
              Sketching, drawing, painting &mdash; I never chose this path. It simply never let me choose another.
            </Reveal>
            <p className="serif-body">
              No academy shaped his hand. The passion came first, and the craft followed &mdash; built one line, one wash, one late night at a time. Today, from a studio in Pokhara, that same childhood impulse drives every brushstroke: the pure, stubborn love of making marks on paper.
            </p>
            <div className="story__stats">
              <div><span className="display" style={{ fontSize: "2.6rem" }}>17</span><span className="meta">Years painting</span></div>
              <div><span className="display" style={{ fontSize: "2.6rem" }}>130<span style={{ fontSize: "1.4rem" }}>+</span></span><span className="meta">Works in collections</span></div>
              <div><span className="display" style={{ fontSize: "2.6rem" }}>9</span><span className="meta">Solo exhibitions</span></div>
            </div>
            <div className="story__sign">Kobit Gurung</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
