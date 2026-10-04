"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";

function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => Math.round(n) + suffix);
  const o = useTransform(v, [0, to], [0.25, 1]);
  useEffect(() => {
    if (!inView) return;
    const c = animate(v, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [inView]);
  return <motion.span ref={ref} className="num" style={{ opacity: o }}>{text}</motion.span>;
}

const stats = [
  [150, "+", "Artworks curated in our collection"],
  [50, "+", "Artists represented globally"],
  [12, "+", "Years in the art industry"],
  [98, "%", "Client satisfaction rate"]
];

export default function NorellStats() {
  return (
    <section className="norell-stats">
      {stats.map(([n, s, l]) => (<div key={l}><Count to={n} suffix={s} /><p>{l}</p></div>))}
    </section>
  );
}
