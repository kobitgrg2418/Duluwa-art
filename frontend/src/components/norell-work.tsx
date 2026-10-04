"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Reveal from "./norell-reveal";

const items = [
  { n: "Himalayan Serenity", c: "linear-gradient(160deg,#2b3236,#07090a)", s: "span 7", image: "/assets/IMG_9965.jpg" },
  { n: "Mountain Reflection", c: "linear-gradient(200deg,#8a8a8a,#5a5a5a)", s: "span 5", image: "/assets/auth-brushes.png" },
  { n: "Cultural Heritage", c: "linear-gradient(180deg,#3a3a3a,#1a1a1a)", s: "span 5", image: "/assets/IMG_9965.jpg" },
  { n: "Sacred Mountains", c: "linear-gradient(160deg,#1a1a1a,#0a0a0a)", s: "span 7", image: "/assets/auth-brushes.png" },
];

function Card({ n, c, s, image }) {
  const [hover, setHover] = useState(false);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 300, damping: 30, mass: 0.6 });
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left - 28); y.set(e.clientY - r.top - 28); };
  return (
    <motion.a href="#" className="norell-card" style={{ gridColumn: s }} onMouseMove={move}
      onHoverStart={() => setHover(true)} onHoverEnd={() => setHover(false)}>
      <motion.div className="card-img" style={{ background: c, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        animate={{ filter: hover ? "blur(12px)" : "blur(0px)", scale: hover ? 1.06 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
      <span className="card-name">{n}</span>
      <motion.span className="dot" style={{ x: sx, y: sy }} animate={{ scale: hover ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}>↗</motion.span>
    </motion.a>
  );
}

export default function NorellWork() {
  return (
    <section className="norell-work" id="works">
      <Reveal lines={["Projects we're", "proud of"]} />
      <div className="work-grid">{items.map((i) => <Card key={i.n} {...i} />)}</div>
    </section>
  );
}
