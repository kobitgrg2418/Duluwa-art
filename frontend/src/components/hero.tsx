"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  heroImage?: string;
  videoSrc?: string;
  videoPoster?: string;
}

export function Hero({ heroImage, videoSrc, videoPoster }: HeroProps) {
  // Use a clean featured image
  const featuredArtwork = heroImage || "/assets/IMG_9965.jpg";

  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left column - Clean typography */}
          <div className="space-y-8 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="inline-flex items-center border border-border px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6 bg-muted/30">
                Original Watercolors
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.1] tracking-tight">
                Where Art <br className="hidden sm:block" /> Meets Nature
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-md"
            >
              Discover the breathtaking watercolor masterpieces of Kobit Gurung — 
              capturing the raw beauty of Nepal's landscapes, wildlife, and cultural essence through masterful brushwork.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8">
                <Link href="/gallery">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="h-12 px-8 border-foreground/20 hover:bg-muted">
                <Link href="/commission">
                  <Play className="mr-2 h-4 w-4" />
                  Artist Story
                </Link>
              </Button>
            </motion.div>

            {/* Simple Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-12 pt-8 border-t border-border mt-12"
            >
              <div>
                <div className="text-3xl font-serif text-foreground">130+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-2">Artworks</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-foreground">17+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-2">Years</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-foreground">9</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-2">Exhibitions</div>
              </div>
            </motion.div>
          </div>

          {/* Right column - Clean artwork display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end lg:h-[700px] items-center"
          >
            <div className="relative w-full max-w-md aspect-[4/5] bg-muted/20 z-10 group">
              <img 
                src={featuredArtwork}
                alt="Featured Watercolor Artwork"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Minimal info tag */}
              <div className="absolute -bottom-6 -left-6 bg-background border border-border p-5 shadow-sm hidden md:block">
                <div className="text-sm font-medium text-foreground">Cultural Heritage</div>
                <div className="text-xs text-muted-foreground mt-1">Watercolor • 2024</div>
              </div>
            </div>
            
            {/* Minimalist background decoration */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[120%] h-[110%] bg-muted/30 -z-10 -rotate-3" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}