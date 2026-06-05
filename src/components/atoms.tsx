"use client";

import { useEffect, useRef, useCallback, createContext, useContext, CSSProperties, ReactNode } from "react";
import Image from "next/image";

/* ---- Watercolour wash style -------------------------------------------- */
export function washStyle(hue: number) {
  const h2 = hue + 16, h3 = hue - 14;
  return {
    background:
      `radial-gradient(60% 55% at 28% 22%, oklch(0.92 0.045 ${hue} / 0.9) 0%, transparent 60%),` +
      `radial-gradient(55% 60% at 78% 72%, oklch(0.86 0.055 ${h2} / 0.85) 0%, transparent 58%),` +
      `radial-gradient(70% 70% at 60% 40%, oklch(0.90 0.03 ${h3} / 0.6) 0%, transparent 70%),` +
      `oklch(0.935 0.022 ${hue})`,
  };
}

const GRAIN: CSSProperties = {
  position: "absolute", inset: 0, pointerEvents: "none",
  backgroundImage:
    "repeating-linear-gradient(90deg, rgba(35,33,32,0.025) 0px, rgba(35,33,32,0.025) 1px, transparent 1px, transparent 4px)," +
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 5px)",
  mixBlendMode: "multiply", opacity: 0.7,
};

/* ---- ArtFrame ---------------------------------------------------------- */
interface ArtFrameProps {
  hue?: number;
  ratio?: number;
  label?: string;
  sub?: string;
  style?: CSSProperties;
  className?: string;
  clickable?: boolean;
  onOpen?: () => void;
  parallax?: number;
  fill?: boolean;
  image?: string;
}

export function ArtFrame({
  hue = 40, ratio = 0.8, label = "watercolour", sub = "", style = {},
  className = "", clickable = false, onOpen, parallax = 0, fill = false, image
}: ArtFrameProps) {
  const wrapStyle = fill ? { ...style } : { aspectRatio: `1 / ${ratio}`, ...style };

  return (
    <div
      className={`frame ${clickable ? "art-clk" : ""} ${className}`}
      style={wrapStyle}
      data-parallax={parallax || undefined}
      onClick={clickable ? onOpen : undefined}
    >
      {image ? (
        <>
          <div className="frame__scale" style={{ position: "absolute", inset: 0 }}>
            <Image src={image} alt={label} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </>
      ) : (
        <div className="frame__scale" style={{ ...washStyle(hue), position: fill ? "absolute" : undefined, inset: fill ? 0 : undefined }}>
          <div style={GRAIN} />
          <div style={{ position: "absolute", inset: 10, border: "1px solid rgba(255,255,255,0.28)", boxShadow: "inset 0 0 50px rgba(35,33,32,0.06)" }} />
        </div>
      )}
      <div className="frame__cap">
        <span>&#x25E6; {label}</span>
        <span>{sub}</span>
      </div>
      {clickable && (
        <div className="view-tag"><span>View</span></div>
      )}
    </div>
  );
}

/* ---- Eyebrow ----------------------------------------------------------- */
interface EyebrowProps {
  idx?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function Eyebrow({ idx, children, style }: EyebrowProps) {
  return (
    <span className="eyebrow" style={style}>
      {idx && <span className="idx">{idx}</span>}
      {children}
    </span>
  );
}

/* ---- Reveal ------------------------------------------------------------ */
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  clip?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  style?: CSSProperties;
  [key: string]: unknown;
}

export function Reveal({ children, className = "", delay = 0, clip = false, as: Tag = "div", style = {}, ...rest }: RevealProps) {
  const dcls = delay ? ` reveal-d${delay}` : "";
  const baseCls = clip ? "clip-el" : "reveal-el";
  return (
    <Tag className={`${baseCls}${dcls} ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/* ---- Reveal engine ----------------------------------------------------- */
export function useRevealEngine() {
  useEffect(() => {
    let nodes: Element[] = [];
    let ticking = false;
    const collect = () => { nodes = Array.from(document.querySelectorAll(".reveal-el:not(.in), .clip-el:not(.in)")); };
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
    const timers = [120, 360, 800].map((ms) => setTimeout(() => { collect(); pass(); }, ms));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { collect(); onScroll(); });

    // Watch for new elements added by React re-renders (e.g. filter changes)
    const observer = new MutationObserver(() => {
      collect();
      if (!ticking) { ticking = true; requestAnimationFrame(pass); }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => { timers.forEach(clearTimeout); window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);
}

/* ---- Parallax engine --------------------------------------------------- */
export function useParallaxEngine() {
  useEffect(() => {
    let nodes: Element[] = [];
    let ticking = false;
    const collect = () => { nodes = Array.from(document.querySelectorAll("[data-parallax]")); };
    const update = () => {
      const vh = window.innerHeight;
      for (const n of nodes) {
        const speed = parseFloat(n.getAttribute("data-parallax") || "0");
        const r = n.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const off = (center - vh / 2) / vh;
        const scaleEl = (n.querySelector(".frame__scale") || n) as HTMLElement;
        scaleEl.style.transform = `translate3d(0, ${(-off * speed * 100).toFixed(2)}px, 0)`;
      }
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    collect();
    const t = setTimeout(() => { collect(); update(); }, 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { collect(); onScroll(); });
    update();
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);
}

/* ---- Lightbox context -------------------------------------------------- */
interface LightboxContextType {
  open: (i: number) => void;
}

export const LightboxCtx = createContext<LightboxContextType>({ open: () => {} });
export const useLightbox = () => useContext(LightboxCtx);
