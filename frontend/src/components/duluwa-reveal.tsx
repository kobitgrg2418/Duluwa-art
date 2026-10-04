"use client";

import { motion } from "framer-motion";

interface RevealProps {
  lines: string[];
}

export default function DuluwaReveal({ lines }: RevealProps) {
  return (
    <motion.div 
      className="duluwa-reveal"
      initial="h"
      animate="s"
      variants={{ 
        s: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } 
      }}
    >
      {lines.map((line, i) => (
        <motion.h2 
          key={i}
          className="reveal-line"
          variants={{ 
            h: { y: 40, opacity: 0 }, 
            s: { y: 0, opacity: 1 } 
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {line}
        </motion.h2>
      ))}
    </motion.div>
  );
}
