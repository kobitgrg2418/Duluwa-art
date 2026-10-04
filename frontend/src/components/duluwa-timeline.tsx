"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const features = [
  {
    id: '01',
    number: 1,
    title: 'Founded in 2013',
    description:
      'Duluwa Art Gallery was established with a vision to preserve and promote the rich artistic heritage of Nepal through watercolor masterpieces.',
    graphicText: 'DA',
    bgWatermark: 'DA',
  },
  {
    id: '02',
    number: 2,
    title: '150+ Artworks',
    description:
      'Our collection has grown to include over 150 curated watercolor pieces from 50+ talented artists, capturing the essence of Himalayan landscapes.',
    graphicText: 'DA',
    bgWatermark: 'DA',
  },
  {
    id: '03',
    number: 3,
    title: 'Global Recognition',
    description:
      'Today, we showcase emerging and established artists globally, bringing fine art to diverse audiences and preserving artistic legacy for generations.',
    graphicText: 'DA',
    bgWatermark: 'DA',
  },
];

export default function DuluwaTimeline() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-[#0e0e0e] text-white px-6 py-24 flex items-center justify-center font-sans selection:bg-[#ee3a35] selection:text-white"
    >
      <div className="max-w-4xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Our Journey
          </h2>
        </motion.div>

        <div className="flex flex-col gap-16 md:gap-24">
          {features.map((feature, index) => {
            const startProgress = index * 0.33;
            const endProgress = (index + 1) * 0.33;

            const lineProgress = useTransform(
              scrollYProgress,
              [startProgress, endProgress],
              ['0%', '100%']
            );

            const opacity = useTransform(
              scrollYProgress,
              [startProgress, startProgress + 0.25],
              [0.2, 1]
            );
            const translateY = useTransform(
              scrollYProgress,
              [startProgress, startProgress + 0.25],
              [60, 0]
            );

            const scale = useTransform(
              scrollYProgress,
              [startProgress, startProgress + 0.25],
              [0.9, 1]
            );

            const rotate = useTransform(
              scrollYProgress,
              [startProgress, startProgress + 0.25],
              [5, 0]
            );

            return (
              <motion.div
                key={feature.id}
                style={{ opacity, y: translateY, scale, rotate }}
                className="flex flex-col md:flex-row gap-8 md:gap-12 items-start group"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                  className="relative h-64 w-full md:w-80 bg-[#141414] rounded-sm overflow-hidden flex items-center justify-center border border-white/5 flex-shrink-0"
                >
                  <motion.span
                    className="absolute text-8xl font-serif text-white/5 select-none pointer-events-none transform -rotate-12 scale-150"
                    animate={{
                      rotate: [-12, -10, -12],
                      scale: [1.5, 1.6, 1.5],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {feature.bgWatermark}
                  </motion.span>

                  <motion.span
                    className="relative text-7xl font-serif italic text-white/90 tracking-tighter transition-transform duration-500 group-hover:scale-105"
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.graphicText}
                  </motion.span>
                </motion.div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="relative w-full flex items-center py-2 mb-6">
                    <div className="h-[2px] w-full bg-neutral-800 absolute top-1/2 -translate-y-1/2" />
                    <motion.div
                      style={{ width: lineProgress }}
                      className="h-[2px] bg-[#ee3a35] absolute top-1/2 -translate-y-1/2 left-0"
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: false, amount: 0.5 }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                      className="relative z-10 bg-[#ee3a35] text-white font-mono text-xs font-bold w-6 h-6 flex items-center justify-center rounded-sm shadow-md"
                    >
                      {feature.number}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 + 0.2 }}
                    className="space-y-3"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                      {feature.title}
                    </h3>
                    <p className="text-base text-neutral-400 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
