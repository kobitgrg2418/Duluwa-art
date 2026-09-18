"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Artwork, Collection } from "@/types";

interface FeaturedArtworksProps {
  artworks: Artwork[];
  collections: Collection[];
}

function getCollectionName(collectionId: string, collections: Collection[]): string {
  const collection = collections.find((c) => c.id === collectionId);
  return collection?.title || "Collection";
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function FeaturedArtworks({ artworks, collections }: FeaturedArtworksProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!artworks.length) return null;

  return (
    <section className="py-16 lg:py-24 bg-white" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean, minimal header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-foreground">
            Featured Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of original watercolours and sketches, available for purchase
          </p>
        </motion.div>

        {/* Clean grid layout */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {artworks.slice(0, 6).map((artwork) => (
            <motion.article
              key={artwork.id}
              variants={item}
              className="group"
            >
              <Link href={`/gallery/${artwork.id}`} className="block">
                {/* Simple image container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted/10 mb-4">
                  {artwork.image ? (
                    <motion.img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">No image</span>
                    </div>
                  )}
                  
                  {/* Sold overlay */}
                  {artwork.status === "SOLD_OUT" && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="bg-white/90 text-foreground text-sm font-medium px-3 py-1 rounded">
                        Sold
                      </span>
                    </div>
                  )}
                </div>

                {/* Clean typography */}
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground group-hover:text-muted-foreground transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getCollectionName(artwork.collection_id, collections)}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {artwork.medium}
                    </p>
                    <p className="font-medium text-foreground">
                      {formatPrice(artwork.price)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* Simple view all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button asChild variant="outline" className="border-foreground/20 hover:border-foreground/40">
            <Link href="/gallery">
              View All Works
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
