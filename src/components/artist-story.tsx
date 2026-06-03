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
              No school taught these hands. The mountains did.
            </h2>
          </Reveal>
          <Reveal delay={2} className="story__body">
            <p className="serif-body">
              Kobit Gurung never sat in an art academy. He learned to paint and sketch the way the rivers of his country learned to carve stone — slowly, by returning to the same place again and again.
            </p>
            <p className="serif-body">
              Born in the hills above Pokhara, he traded a first brush for a week&apos;s wages and taught himself the patience that watercolour and pencil demand: that light cannot be added, only protected; that a single sketch line can hold as much truth as a finished wash.
            </p>
            <Reveal className="story__quote" as="blockquote">
              <span className="story__mark">&ldquo;</span>
              I am not painting the mountain. I am painting the morning the mountain let me see it.
            </Reveal>
            <p className="serif-body">
              Two decades on, his works hang in collections from Pokhara to Zürich — yet each begins the same way, with torn paper and a glass of clean water at dawn.
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
