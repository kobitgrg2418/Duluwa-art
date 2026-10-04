"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { FlowButton } from "@/components/ui/flow-button";

interface ScrollHeroProps {
  heroImage?: string;
}

interface Beat {
  a: number;
  b: number;
  hold?: boolean;
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center" | "right";
}

const beats: Beat[] = [
  {
    a: 0,
    b: 0.14,
    hold: true,
    eyebrow: "Original Watercolors",
    title: "Where Art Meets Nature",
    description: "Discover the breathtaking watercolor masterpieces of Kobit Gurung — capturing the raw beauty of Nepal's landscapes.",
    align: "left",
  },
  {
    a: 0.2,
    b: 0.4,
    eyebrow: "01 — The Collection",
    title: "130+ Artworks",
    description: "Explore a curated collection of Himalayan landscapes, wildlife, and cultural heritage through masterful brushwork.",
    align: "left",
  },
  {
    a: 0.45,
    b: 0.68,
    eyebrow: "02 — The Process",
    title: "17 Years of Mastery",
    description: "Each piece tells a story of observation, patience, and the delicate balance of water and pigment.",
    align: "left",
  },
  {
    a: 0.74,
    b: 0.95,
    eyebrow: "03 — The Experience",
    title: "Commission Your Vision",
    description: "Bring your artistic vision to life with bespoke watercolor creations tailored to your story.",
    align: "left",
  },
];

export function ScrollHero({ heroImage }: ScrollHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<HTMLDivElement[]>([]);
  const isMounted = useRef(true);
  
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const TOTAL = 300;

  useEffect(() => {
    isMounted.current = true;

    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (!canvas || !track) return () => {};

    const canvasEl = canvas;
    const trackEl = track;
    const ctx = canvasEl.getContext("2d", { alpha: false });
    if (!ctx) return () => {};

    const ctx2d = ctx;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let target = 0;
    let cur = 0;
    let lastKey: string | null = null;
    let animationFrameId: number;
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

    const imgs: HTMLImageElement[] = new Array(TOTAL);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvasEl.clientWidth;
      H = canvasEl.clientHeight;
      canvasEl.width = Math.round(W * dpr);
      canvasEl.height = Math.round(H * dpr);
      lastKey = null;
    }

    function cover(img: HTMLImageElement, alpha: number) {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw) return;
      const s = Math.max(canvasEl.width / iw, canvasEl.height / ih);
      const w = iw * s;
      const h = ih * s;
      ctx2d.globalAlpha = alpha;
      ctx2d.drawImage(img, (canvasEl.width - w) / 2, (canvasEl.height - h) / 2, w, h);
    }

    function draw(p: number) {
      const f = p * (TOTAL - 1);
      const i = Math.floor(f);
      const t = f - i;
      const key = `${i}:${Math.round(t * 40)}`;
      if (key === lastKey) return;
      lastKey = key;
      
      const a = imgs[i];
      const b = imgs[Math.min(i + 1, TOTAL - 1)];
      if (!a || !a.complete) return;
      
      cover(a, 1);
      if (b && b.complete && t > 0.01) cover(b, t);
      ctx2d.globalAlpha = 1;
      
      if (countRef.current) {
        countRef.current.textContent = `${String(Math.round(f) + 1).padStart(3, "0")} / ${TOTAL}`;
      }
    }

    const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

    function text(p: number) {
      beatRefs.current.forEach((el) => {
        if (!el) return;
        const a = parseFloat(el.dataset.a || "0");
        const b = parseFloat(el.dataset.b || "0");
        const hold = el.dataset.hold === "true";
        const fade = 0.05;
        let o = 0;
        let y = 0;

        if (hold && p <= a + 0.02) {
          o = 1;
        } else if (p >= a && p <= b) {
          const inn = Math.min(1, (p - a) / fade);
          const out = Math.min(1, (b - p) / fade);
          o = ease(Math.max(0, Math.min(inn, out)));
          y = (1 - ease(Math.min(1, (p - a) / fade))) * 40 - (1 - ease(Math.min(1, (b - p) / fade))) * 40;
        } else if (hold && p > a && p < b) {
          o = 0;
        }
        if (hold && p > 0.02 && p <= b) {
          o = ease(Math.max(0, Math.min(1, (b - p) / (b - 0.02))));
        }

        el.style.opacity = String(o);
        el.style.transform = `translate3d(0,${y}px,0)`;
      });
    }

    function readTarget() {
      const r = trackEl.getBoundingClientRect();
      const max = trackEl.offsetHeight - window.innerHeight;
      target = Math.min(1, Math.max(0, -r.top / max));
    }

    function loop() {
      cur += (target - cur) * (reduce ? 1 : 0.075);
      if (Math.abs(target - cur) < 0.00005) cur = target;
      draw(cur);
      text(cur);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${cur})`;
      }
      animationFrameId = requestAnimationFrame(loop);
    }

    // Load images
    async function loadImages() {
      const PATH = (i: number) => `/hero-frames/frame_${String(i).padStart(3, "0")}.jpg`;
      
      const load = (i: number): Promise<void> =>
        new Promise((res) => {
          const im = new Image();
          im.decoding = "async";
          im.src = PATH(i + 1);
          im.onload = im.onerror = () => {
            if (isMounted.current) {
              setLoadProgress((prev) => prev + 1);
            }
            res();
          };
          imgs[i] = im;
        });

      resize();
      await load(0);
      
      const rest = Array.from({ length: TOTAL - 1 }, (_, i) => i + 1);
      const pool = 8;
      await Promise.all(
        Array.from({ length: pool }, async () => {
          while (rest.length) await load(rest.shift()!);
        })
      );

      if (isMounted.current) {
        setLoaded(true);
        readTarget();
        cur = target;
        lastKey = null;
        loop();
      }
    }

    loadImages();

    const handleScroll = () => readTarget();
    const handleResize = () => {
      resize();
      readTarget();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted.current = false;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <section className="relative bg-background">
      {/* Loading screen */}
      {!loaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background transition-opacity duration-900">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Preparing the canvas
          </span>
          <div className="w-60 h-px bg-border">
            <div
              className="h-full bg-foreground transition-all duration-150"
              style={{ width: `${(loadProgress / TOTAL) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div
        ref={barRef}
        className="fixed left-0 top-0 z-40 h-px w-full bg-foreground"
        style={{ transform: "scaleX(0)", transformOrigin: "left" }}
      />

      {/* Frame counter */}
      <div
        ref={countRef}
        className="fixed right-4 bottom-4 z-40 text-xs tracking-widest text-muted-foreground tabular-nums md:right-8 md:bottom-8"
      >
        001 / {TOTAL}
      </div>

      {/* Scroll track */}
      <div ref={trackRef} className="relative h-[900vh]">
        {/* Sticky stage */}
        <div className="sticky top-0 h-screen overflow-hidden" style={{ height: '100svh' }}>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
          
          {/* Vignette overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.12))' }}
          />

          {/* Text beats */}
          {beats.map((beat, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) beatRefs.current[index] = el;
              }}
              data-a={beat.a}
              data-b={beat.b}
              data-hold={beat.hold}
              className={`absolute bottom-0 left-0 flex flex-col px-8 md:px-12 lg:px-16 pb-24 md:pb-32 opacity-0 pointer-events-none max-w-2xl ${
                beat.align === "right" ? "items-end text-right" : beat.align === "center" ? "items-center text-center" : "items-start text-left"
              }`}
            >
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                {beat.eyebrow}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground leading-tight tracking-tight">
                {beat.title}
              </h2>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
                {beat.description}
              </p>
              
              {/* CTA buttons on first beat */}
              {index === 0 && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pointer-events-auto">
                  <FlowButton text="Explore Gallery" onClick={() => window.location.href = '/gallery'} />
                  <FlowButton text="Commission" variant="outline" onClick={() => window.location.href = '/commission'} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transition section */}
      <div className="min-h-screen grid place-items-center text-center px-6 py-12 bg-background">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Continue Exploring
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground leading-tight">
            Discover Our Collections
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Browse curated collections of Himalayan landscapes, wildlife, and cultural heritage artworks.
          </p>
        </div>
      </div>
    </section>
  );
}
