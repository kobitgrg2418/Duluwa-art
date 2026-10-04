"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function NorellHero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -140]);
  
  return (
    <section className="norell-hero" id="top">
      <motion.p className="hero-tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        Watercolor Masterpieces
      </motion.p>
      <motion.div className="word" style={{ y }}>
        {[..."DULUWA-ART"].map((c, i) => (
          <span className="mask" key={i}>
            <motion.span 
              initial={{ y: "110%" }} 
              animate={{ y: 0 }} 
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.06 }}
            >
              {c}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
