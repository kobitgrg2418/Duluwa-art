"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collection } from "@/types";
import DuluwaNavbar from "@/components/duluwa-navbar";
import GenZGlassyFooter from "@/components/genz-footer";

// Mock data
const mockCollections: Collection[] = [
  {
    id: "1",
    no: "01",
    title: "HIMALAYAN COLLECTION",
    count: 15,
    hue: 200,
    blurb: "Majestic peaks and serene valleys of the Himalayas captured in delicate watercolor washes",
    cover: "/assets/IMG_3956_1780590402771.jpeg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "2",
    no: "02",
    title: "CULTURAL HERITAGE",
    count: 12,
    hue: 150,
    blurb: "Traditional Nepalese culture and customs brought to life through intimate portraits",
    cover: "/assets/IMG_3838.jpeg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "3",
    no: "03",
    title: "WILDLIFE SERIES",
    count: 8,
    hue: 100,
    blurb: "Nepal's incredible biodiversity captured in moments of natural beauty",
    cover: "/assets/auth-brushes.png",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "4",
    no: "04",
    title: "PORTRAIT STUDIES",
    count: 18,
    hue: 50,
    blurb: "Intimate character studies of Nepal's people, capturing dignity and spirit",
    cover: "/assets/IMG_3838.jpeg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "5",
    no: "05",
    title: "LIFESTYLE MOMENTS",
    count: 10,
    hue: 300,
    blurb: "Daily life in Nepal, from bustling markets to quiet moments of reflection",
    cover: "/assets/auth-brushes.png",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "6",
    no: "06",
    title: "QUICK SKETCHES",
    count: 25,
    hue: 250,
    blurb: "Quick studies and observational drawings capturing fleeting moments",
    cover: "/assets/IMG_3956_1780590402771.jpeg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  }
];

interface CollectionCardProps {
  title: string;
  count: number;
  imageSrc: string;
  imageAlt?: string;
  imageAspect?: 'landscape' | 'portrait' | 'square';
  id: string;
}

function CollectionCard({
  title,
  count,
  imageSrc,
  imageAlt = 'Collection artwork',
  imageAspect = 'landscape',
  id,
}: CollectionCardProps) {
  const aspectClass =
    imageAspect === 'portrait'
      ? 'aspect-[3/4] max-w-[400px]'
      : 'aspect-[4/3] max-w-[550px]';

  return (
    <Link href={`/collections/${id}`} className="group block">
      <div className="group flex flex-col justify-between bg-[#f3f3f3] rounded-xl p-10 sm:p-16 transition-all duration-300 hover:shadow-lg w-full min-h-[560px]">
        {/* Artwork Container - Centered */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div
            className={`relative w-full ${aspectClass} overflow-hidden shadow-md border border-black/10 transition-transform duration-500 ease-out group-hover:scale-[1.02]`}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Card Footer Meta */}
        <div className="flex items-center justify-between text-[12px] tracking-widest text-neutral-800 font-medium uppercase pt-6 border-t border-transparent">
          <span>{title}</span>
          <span className="text-neutral-500">{count} ARTWORKS</span>
        </div>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="site">
      <DuluwaNavbar />
      
      {/* Hero Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold tracking-tight"
          >
            COLLECTIONS
          </motion.h1>
          
          {/* Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex gap-8 mt-8 text-sm font-medium"
          >
            <button 
              onClick={() => setActiveFilter("ALL")}
              className={activeFilter === "ALL" ? "text-red-500" : "text-gray-500 hover:text-black"}
            >
              ALL
            </button>
            <button 
              onClick={() => setActiveFilter("NEW")}
              className={activeFilter === "NEW" ? "text-red-500" : "text-gray-500 hover:text-black"}
            >
              NEW COLLECTION
            </button>
            <button 
              onClick={() => setActiveFilter("LANDSCAPE")}
              className={activeFilter === "LANDSCAPE" ? "text-red-500" : "text-gray-500 hover:text-black"}
            >
              LANDSCAPES
            </button>
            <button 
              onClick={() => setActiveFilter("PORTRAIT")}
              className={activeFilter === "PORTRAIT" ? "text-red-500" : "text-gray-500 hover:text-black"}
            >
              PORTRAITS
            </button>
          </motion.div>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <section className="px-8 py-4 border-y border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button className="text-sm font-medium flex items-center gap-2">
            <Filter className="w-4 h-4" />
            FILTERS
          </button>
          <button className="text-sm font-medium">SORT BY</button>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CollectionCard
                  title={collection.title}
                  count={collection.count}
                  imageSrc={collection.cover}
                  imageAlt={collection.title}
                  id={collection.id}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* View More Button */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <Button 
            size="lg"
            className="bg-black text-white hover:bg-red-500 hover:text-white transition-colors"
          >
            VIEW MORE
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <GenZGlassyFooter />
    </main>
  );
}
