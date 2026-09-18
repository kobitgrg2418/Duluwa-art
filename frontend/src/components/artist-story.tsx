"use client";

import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Artwork } from "@/types";

interface ArtistStoryProps {
  artworks: Artwork[];
}

export function ArtistStory({ artworks }: ArtistStoryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const slides = artworks.filter((a) => a.image).slice(0, 6);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <section className="py-16 lg:py-24 bg-white" id="story" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Simple image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden bg-muted/10">
              {currentSlide && currentSlide.image ? (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              ) : (
                <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Loading...</span>
                </div>
              )}
            </div>

            {/* Simple dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-foreground"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Clean typography */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground">
              It started with tiny stickers and a brother to beat
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                At seven or eight, <strong className="text-foreground">Kobit Gurung</strong> was hunched over anime stickers with his brother, racing to see who could copy the characters more faithfully. It was never homework — it was a dare, a game, a quiet obsession that refused to stay quiet.
              </p>
              
              <p>
                As the years passed, the stickers gave way to sketchbooks, and the kitchen-table rivalry grew into something larger. He began representing his school in district-level competitions, discovering that the thing he did for fun was also the thing he did best.
              </p>

              <blockquote className="border-l-2 border-muted-foreground/30 pl-6 py-2">
                <p className="text-foreground font-medium italic">
                  &ldquo;Sketching, drawing, painting — I never chose this path. It simply never let me choose another.&rdquo;
                </p>
              </blockquote>

              <p>
                No academy shaped his hand. The passion came first, and the craft followed — built one line, one wash, one late night at a time. Today, from a studio in <strong className="text-foreground">Pokhara</strong>, that same childhood impulse drives every brushstroke: the pure, stubborn love of making marks on paper.
              </p>
            </div>

            {/* Simple stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-muted/30">
              <div className="text-center">
                <p className="text-2xl font-serif font-medium text-foreground">17+</p>
                <p className="text-sm text-muted-foreground">Years painting</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif font-medium text-foreground">130+</p>
                <p className="text-sm text-muted-foreground">Works created</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif font-medium text-foreground">9</p>
                <p className="text-sm text-muted-foreground">Solo exhibitions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
