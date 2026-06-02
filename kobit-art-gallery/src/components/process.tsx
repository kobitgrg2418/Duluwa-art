"use client";

import { useState, useEffect, useRef } from "react";
import { ArtFrame, Eyebrow } from "./atoms";
import { PROCESS } from "@/lib/data";

export function Process() {
  const P = PROCESS;
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      });
    }, { threshold: 0.6 });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section is-dark process" id="process">
      <div className="wrap process__grid">
        <div className="process__sticky">
          <div className="process__head">
            <Eyebrow idx="05">The Process</Eyebrow>
            <h2 className="display h-md" style={{ color: "var(--paper)", marginTop: "1rem" }}>How a wash<br />becomes a world</h2>
          </div>
          <div className="process__viz">
            {P.map((p, i) => (
              <div key={p.no} className={`process__viz-img ${active === i ? "on" : ""}`}>
                <ArtFrame hue={p.hue} fill style={{ height: "100%" }} label={p.title.toLowerCase()} sub={`stage ${p.no}`} />
              </div>
            ))}
            <span className="process__viz-no mono">{P[active].no} / 04</span>
          </div>
        </div>
        <ol className="process__steps">
          {P.map((p, i) => (
            <li
              key={p.no}
              ref={(el) => { refs.current[i] = el; }}
              data-i={i}
              className={`process__step ${active === i ? "on" : ""}`}
            >
              <span className="process__step-no mono">{p.no}</span>
              <h3 className="display" style={{ fontSize: "clamp(1.8rem,3.4vw,2.8rem)", color: "var(--paper)" }}>{p.title}</h3>
              <p className="serif-body">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
