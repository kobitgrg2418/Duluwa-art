"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import "@/app/template.css";
import "@/components/genz-footer.css";
import DuluwaNavbar from "@/components/duluwa-navbar";
import GenZGlassyFooter from "@/components/genz-footer";
import { formatPrice } from "@/lib/utils";
import { Artwork, Collection } from "@/types";

// Mock data for fallback
const mockCollections: Collection[] = [
  {
    id: "1",
    no: "01",
    title: "Himalaya",
    count: 9,
    hue: 200,
    blurb: "Majestic peaks and serene valleys of the Himalayas",
    cover: "/assets/IMG_20261010_0001.jpg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "2",
    no: "02",
    title: "Culture",
    count: 6,
    hue: 150,
    blurb: "Traditional Nepalese culture and customs",
    cover: "/assets/IMG_20261010_0002.jpg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "3",
    no: "03",
    title: "Portraits",
    count: 5,
    hue: 30,
    blurb: "Intimate character studies",
    cover: "/assets/IMG_20261010_0003.jpg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
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
    image: "/assets/IMG_20261010_0001.jpg",
    video: "",
    price: 500,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
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
    image: "/assets/IMG_20261010_0002.jpg",
    video: "",
    price: 750,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
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
    image: "/assets/IMG_20261010_0003.jpg",
    video: "",
    price: 950,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "4",
    title: "Morning Mist",
    year: "2023",
    medium: "Watercolor on paper",
    size: "14x18 inches",
    collection: mockCollections[0],
    collection_id: "1",
    hue: 210,
    ratio: 1.2,
    featured: false,
    note: "Early morning fog over peaks",
    image: "/assets/IMG_20261010_0004.jpg",
    video: "",
    price: 600,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "5",
    title: "Portrait Study I",
    year: "2023",
    medium: "Watercolor on paper",
    size: "10x14 inches",
    collection: mockCollections[2],
    collection_id: "3",
    hue: 30,
    ratio: 0.75,
    featured: true,
    note: "Character study",
    image: "/assets/IMG_20261010_0005.jpg",
    video: "",
    price: 420,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "6",
    title: "Valley Light",
    year: "2024",
    medium: "Watercolor on paper",
    size: "20x24 inches",
    collection: mockCollections[0],
    collection_id: "1",
    hue: 195,
    ratio: 1.25,
    featured: false,
    note: "Golden light over the valley",
    image: "/assets/IMG_20261010_0006.jpg",
    video: "",
    price: 1100,
    status: "SOLD_OUT",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "7",
    title: "Sketch Study II",
    year: "2023",
    medium: "Pen & Watercolor",
    size: "8x10 inches",
    collection: mockCollections[1],
    collection_id: "2",
    hue: 40,
    ratio: 1.0,
    featured: false,
    note: "Quick observational sketch",
    image: "/assets/IMG_20261010_0007.jpg",
    video: "",
    price: 280,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "8",
    title: "Traditional Motif",
    year: "2024",
    medium: "Watercolor on paper",
    size: "12x12 inches",
    collection: mockCollections[1],
    collection_id: "2",
    hue: 160,
    ratio: 1.0,
    featured: false,
    note: "Cultural pattern study",
    image: "/assets/IMG_20261010_0008.jpg",
    video: "",
    price: 380,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "9",
    title: "Duluwa Study",
    year: "2024",
    medium: "Watercolor on paper",
    size: "16x20 inches",
    collection: mockCollections[2],
    collection_id: "3",
    hue: 25,
    ratio: 0.8,
    featured: true,
    note: "Expressive figure study",
    image: "/assets/IMG_20261010_0009.jpg",
    video: "",
    price: 860,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "10",
    title: "Landscape Sketch",
    year: "2023",
    medium: "Watercolor on paper",
    size: "12x16 inches",
    collection: mockCollections[0],
    collection_id: "1",
    hue: 185,
    ratio: 1.33,
    featured: false,
    note: "Plein air study",
    image: "/assets/IMG_4557.jpg",
    video: "",
    price: 490,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "11",
    title: "Still Life",
    year: "2023",
    medium: "Watercolor on paper",
    size: "10x12 inches",
    collection: mockCollections[1],
    collection_id: "2",
    hue: 55,
    ratio: 1.1,
    featured: false,
    note: "Everyday objects study",
    image: "/assets/IMG_4558.jpg",
    video: "",
    price: 320,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "12",
    title: "Field Notes",
    year: "2024",
    medium: "Watercolor on paper",
    size: "8x10 inches",
    collection: mockCollections[2],
    collection_id: "3",
    hue: 70,
    ratio: 0.8,
    featured: false,
    note: "Sketchbook page",
    image: "/assets/IMG_4559.JPG",
    video: "",
    price: 240,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "13",
    title: "Golden Hour",
    year: "2024",
    medium: "Watercolor on paper",
    size: "18x24 inches",
    collection: mockCollections[0],
    collection_id: "1",
    hue: 40,
    ratio: 1.33,
    featured: true,
    note: "Sunset over the hills",
    image: "/assets/IMG_20261010_0001.jpg",
    video: "",
    price: 1250,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "14",
    title: "Figure Study",
    year: "2023",
    medium: "Watercolor on paper",
    size: "14x18 inches",
    collection: mockCollections[2],
    collection_id: "3",
    hue: 20,
    ratio: 0.78,
    featured: false,
    note: "Life drawing session",
    image: "/assets/IMG_20261010_0002.jpg",
    video: "",
    price: 580,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "15",
    title: "Art Study",
    year: "2024",
    medium: "Mixed media",
    size: "12x16 inches",
    collection: mockCollections[1],
    collection_id: "2",
    hue: 100,
    ratio: 1.2,
    featured: false,
    note: "Brush study",
    image: "/assets/IMG_20261010_0004.jpg",
    video: "",
    price: 430,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "16",
    title: "Reflections",
    year: "2024",
    medium: "Watercolor on paper",
    size: "16x20 inches",
    collection: mockCollections[0],
    collection_id: "1",
    hue: 190,
    ratio: 1.25,
    featured: false,
    note: "Water reflections study",
    image: "/assets/IMG_20261010_0005.jpg",
    video: "",
    price: 720,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
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
        api.get("/collections/").catch(() => ({ data: mockCollections })),
      ]);
      setArtworks(
        artworksResponse.data.results || artworksResponse.data || mockArtworks
      );
      setCollections(
        collectionsResponse.data.results ||
          collectionsResponse.data ||
          mockCollections
      );
    } catch (error) {
      console.error("Failed to fetch data, using mock data:", error);
      setArtworks(mockArtworks);
      setCollections(mockCollections);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtworks = artworks.filter((artwork) => {
    if (activeCollection && artwork.collection_id !== activeCollection)
      return false;
    return true;
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
    <>
      <DuluwaNavbar />

      <div className="min-h-screen bg-white text-zinc-900 pb-20 pt-[76px]">
        {/* Hero Section */}
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-zinc-100">
          <div className="absolute inset-0">
            <img
              src="/assets/IMG_20261010_0001.jpg"
              alt="Hero Background"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
          </div>

          {/* Decorative Circle outline */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-white/40 flex items-center justify-center">
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
              Only the Essential,
              <br />
              Always the Exceptional
            </h2>
            <div className="hidden md:block text-7xl font-light text-zinc-300">
              0
            </div>
          </div>

          {/* Categories / Filters */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-16 overflow-x-auto pb-4 text-sm font-medium">
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
            {collections.map((c) => (
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

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {filteredArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                className="break-inside-avoid mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ArtworkCard artwork={artwork} index={index} />
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

      <GenZGlassyFooter />
    </>
  );
}

function ArtworkCard({ artwork, index }: { artwork: Artwork; index: number }) {
  // Cycle through different aspect ratios to create natural masonry variation
  const ratios = [
    "aspect-[3/4]",   // tall portrait
    "aspect-[4/3]",   // wide landscape
    "aspect-[2/3]",   // extra tall
    "aspect-square",  // square
    "aspect-[5/4]",   // slightly wide
    "aspect-[3/5]",   // tall
  ];
  const ratio = ratios[index % ratios.length];

  return (
    <Link
      href={`/gallery/${artwork.id}`}
      className="group block"
    >
      <div
        className={`w-full ${ratio} bg-[#f5f5f3] rounded-lg overflow-hidden relative transition-all duration-500 group-hover:bg-[#eeede9] mb-3`}
      >
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
            Preview
          </div>
        )}

        {artwork.status === "SOLD_OUT" && (
          <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
            Sold
          </div>
        )}

        {/* Hover overlay with quick info */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-end p-4 opacity-0 group-hover:opacity-100">
          <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <span className="text-white text-xs uppercase tracking-widest font-medium">
              {artwork.collection?.title}
            </span>
          </div>
        </div>
      </div>

      <div className="px-1">
        <h3 className="font-medium text-zinc-900 tracking-wide mb-0.5">
          {artwork.title}
        </h3>
        <p className="text-sm text-zinc-500">
          {formatPrice(artwork.price)}
        </p>
      </div>
    </Link>
  );
}
