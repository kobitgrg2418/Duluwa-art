"use client";

import { useState, useCallback, useEffect, ReactNode } from "react";
import { ArtFrame, LightboxCtx } from "./atoms";
import { Artwork } from "@/lib/data";

export function LightboxProvider({ items, children }: { items: Artwork[]; children: ReactNode }) {
  const [idx, setIdx] = useState(-1);
  const open = useCallback((i: number) => setIdx(i), []);
  const close = useCallback(() => setIdx(-1), []);
  const go = useCallback((d: number) => setIdx((p) => (p + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (idx >= 0) document.body.setAttribute("data-lightbox-open", "");
    else document.body.removeAttribute("data-lightbox-open");
    const onKey = (e: KeyboardEvent) => {
      if (idx < 0) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, close, go]);

  const cur = idx >= 0 ? items[idx] : null;

  return (
    <LightboxCtx.Provider value={{ open }}>
      {children}
      <div
        className={`lb ${idx >= 0 ? "open" : ""}`}
        onClick={(e) => { if ((e.target as HTMLElement).classList.contains("lb")) close(); }}
      >
        {cur && (
          <>
            <button className="lb__close" onClick={close}>Close ✕</button>
            <button className="lb__nav lb__nav--prev" onClick={() => go(-1)} aria-label="Previous">‹</button>
            <button className="lb__nav lb__nav--next" onClick={() => go(1)} aria-label="Next">›</button>
            <div className="lb__stage">
              <ArtFrame
                hue={cur.hue}
                fill
                image={cur.image}
                style={{ height: "min(72vh,740px)", width: "100%" }}
                label={cur.title.toLowerCase()}
                sub={cur.size}
              />
              <div className="lb__bar">
                <div>
                  <h3>{cur.title}</h3>
                  <div className="meta" style={{ marginTop: 6 }}>{cur.medium} · {cur.year}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".4rem" }}>
                  <span className="lb__count">{String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
                  <span className="meta" style={{ maxWidth: 280, textAlign: "right", fontStyle: "italic", fontFamily: "var(--serif)", fontSize: "1rem" }}>
                    {cur.note}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </LightboxCtx.Provider>
  );
}
