"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Collection } from "@/types";
import DuluwaNavbar from "@/components/duluwa-navbar";
import GenZGlassyFooter from "@/components/genz-footer";
import { collectionData as mockCollections } from "@/lib/collection-data";
import "@/app/template.css";
import "@/components/genz-footer.css";

// Aspect ratios cycle per card for masonry height variation
const ASPECTS = [
  "aspect-[3/4]",   // tall
  "aspect-[4/3]",   // wide
  "aspect-[2/3]",   // extra tall
  "aspect-square",  // square
  "aspect-[5/7]",   // tall portrait
  "aspect-[4/5]",   // portrait
];

function CollectionCard({
  id,
  no,
  title,
  count,
  blurb,
  imageSrc,
  index,
}: {
  id: string;
  no: string;
  title: string;
  count: number;
  blurb: string;
  imageSrc: string;
  index: number;
}) {
  const aspect = ASPECTS[index % ASPECTS.length];

  return (
    <Link href={`/collections/${id}`} className="group block break-inside-avoid mb-5">
      {/* Image container */}
      <div className={`relative w-full ${aspect} overflow-hidden rounded-xl bg-zinc-100`}>
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100">
          <p className="text-white/80 text-sm leading-relaxed translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
            {blurb}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-white text-xs uppercase tracking-widest font-semibold translate-y-3 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            View Collection →
          </span>
        </div>

        {/* Collection number badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-zinc-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          {no}
        </div>
      </div>

      {/* Card meta */}
      <div className="flex items-start justify-between mt-3 px-1">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-900 leading-snug">
          {title}
        </h3>
        <span className="text-xs text-zinc-400 whitespace-nowrap ml-4 mt-0.5">
          {count} works
        </span>
      </div>
    </Link>
  );
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const { api } = await import("@/lib/api");
      const response = await api.get("/collections/").catch(() => ({ data: mockCollections }));
      setCollections(response.data.results || response.data || mockCollections);
    } catch (error) {
      console.error("Failed to fetch collections, using mock data:", error);
      setCollections(mockCollections);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <DuluwaNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
        </div>
        <GenZGlassyFooter />
      </>
    );
  }

  return (
    <main className="site">
      <DuluwaNavbar />

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">// All Collections</p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-zinc-900">
              Only the Essential,<br />
              <span className="italic">Always the Exceptional</span>
            </h1>
          </div>
          <div className="text-7xl font-light text-zinc-200 hidden md:block select-none">
            {collections.length.toString().padStart(2, "0")}
          </div>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-3 mt-10 text-sm font-medium"
        >
          {["ALL", "NEW COLLECTION", "LANDSCAPES", "PORTRAITS"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full border transition-colors whitespace-nowrap ${
                activeFilter === f
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "text-zinc-500 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900"
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Artworks", value: "500+" },
            { label: "Artists", value: "45+" },
            { label: "Collections", value: "12" },
            { label: "Years", value: "15+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-light text-zinc-900 mb-2">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <CollectionCard
                id={collection.id}
                no={collection.no}
                title={collection.title}
                count={collection.count}
                blurb={collection.blurb}
                imageSrc={collection.cover}
                index={index}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured CTA Section */}
      <section className="px-6 md:px-12 py-20 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-widest text-red-500 mb-4">// Commission Work</p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
              Work directly with our artists to create a bespoke piece that captures your unique vision.
              From concept to completion, we're here to bring your dream artwork to life.
            </p>
            <Link
              href="/commission"
              className="inline-flex items-center gap-2 bg-white text-zinc-900 px-8 py-4 rounded-full font-medium hover:bg-red-500 hover:text-white transition-colors"
            >
              Start Your Commission
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <GenZGlassyFooter />
    </main>
  );
}
