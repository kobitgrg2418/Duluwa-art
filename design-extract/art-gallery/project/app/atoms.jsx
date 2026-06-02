/* =========================================================================
   Atoms — placeholder art frame, reveal + parallax hooks, small UI
   (React via Babel; exported to window for cross-file use)
   ========================================================================= */
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

/* ---- watercolour-ish placeholder wash --------------------------------- */
function washStyle(hue, seed) {
  const h2 = hue + 16, h3 = hue - 14;
  return {
    background:
      `radial-gradient(60% 55% at 28% 22%, oklch(0.92 0.045 ${hue} / 0.9) 0%, transparent 60%),` +
      `radial-gradient(55% 60% at 78% 72%, oklch(0.86 0.055 ${h2} / 0.85) 0%, transparent 58%),` +
      `radial-gradient(70% 70% at 60% 40%, oklch(0.90 0.03 ${h3} / 0.6) 0%, transparent 70%),` +
      `oklch(0.935 0.022 ${hue})`,
  };
}

/* fine paper-grain overlay (very low contrast vertical tooth) */
const GRAIN = {
  position: "absolute", inset: 0, pointerEvents: "none",
  backgroundImage:
    "repeating-linear-gradient(90deg, rgba(35,33,32,0.025) 0px, rgba(35,33,32,0.025) 1px, transparent 1px, transparent 4px)," +
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 5px)",
  mixBlendMode: "multiply", opacity: 0.7,
};

/**
 * ArtFrame — labelled placeholder standing in for a watercolour.
 * props: hue, ratio (h/w), label, sub (dimensions), tall(bool), style, className,
 *        clickable(bool), onOpen()
 */
function ArtFrame({ hue = 40, ratio = 0.8, label = "watercolour", sub = "", style = {},
                    className = "", clickable = false, onOpen, parallax = 0, fill = false }) {
  const wrapStyle = fill
    ? { ...style }
    : { aspectRatio: `1 / ${ratio}`, ...style };
  const inner = (
    <React.Fragment>
      <div className="frame__scale" style={{ ...washStyle(hue) }}>
        <div style={GRAIN} />
        {/* deckle inner edge */}
        <div style={{ position: "absolute", inset: 10, border: "1px solid rgba(255,255,255,0.28)", boxShadow: "inset 0 0 50px rgba(35,33,32,0.06)" }} />
      </div>
      <div className="frame__cap">
        <span>◦ {label}</span>
        <span>{sub}</span>
      </div>
      {clickable && <div className="view-tag"><span>View</span></div>}
    </React.Fragment>
  );
  return (
    <div className={`frame ${clickable ? "art-clk" : ""} ${className}`}
         style={wrapStyle}
         data-parallax={parallax || undefined}
         onClick={clickable ? onOpen : undefined}>
      {inner}
    </div>
  );
}

/* ---- Eyebrow ---------------------------------------------------------- */
function Eyebrow({ idx, children, style }) {
  return (
    <span className="eyebrow" style={style}>
      {idx && <span className="idx">{idx}</span>}
      {children}
    </span>
  );
}

/* ---- Reveal (scroll-in) ----------------------------------------------- */
/* Renders hidden, then a global engine (useRevealEngine) flips `.in` when the
   element enters the viewport. We avoid per-element IntersectionObserver because
   it does not fire reliably in non-painting/background iframes. */
function Reveal({ children, className = "", delay = 0, clip = false, as = "div", style = {}, ...rest }) {
  const dcls = delay ? ` reveal-d${delay}` : "";
  const Tag = as;
  return (
    <Tag className={`${clip ? "clip" : "reveal"}${dcls} ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/* ---- Reveal engine: one global scroll/resize pass --------------------- */
function useRevealEngine() {
  useEffect(() => {
    let nodes = [];
    let ticking = false;
    const collect = () => { nodes = Array.from(document.querySelectorAll(".reveal:not(.in), .clip:not(.in)")); };
    const pass = () => {
      const vh = window.innerHeight;
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        if (r.top < vh * 0.98 && r.bottom > 0) n.classList.add("in");
      }
      nodes = nodes.filter((n) => !n.classList.contains("in"));
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(pass); } };
    collect(); pass();
    // re-collect a few times as the tree settles, then run a pass
    const timers = [120, 360, 800].map((ms) => setTimeout(() => { collect(); pass(); }, ms));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { collect(); onScroll(); });
    return () => { timers.forEach(clearTimeout); window.removeEventListener("scroll", onScroll); };
  }, []);
}

/* ---- Parallax engine: one global scroll listener ---------------------- */
function useParallaxEngine() {
  useEffect(() => {
    let nodes = [];
    let ticking = false;
    const collect = () => { nodes = Array.from(document.querySelectorAll("[data-parallax]")); };
    const update = () => {
      const vh = window.innerHeight;
      for (const n of nodes) {
        const speed = parseFloat(n.getAttribute("data-parallax")) || 0;
        const r = n.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const off = (center - vh / 2) / vh;        // -1..1 across viewport
        const scaleEl = n.querySelector(".frame__scale") || n;
        scaleEl.style.transform = `translate3d(0, ${(-off * speed * 100).toFixed(2)}px, 0)`;
      }
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    collect();
    // re-collect after mount settles (images/sections)
    const t = setTimeout(() => { collect(); update(); }, 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { collect(); onScroll(); });
    update();
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);
}

/* ---- Lightbox context ------------------------------------------------- */
const LightboxCtx = createContext({ open: () => {} });
const useLightbox = () => useContext(LightboxCtx);

Object.assign(window, {
  ArtFrame, Eyebrow, Reveal, washStyle, useParallaxEngine, useRevealEngine, LightboxCtx, useLightbox,
});
