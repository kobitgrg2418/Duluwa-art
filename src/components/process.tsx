"use client";

import { useState, useEffect, useRef } from "react";
import { Eyebrow } from "./atoms";
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
            <video
              autoPlay muted loop playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src="/assets/1733206571917552.mov" type="video/mp4" />
            </video>
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
