"use client";

import { useState, useEffect } from "react";
import { Reveal, Eyebrow } from "./atoms";
import type { Testimonial } from "@/lib/data";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const T = testimonials;
  const [i, setI] = useState(0);
  const go = (d: number) => setI((p) => (p + d + T.length) % T.length);

  useEffect(() => {
    if (T.length === 0) return;
    const t = setInterval(() => setI((p) => (p + 1) % T.length), 7000);
    return () => clearInterval(t);
  }, [T.length]);

  if (T.length === 0) return null;
  const t = T[i];

  return (
    <section className="section testimonials" id="testimonials">
      <div className="wrap testimonials__inner">
        <Reveal><Eyebrow idx="07">In Their Words</Eyebrow></Reveal>
        <div className="testimonials__stage">
          <span className="testimonials__mark">&ldquo;</span>
          <Reveal delay={1}>
            <blockquote key={i} className="testimonials__quote display">{t.quote}</blockquote>
          </Reveal>
          <div className="testimonials__foot">
            <div className="testimonials__who">
              <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.3rem" }}>{t.who}</span>
              <span className="meta">{t.role}</span>
            </div>
            <div className="testimonials__ctrl">
              <button onClick={() => go(-1)} aria-label="Previous">‹</button>
              <span className="mono">{String(i + 1).padStart(2, "0")} / {String(T.length).padStart(2, "0")}</span>
              <button onClick={() => go(1)} aria-label="Next">›</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
