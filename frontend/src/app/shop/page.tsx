"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpRight } from "lucide-react";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";
import { formatPrice } from "@/lib/utils";
import { Artwork, Collection } from "@/types";
import { artworkData, collectionData } from "@/lib/collection-data";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

export default function ShopPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const { addItem } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { api } = await import("@/lib/api");
      const [artworksResponse, collectionsResponse] = await Promise.all([
        api.get("/artworks/").catch(() => ({ data: artworkData })),
        api.get("/collections/").catch(() => ({ data: collectionData })),
      ]);
      setArtworks(artworksResponse.data.results || artworksResponse.data || artworkData);
      setCollections(collectionsResponse.data.results || collectionsResponse.data || collectionData);
    } catch (error) {
      console.error("Failed to load shop data:", error);
      setArtworks(artworkData);
      setCollections(collectionData);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (art: Artwork) => {
    addItem(art);
    toast.success(`"${art.title}" added to your cart.`);
  };

  const categories = ["All", "Himalaya", "Culture", "Portrait", "Sketch"];

  const filteredArtworks = artworks
    .filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.note && art.note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === "All" ||
        (art as any).category?.toLowerCase() === selectedCategory.toLowerCase() ||
        art.collection?.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        art.collection?.title?.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      {/* Hero Header */}
      <section className="rx-hero">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-12 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
              Original Artworks &amp; Studies
            </div>
            <h1 className="rx-hero-title">
              Gallery Shop &amp;<br />
              Exhibition Pieces
            </h1>
          </div>
          <div className="max-w-md">
            <p className="rx-hero-sub mb-6">
              Acquire authentic original paintings created with fine pigment washes on handmade Nepalese
              cotton rag paper. Each piece includes a signed Certificate of Authenticity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/commission" className="rx-btn rx-btn-black">
                Custom Commission <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="pt-8 pb-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? "bg-black text-white"
                    : "bg-black/5 text-black hover:bg-black/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-black/15 rounded-full text-xs bg-transparent focus:outline-none focus:border-black"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-black/15 rounded-full text-xs bg-transparent focus:outline-none focus:border-black"
            >
              <option value="featured">Featured Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Artworks Grid */}
      <section className="px-8 pb-24 max-w-[1720px] mx-auto">
        {loading ? (
          <div className="py-24 text-center text-black/40 text-sm uppercase tracking-widest">
            Loading gallery pieces...
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-xl font-bold mb-2">No artworks match your search</h3>
            <p className="text-black/60 text-sm mb-6">Try clearing your search query or filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="rx-btn rx-btn-black text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="rx-grid">
            {filteredArtworks.map((art) => {
              const displayImg = art.image || "/art/drawing-09.jpg";
              return (
                <div key={art.id} className="rx-card group">
                  <div className="rx-card-media relative">
                    <Image
                      src={displayImg}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="rx-tag bg-white/90 backdrop-blur-sm text-black">
                        {(art as any).category || art.collection?.title || "Original Work"}
                      </span>
                    </div>
                  </div>
                  <div className="rx-card-info">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="rx-card-title text-xl">{art.title}</h3>
                      <span className="font-semibold text-sm">
                        {formatPrice ? formatPrice(art.price) : `Rs. ${art.price}`}
                      </span>
                    </div>
                    <p className="rx-card-meta mb-3">
                      {art.medium} &bull; {art.size || "Original"}
                    </p>
                    <p className="text-xs text-black/60 line-clamp-2 mb-4 leading-relaxed">
                      {art.note || "Fine artwork on handmade Nepalese cotton rag paper."}
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-black/5">
                      <button
                        onClick={() => handleAddToCart(art)}
                        className="rx-btn rx-btn-black text-[11px] py-2 px-4"
                      >
                        + Add to Cart
                      </button>
                      <Link
                        href={`/collections/${art.collection_id || art.id}`}
                        className="text-xs font-semibold underline text-black/70 hover:text-black"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <RevixFooter />
    </div>
  );
}
