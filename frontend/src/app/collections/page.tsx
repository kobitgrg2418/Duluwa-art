"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";
import { Collection } from "@/types";
import { collectionData as mockCollections } from "@/lib/collection-data";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const categories = [
    { key: "all", label: "All Collections" },
    { key: "himalaya", label: "Himalayan Peaks" },
    { key: "culture", label: "Culture & Living Traditions" },
    { key: "portrait", label: "Mountain Portraits" },
    { key: "sketch", label: "Ink & Field Studies" },
  ];

  const filteredCollections = selectedCategory === "all"
    ? collections
    : collections.filter((c) => c.category === selectedCategory || c.id === selectedCategory);

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      {/* Hero Header */}
      <section className="rx-hero">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-12 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
              Curated Series
            </div>
            <h1 className="rx-hero-title">
              Exhibitions &amp;<br />
              Collections
            </h1>
          </div>
          <div className="max-w-md">
            <p className="rx-hero-sub mb-6">
              Explore thematic bodies of work exploring Himalayan geography, cultural ceremonies,
              and atmospheric mountain studies.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="rx-btn rx-btn-black">
                Browse All Artworks <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/commission" className="rx-btn rx-btn-outline">
                Request Commission
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3 pt-8 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === cat.key
                  ? "bg-black text-white"
                  : "bg-black/5 text-black hover:bg-black/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Collections Grid */}
      <section className="px-8 pb-24 max-w-[1720px] mx-auto">
        {loading ? (
          <div className="py-24 text-center text-black/40 text-sm uppercase tracking-widest">
            Loading curated collections...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCollections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.id}`}
                className="rx-card group"
              >
                <div className="rx-card-media relative aspect-[4/3] rounded overflow-hidden">
                  <Image
                    src={col.cover || (col as any).cover_image || "/art/drawing-09.jpg"}
                    alt={col.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="rx-tag bg-white/90 backdrop-blur-sm text-black">
                      {col.artwork_count || "Series"} Artworks
                    </span>
                  </div>
                </div>
                <div className="rx-card-info">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="rx-card-title text-2xl group-hover:underline">
                      {col.title}
                    </h3>
                  </div>
                  <p className="text-black/60 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {col.blurb || (col as any).description || "A curated series of Himalayan artworks and watercolours."}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-black">
                    Explore Exhibition Series <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Dark Details Banner */}
      <section className="rx-dark-section">
        <div className="rx-dark-inner flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-white/50 font-semibold block mb-2">
              Bespoke Art Services
            </span>
            <h3 className="text-3xl font-bold tracking-tight">Looking for a specific theme or size?</h3>
            <p className="text-white/60 text-sm mt-2 max-w-lg">
              We frequently produce custom multi-piece collections for galleries, hotels, and private residences.
            </p>
          </div>
          <Link href="/commission" className="rx-btn rx-btn-white">
            Discuss a Commission <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <RevixFooter />
    </div>
  );
}
