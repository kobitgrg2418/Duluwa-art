"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Play, Palette, Brush, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  heroImage?: string;
  videoSrc?: string;
  videoPoster?: string;
}

export function Hero({ heroImage, videoSrc, videoPoster }: HeroProps) {
  // Use the new image you requested
  const featuredArtwork = "/assets/IMG_9965.jpg";

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Dynamic background with overlays */}
      <div className="absolute inset-0">
        {heroImage && (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Duluwa Art Gallery"
              className="w-full h-full object-cover opacity-20"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60" />
          </div>
        )}
        
        {/* Animated paint strokes */}
        <div className="absolute inset-0 opacity-15">
          <motion.div
            className="absolute top-20 left-20 w-96 h-2 bg-gradient-to-r from-transparent via-white to-transparent rotate-12"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-32 right-32 w-64 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent -rotate-12"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.4 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/4 w-48 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent rotate-45"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.2 }}
            transition={{ duration: 2, delay: 1.5 }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left column - Main content */}
            <div className="space-y-8">
              {/* Animated badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Palette className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-white font-medium text-sm uppercase tracking-wider">
                    Original Watercolors
                  </span>
                </div>
              </motion.div>

              {/* Main headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  <span className="block">Where</span>
                  <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                    Art Meets
                  </span>
                  <span className="block">Nature</span>
                </h1>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="h-1 bg-gradient-to-r from-white/80 via-white/40 to-transparent max-w-md"
                />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-xl text-gray-300 leading-relaxed max-w-lg"
              >
                Discover the breathtaking watercolor masterpieces of <span className="text-white font-semibold">Kobit Gurung</span> — 
                capturing the raw beauty of Nepal's landscapes, wildlife, and cultural essence through masterful brushwork.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex items-center gap-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">130+</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Artworks</div>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">17+</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Years</div>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">9</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Exhibitions</div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 font-semibold group">
                    <Link href="/gallery">
                      <Brush className="mr-2 h-5 w-5" />
                      <span>Explore Gallery</span>
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    <Link href="/commission">
                      <Play className="mr-2 h-5 w-5" />
                      <span>Artist Story</span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Right column - Featured artwork */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main artwork frame with your new specified image */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateY: [0, 3, 0, -3, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                  className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                    <img 
                      src={featuredArtwork}
                      alt="Featured Watercolor Artwork - Traditional Nepali Portrait"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        console.log('Image failed to load:', featuredArtwork);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  {/* Artwork info overlay */}
                  <div className="absolute bottom-8 left-8 right-8 bg-black/70 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">Cultural Heritage</div>
                        <div className="text-gray-300 text-sm">Watercolor • 2024</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">$1,200</div>
                        <div className="text-green-400 text-sm">Available</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>

                <motion.div
                  animate={{ 
                    x: [0, 15, 0],
                    y: [0, -8, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                  className="absolute -bottom-4 -left-4 w-8 h-8 bg-white/30 backdrop-blur-md rounded-full border border-white/40"
                />

                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute top-1/4 -left-6 w-4 h-4 bg-white/40 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-white/60"
        >
          <div className="text-xs uppercase tracking-wider mb-2">Scroll to explore</div>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}