"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArtFrame, Reveal, Eyebrow } from "./atoms";
import type { Collection, Artwork } from "@/lib/data";

export function CollectionsPreview({ collections, artworks }: { collections: Collection[]; artworks: Artwork[] }) {
  const C = collections;

  function coverImage(collId: string) {
    const coll = collections.find((c) => c.id === collId);
    if (coll?.cover) return coll.cover;
    const art = artworks.find((a) => a.coll === collId && a.image);
    return art?.image;
  }

  const [active, setActive] = useState(0);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const secRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  const recalc = useCallback(() => {
    const card = cardRefs.current[active];
    const vp = trackRef.current?.parentElement;
    if (!card || !vp) return;
    const vpCenter = vp.clientWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    setOffset(vpCenter - cardCenter);
  }, [active]);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    recalc();
    const raf = requestAnimationFrame(() => recalc());
    const handleResize = () => recalc();
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [recalc, ready]);

  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView) return;
    const t = setInterval(() => {
      setActive((p) => (p + 1) % C.length);
    }, 3000);
    return () => clearInterval(t);
  }, [paused, inView, C.length]);

  const go = useCallback(
    (d: number) => setActive((p) => Math.min(C.length - 1, Math.max(0, p + d))),
    [C.length]
  );

  const cur = C[active];

  return (
    <section
      className="section is-dark cslider-sec" id="collections" ref={secRef}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}
    >
      <div className="wrap">
        <div className="cslider-head">
          <div className="cslider-head__l">
            <Reveal><Eyebrow idx="02">Collections</Eyebrow></Reveal>
            <Reveal delay={1}><h2 className="display h-lg" style={{ color: "var(--paper)" }}>Six bodies<br />of work</h2></Reveal>
          </div>
          <Reveal delay={2} className="cslider-head__r">
            <p className="serif-body">Six recurring worlds the artist returns to. Bring one into focus.</p>
          </Reveal>
        </div>
      </div>

      <div className="cslider__viewport">
        <div
          className="cslider__track"
          ref={trackRef}
          style={{
            transform: `translate3d(${offset}px,0,0)`,
            transition: ready ? "transform 0.9s cubic-bezier(0.22,1,0.36,1)" : "none",
          }}
        >
          {C.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`ccard ${i === active ? "on" : ""}`}
              aria-label={c.title}
              onClick={() => {
                if (i === active) {
                  window.location.assign(`/collections#${c.id}`);
                } else {
                  setActive(i);
                }
              }}
            >
              <span className="ccard__no mono">{c.no}</span>
              <div className="ccard__art">
                <ArtFrame hue={c.hue} fill style={{ height: "100%" }} label={c.title.toLowerCase()} sub={`${c.count} works`} image={coverImage(c.id)} />
              </div>
              <div className="ccard__cap">
                <h3 className="display">{c.title}</h3>
                <span className="meta">{c.count} works</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="wrap">
        <div className="cslider__bar">
          <div className="cslider__info" key={active}>
            <p className="serif-body" style={{ margin: 0, maxWidth: "42ch" }}>{cur.blurb}</p>
            <Link href={`/collections#${cur.id}`} className="link-u" style={{ color: "var(--paper)" }}>
              View {cur.title} <span className="arr">→</span>
            </Link>
          </div>
          <div className="cslider__ctrl">
            <button onClick={() => go(-1)} disabled={active === 0} aria-label="Previous">‹</button>
            <span className="mono">{cur.no} / {String(C.length).padStart(2, "0")}</span>
            <button onClick={() => go(1)} disabled={active === C.length - 1} aria-label="Next">›</button>
          </div>
        </div>
        <div className="cslider__dots">
          {C.map((c, i) => (
            <button key={c.id} className={`cdot ${i === active ? "on" : ""}`} onClick={() => setActive(i)} aria-label={c.title}>
              <span style={{ width: i === active ? "46px" : "20px" }}></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
