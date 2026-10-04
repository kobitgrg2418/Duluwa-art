"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useRef } from "react";
import DuluwaReveal from "./duluwa-reveal";

const items = [
  { n: "Himalayan Serenity", c: "linear-gradient(160deg,#2b3236,#07090a)", s: "span 7", image: "/assets/IMG_9965.jpg" },
  { n: "Mountain Reflection", c: "linear-gradient(200deg,#8a8a8a,#5a5a5a)", s: "span 5", image: "/assets/auth-brushes.png" },
  { n: "Cultural Heritage", c: "linear-gradient(180deg,#3a3a3a,#1a1a1a)", s: "span 5", image: "/assets/IMG_9965.jpg" },
  { n: "Sacred Mountains", c: "linear-gradient(160deg,#1a1a1a,#0a0a0a)", s: "span 7", image: "/assets/auth-brushes.png" },
];

function Card({ n, c, s, image, index }) {
  const [hover, setHover] = useState(false);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 300, damping: 30, mass: 0.6 });
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left - 28); y.set(e.clientY - r.top - 28); };
  return (
    <motion.a href="#" className="duluwa-card" style={{ gridColumn: s }} onMouseMove={move}
      onHoverStart={() => setHover(true)} onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}>
      <motion.div className="card-img" style={{ background: c, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        animate={{ filter: hover ? "blur(12px)" : "blur(0px)", scale: hover ? 1.06 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
      <span className="card-name">{n}</span>
      <motion.span className="dot" style={{ x: sx, y: sy }} animate={{ scale: hover ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}>↗</motion.span>
    </motion.a>
  );
}

export default function DuluwaWork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="duluwa-work" id="works" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <DuluwaReveal lines={["Projects we're", "proud of"]} />
      </motion.div>
      <div className="work-grid">
        {items.map((i, index) => <Card key={i.n} {...i} index={index} />)}
      </div>
    </section>
  );
}
