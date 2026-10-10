"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Artwork, Collection } from "@/types";

// Mock data for fallback
const mockCollections: Collection[] = [
  {
    id: "1",
    no: "01",
    title: "Himalaya",
    count: 15,
    hue: 200,
    blurb: "Majestic peaks and serene valleys of the Himalayas",
    cover: "/assets/auth-brushes.png",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "2",
    no: "02", 
    title: "Culture",
    count: 12,
    hue: 150,
    blurb: "Traditional Nepalese culture and customs",
    cover: "/assets/IMG_3838.jpeg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  }
];

const mockArtworks: Artwork[] = [
  {
    id: "1",
    title: "Mountain Reflection",
    year: "2023",
    medium: "Watercolor on paper",
    size: "16x20 inches",
    collection: mockCollections[0],
    collection_id: "1",
    hue: 200,
    ratio: 1.25,
    featured: true,
    note: "A serene mountain landscape",
    image: "/assets/IMG_3956_1780590402771.jpeg",
    video: "",
    price: 500,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "2",
    title: "Cultural Heritage",
    year: "2024",
    medium: "Watercolor on paper", 
    size: "12x16 inches",
    collection: mockCollections[1],
    collection_id: "2",
    hue: 150,
    ratio: 1.33,
    featured: true,
    note: "Traditional portrait study",
    image: "/assets/IMG_3838.jpeg",
    video: "",
    price: 750,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "3",
    title: "Himalayan Vista",
    year: "2024",
    medium: "Watercolor on paper",
    size: "18x24 inches", 
    collection: mockCollections[0],
    collection_id: "1",
    hue: 180,
    ratio: 1.33,
    featured: false,
    note: "Expansive mountain view",
    image: "/assets/auth-brushes.png",
    video: "",
    price: 950,
    status: "SOLD_OUT",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  }
];

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCollection, setActiveCollection] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { api } = await import("@/lib/api");
      
      const [artworksResponse, collectionsResponse] = await Promise.all([
        api.get("/artworks/").catch(() => ({ data: mockArtworks })),
        api.get("/collections/").catch(() => ({ data: mockCollections }))
      ]);

      setArtworks(artworksResponse.data.results || artworksResponse.data || mockArtworks);
      setCollections(collectionsResponse.data.results || collectionsResponse.data || mockCollections);
    } catch (error) {
      console.error("Failed to fetch data, using mock data:", error);
      setArtworks(mockArtworks);
      setCollections(mockCollections);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtworks = artworks.filter(artwork => {
    if (activeCollection && artwork.collection_id !== activeCollection) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-zinc-100">
        <div className="absolute inset-0">
          <img 
            src="/assets/IMG_3956_1780590402771.jpeg" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
        </div>
        
        {/* Decorative Circle outline */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border-[1px] border-white/40 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-6xl font-light tracking-wide">
              Art
            </h1>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 text-white">
          <p className="text-sm uppercase tracking-widest opacity-80">
            // Art Collection
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24">
        
        {/* Header Text */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-light leading-tight max-w-xl">
            Only the Essential,<br />
            Always the Exceptional
          </h2>
          <div className="hidden md:block text-7xl font-light text-zinc-300">
            0
          </div>
        </div>

        {/* Categories / Filters */}
        <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-16 overflow-x-auto pb-4 scrollbar-hide text-sm font-medium">
          <button 
            onClick={() => setActiveCollection("")}
            className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${
              activeCollection === "" 
                ? "bg-zinc-900 text-white" 
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            All
          </button>
          {collections.map(c => (
            <button 
              key={c.id}
              onClick={() => setActiveCollection(c.id)}
              className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${
                activeCollection === c.id
                  ? "bg-zinc-900 text-white" 
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-x-10 gap-y-20">
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ArtworkCard artwork={artwork} />
            </motion.div>
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="text-center py-24 text-zinc-500">
            No artworks available in this collection.
          </div>
        )}

      </div>
    </div>
  );
}

function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link href={`/gallery/${artwork.id}`} className="group flex flex-col items-center text-center">
      <div className="w-full aspect-[4/3] bg-[#f7f7f7] rounded-sm flex items-center justify-center p-8 mb-6 overflow-hidden relative transition-all duration-500 group-hover:bg-[#f0f0f0]">
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-zinc-400 text-sm">Preview</div>
        )}
        
        {artwork.status === "SOLD_OUT" && (
          <div className="absolute top-4 right-4 bg-zinc-900 text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
            Sold
          </div>
        )}
      </div>
      
      <h3 className="font-medium text-lg text-zinc-900 tracking-wide mb-1">
        {artwork.title}
      </h3>
      
      <p className="text-sm text-zinc-500 mb-4">
        {formatPrice(artwork.price)}
      </p>
    </Link>
  );
}
