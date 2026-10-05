"use client";

/**
 * Duluwa-Art hero: everything (component, styles, fonts) in this one file.
 *
 * Setup:
 *   npm i framer-motion
 *   Put your files in /public/art/ :
 *     dancer.jpeg, guinea-pigs.jpeg, child-with-bowl.png
 *   Use it:  <Hero artist="Kobit" />
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import "./duluwa-hero.css";

type Work = {
  src: string;
  alt: string;
  width: number;
  height: number;
  slot: "child" | "guinea" | "dancer";
  depth: number; // px of mouse parallax; bigger = feels closer
};

const works: Work[] = [
  {
    src: "/art/child-with-bowl.png",
    alt: "Watercolor of a child in a blue jacket drinking from a dark bowl",
    width: 2048,
    height: 2048,
    slot: "child",
    depth: 10,
  },
  {
    src: "/art/guinea-pigs.jpeg",
    alt: "Watercolor of two brown and white guinea pigs side by side",
    width: 2290,
    height: 1729,
    slot: "guinea",
    depth: 18,
  },
  {
    src: "/art/dancer.jpeg",
    alt: "Watercolor portrait of a young dancer in a gold Himalayan headdress",
    width: 2291,
    height: 3260,
    slot: "dancer",
    depth: 12,
  },
];

function Frame({
  work,
  index,
  px,
  py,
  reduce,
}: {
  work: Work;
  index: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
  reduce: boolean;
}) {
  // Cursor moves right -> frame drifts slightly left, so the wall feels deep.
  const x = useTransform(px, (v) => v * -work.depth);
  const y = useTransform(py, (v) => v * -work.depth * 0.6);

  return (
    <motion.div className={`dh-slot dh-${work.slot}`} style={{ x, y }}>
      <motion.div
        className="dh-hang"
        // Each painting swings in as if just hung on a nail.
        initial={reduce ? false : { opacity: 0, y: -70, rotate: index % 2 ? 1.8 : -1.8 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 11, delay: 0.2 + index * 0.14 }}
        whileHover={reduce ? undefined : { y: -6 }}
      >
        <Image
          src={work.src}
          alt={work.alt}
          width={work.width}
          height={work.height}
          sizes="(max-width: 900px) 40vw, 480px"
          priority
          className="dh-art"
        />
      </motion.div>
    </motion.div>
  );
}

export default function DuluwaHero({ artist = "Kobit" }: { artist?: string }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);

  // -0.5 .. 0.5 across the hero, smoothed with a spring
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 80, damping: 20 });
  const py = useSpring(my, { stiffness: 80, damping: 20 });

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onPointerLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      ref={ref}
      className="dh-hero"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span className="dh-ghost" aria-hidden="true">
        ART-GALLERY
      </span>

      <div className="dh-wall">
        {works.map((w, i) => (
          <Frame key={w.src} work={w} index={i} px={px} py={py} reduce={reduce} />
        ))}
      </div>

      <h1 className="dh-wordmark">
        <span className="dh-mask">
          <motion.span
            className="dh-word"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.85 }}
          >
            DULUWA-ART
          </motion.span>
        </span>
      </h1>

      <motion.div
        className="dh-footer"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <p className="dh-tagline">
          Original watercolors of people, animals and festivals from Nepal.
          <span className="dh-by">Painted by {artist}</span>
        </p>
        <div className="dh-actions">
          <Link href="/gallery" className="dh-primary">
            View the collection
          </Link>
          <Link href="/contact" className="dh-secondary">
            Ask about a painting
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
