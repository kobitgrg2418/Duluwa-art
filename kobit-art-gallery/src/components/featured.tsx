"use client";

import Link from "next/link";
import { ArtFrame, Reveal, Eyebrow, useLightbox } from "./atoms";
import { ARTWORKS, artIndex } from "@/lib/data";

export function Featured() {
  const { open } = useLightbox();
  const items = ARTWORKS.filter((a) => a.feat);

  const collLabel = (coll: string) => {
    if (coll === "himalaya") return "Himalayan Landscapes";
    if (coll === "portrait") return "Portraits";
    if (coll === "wildlife") return "Wildlife";
    return "Nepalese Culture";
  };

  return (
    <section className="section featured" id="featured">
      <div className="wrap">
        <div className="featured__head">
          <div className="featured__head-l">
            <Reveal><Eyebrow idx="01">Selected Works</Eyebrow></Reveal>
            <Reveal delay={1}><h2 className="display h-lg">Paintings worth<br />standing still for</h2></Reveal>
          </div>
          <Reveal delay={2} className="featured__head-r">
            <p className="serif-body">Four works from the studio — each a single, unrepeatable conversation between water, pigment and the tooth of the paper.</p>
            <Link href="/collections" className="link-u">All collections <span className="arr">→</span></Link>
          </Reveal>
        </div>

        <div className="featured__rows">
          {items.map((a, i) => (
            <Reveal clip key={a.id} className={`featured__row ${i % 2 ? "rev" : ""}`}>
              <ArtFrame
                hue={a.hue} ratio={1} clickable
                image={a.image}
                onOpen={() => open(artIndex(a.id))}
                label={a.title.toLowerCase()} sub={a.size} className="featured__art"
              />
              <div className="featured__txt">
                <div className="featured__lead">
                  <span className="featured__no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="meta">{collLabel(a.coll)}</span>
                </div>
                <h3 className="display h-md featured__title">{a.title}</h3>
                <p className="lede" style={{ fontSize: "1.18rem", maxWidth: "32ch" }}>{a.note}</p>
                <div className="featured__meta">
                  <span className="meta">{a.medium}</span>
                  <span className="meta">{a.size} · {a.year}</span>
                </div>
                <button className="link-u" onClick={() => open(artIndex(a.id))}>View work <span className="arr">→</span></button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
