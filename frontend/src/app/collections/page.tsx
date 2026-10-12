"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Collection } from "@/types";
import DuluwaNavbar from "@/components/duluwa-navbar";
import GenZGlassyFooter from "@/components/genz-footer";
import { collectionData as mockCollections } from "@/lib/collection-data";
import "@/app/template.css";
import "@/components/genz-footer.css";

function KineticCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

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
  return (
    <Link href={`/collections/${id}`} className="group block break-inside-avoid mb-5">
      {/* Image container */}
      <div className="relative w-full overflow-hidden rounded-xl bg-zinc-100">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

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

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch = collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.blurb.toLowerCase().includes(searchQuery.toLowerCase());

    const categoryMap: Record<string, string[]> = {
      "ALL": [],
      "LANDSCAPE": ["HIMALAYAN", "MOUNTAIN", "VALLEY", "VISTAS", "NATURE", "MONSOON"],
      "PORTRAITS": ["PORTRAIT", "FACE", "ELDER", "WOMAN", "CHILD", "SHERPA"],
      "STILL LIFE": ["STILL", "OBJECT", "FLORA", "FLOWERS"],
      "ANIMALS": ["WILDLIFE", "TIGER", "DANPHE", "BIRDS", "RIVER", "OTTER", "PHEASANT"],
    };

    const matchesCategory = selectedCategory === "ALL" ||
      categoryMap[selectedCategory]?.some(keyword =>
        collection.title.includes(keyword) || collection.blurb.toLowerCase().includes(keyword.toLowerCase())
      );

    return matchesSearch && matchesCategory;
  });

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
              Always the Exceptional
            </h1>
          </div>
          <div className="text-7xl font-light text-zinc-200 hidden md:block select-none">
            {collections.length.toString().padStart(2, "0")}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Artworks", value: 500, suffix: "+" },
            { label: "Artists", value: 45, suffix: "+" },
            { label: "Collections", value: 18, suffix: "" },
            { label: "Years", value: 15, suffix: "+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-light text-zinc-900 mb-2">
                <KineticCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs uppercase tracking-widest text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="px-6 md:px-12 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-[500px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-zinc-200 rounded-full focus:outline-none focus:border-zinc-900 transition-colors text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {["ALL", "LANDSCAPE", "PORTRAITS", "STILL LIFE", "ANIMALS"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-3 rounded-full text-sm font-medium uppercase tracking-wider transition-colors ${
                  selectedCategory === category
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        {filteredCollections.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No collections found matching your search.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {filteredCollections.map((collection, index) => (
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
        )}
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
