"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArtFrame, Reveal, Eyebrow } from "./atoms";
import { COLLECTIONS } from "@/lib/data";

export function CollectionsPreview() {
  const C = COLLECTIONS;
  const [active, setActive] = useState(0);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const secRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  const recalc = useCallback(() => {
    const card = cardRefs.current[active];
    const vp = trackRef.current?.parentElement;
    if (!card || !vp) return;
    setOffset(vp.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2));
  }, [active]);

  useEffect(() => {
    recalc();
    const t = setTimeout(recalc, 350);
    window.addEventListener("resize", recalc);
    return () => { clearTimeout(t); window.removeEventListener("resize", recalc); };
  }, [recalc]);

  useEffect(() => {
    const check = () => {
      const el = secRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setInView(r.top < vh * 0.7 && r.bottom > vh * 0.3);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, []);

  useEffect(() => {
    if (paused || !inView) return;
    const t = setInterval(() => {
      setActive((p) => (p + 1) % C.length);
    }, 3800);
    return () => clearInterval(t);
  }, [paused, inView, C.length]);

  const go = (d: number) => setActive((p) => Math.min(C.length - 1, Math.max(0, p + d)));
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
        <div className="cslider__track" ref={trackRef} style={{ transform: `translate3d(${offset}px,0,0)` }}>
          {C.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`ccard ${i === active ? "on" : ""}`}
              aria-label={c.title}
              onClick={() => (i === active ? window.location.assign(`/collections#${c.id}`) : setActive(i))}
            >
              <span className="ccard__no mono">{c.no}</span>
              <div className="ccard__art">
                <ArtFrame hue={c.hue} fill style={{ height: "100%" }} label={c.title.toLowerCase()} sub={`${c.count} works`} />
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
