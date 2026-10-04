"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRouter } from "next/navigation";

const S = [
  { t: "Commissions", c: "#2b3236", d: "Custom watercolor artwork tailored to your vision, capturing the essence of Himalayan landscapes and cultural heritage.", href: "/commissions" },
  { t: "Restoration", c: "#5a5a5a", d: "Expert restoration services for vintage and damaged watercolor paintings, preserving artistic legacy for generations.", href: "/restoration" },
  { t: "Exhibitions", c: "#3a3a3a", d: "Curated gallery exhibitions showcasing emerging and established artists, bringing fine art to diverse audiences.", href: "/exhibitions" },
  { t: "Art Consulting", c: "#1a1a1a", d: "Professional guidance for collectors and institutions on acquisitions, collections management, and art investment.", href: "/consulting" },
];

export default function NorellServices() {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.min(S.length - 1, Math.floor(v * S.length))));

  const handleClick = (index: number, href: string) => {
    setI(index);
    router.push(href);
  };

  return (
    <section ref={ref} className="norell-svc" style={{ height: S.length * 70 + 30 + "vh" }}>
      <div className="svc-in">
        <ul>
          {S.map((s, k) => (
            <motion.li 
              key={s.t} 
              animate={{ color: k === i ? "#f4f4f4" : k === hovered ? "#777" : "#3a3a3a" }} 
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHovered(k)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(k, s.href)}
              style={{ cursor: "pointer" }}
            >
              {s.t} <motion.sup animate={{ color: k === i ? "#ee3a35" : k === hovered ? "#555" : "#3a3a3a" }}>({String(k + 1).padStart(2, "0")})</motion.sup>
            </motion.li>
          ))}
        </ul>
        <AnimatePresence mode="wait">
          <motion.aside 
            key={i} 
            initial={{ opacity: 0, y: 24 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -24 }} 
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => handleClick(i, S[i].href)}
            style={{ cursor: "pointer" }}
          >
            <motion.div 
              className="svc-img" 
              style={{ background: S[i].c }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            />
            <small>{S[i].t}</small>
            <p>{S[i].d}</p>
          </motion.aside>
        </AnimatePresence>
      </div>
    </section>
  );
}
