"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

export default function DuluwaArtistStory() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isInView]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section ref={containerRef} className="artist-story-section text-black px-6 py-24">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Video */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-video bg-black rounded-lg overflow-hidden"
          >
            <video
              ref={videoRef}
              src="/artist-story.mp4"
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
            />
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </button>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-6"
            style={{ fontFamily: "'Behind The Nineties', serif" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "'Behind The Nineties', serif" }}>
              The Artist's Story
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Born in the heart of the Himalayas, our founder discovered the magic of watercolor at a young age. What began as a childhood fascination with the interplay of light and water evolved into a lifelong dedication to capturing the ethereal beauty of Nepal's landscapes.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Each brushstroke tells a story—of misty mountain peaks at dawn, of ancient temples bathed in golden light, of the vibrant spirit of a people whose culture spans millennia. Through this gallery, we invite you to experience the world through the eyes of artists who find poetry in every wash of color.
            </p>
            <div className="pt-4">
              <button className="px-8 py-3 bg-[#ee3a35] text-white font-semibold rounded hover:bg-[#c92b1e] transition-colors" style={{ fontFamily: "'Behind The Nineties', serif" }}>
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
