"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Collection, Artwork } from "@/types";

interface CollectionsPreviewProps {
  collections: Collection[];
  artworks: Artwork[];
}

function getCoverImage(collection: Collection, artworks: Artwork[]): string | null {
  if (collection.cover) return collection.cover;
  const firstArtwork = artworks.find((a) => a.collection_id === collection.id && a.image);
  return firstArtwork?.image || null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function CollectionsPreview({ collections, artworks }: CollectionsPreviewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!collections.length) return null;

  return (
    <section className="py-16 lg:py-24 bg-muted/5" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-foreground">
            Collections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore curated series of works, each telling a unique story through watercolour and sketch
          </p>
        </motion.div>

        {/* Clean grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {collections.slice(0, 6).map((collection) => {
            const coverImage = getCoverImage(collection, artworks);
            const count = artworks.filter((a) => a.collection_id === collection.id).length;
            
            return (
              <motion.article
                key={collection.id}
                variants={item}
                className="group"
              >
                <Link href={`/collections/${collection.id}`} className="block">
                  {/* Simple image container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted/10 mb-4">
                    {coverImage ? (
                      <motion.img
                        src={coverImage}
                        alt={collection.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">No cover image</span>
                      </div>
                    )}
                    
                    {/* Simple overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Clean typography */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-muted-foreground transition-colors">
                        {collection.title}
                      </h3>
                      <span className="text-sm text-muted-foreground font-mono">
                        #{collection.no}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {collection.blurb}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">
                        {count} {count === 1 ? 'work' : 'works'}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Simple view all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link 
            href="/collections"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View All Collections
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
