"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, SlidersHorizontal, Heart, X } from "lucide-react";
import DuluwaNavbar from "@/components/duluwa-navbar";
import GenZGlassyFooter from "@/components/genz-footer";
import { formatPrice } from "@/lib/utils";
import { Artwork, Collection } from "@/types";
import { artworkData, collectionData } from "@/lib/collection-data";

export default function ShopPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Artworks");
  const [selectedMedium, setSelectedMedium] = useState("All");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("Featured");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

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
      console.error("Failed to fetch data, using local data:", error);
      setArtworks(artworkData);
      setCollections(collectionData);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (artworkId: string) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(artworkId)) {
        newSet.delete(artworkId);
      } else {
        newSet.add(artworkId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Artworks");
    setSelectedMedium("All");
    setSelectedCollection("All");
    setPriceRange({ min: 0, max: 10000 });
    setSortBy("Featured");
  };

  const filteredAndSortedArtworks = artworks
    .filter((artwork) => {
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.note?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Artworks" ||
        (selectedCategory === "Available Now" && artwork.status === "IN_SALE") ||
        (selectedCategory === "Original Paintings" && artwork.medium.toLowerCase().includes("watercolour")) ||
        (selectedCategory === "Art Prints" && artwork.medium.toLowerCase().includes("sketch"));

      const matchesMedium = selectedMedium === "All" || artwork.medium.toLowerCase().includes(selectedMedium.toLowerCase());

      const matchesCollection = selectedCollection === "All" || artwork.collection_id === selectedCollection;

      const matchesPrice = artwork.price >= priceRange.min && artwork.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesMedium && matchesCollection && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return 0; // Would use date if available
        case "Price: Low to High":
          return a.price - b.price;
        case "Price: High to Low":
          return b.price - a.price;
        case "Best Selling":
          return b.featured ? 1 : -1;
        default:
          return 0;
      }
    });

  const categories = ["All Artworks", "Original Paintings", "Art Prints", "Limited Editions", "Available Now"];
  const mediums = ["All", "Watercolour", "Graphite", "Acrylic", "Oil", "Digital"];
  const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Best Selling"];

  if (loading) {
    return (
      <>
        <DuluwaNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-900 border-t-transparent mx-auto" />
        </div>
        <GenZGlassyFooter />
      </>
    );
  }

  return (
    <>
      <DuluwaNavbar />

      <main className="min-h-screen bg-[#FAFAF8] text-zinc-900 pb-20 pt-[76px]">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 mb-6">
              <Link href="/" className="hover:text-zinc-900 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-zinc-900">Shop Art</span>
            </div>

            {/* Eyebrow */}
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">
              The Duluwa Art Collection
            </p>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
              Art That Speaks Beyond Words
            </h1>

            {/* Description */}
            <p className="text-lg text-zinc-600 max-w-2xl leading-relaxed">
              Explore original artworks and thoughtfully curated prints, created to bring character,
              emotion, and individuality into your space.
            </p>
          </motion.div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-8 border-b border-zinc-200">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "text-zinc-900 border-b-2 border-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Search, Filter, and Sort Bar */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-zinc-200 rounded-full focus:outline-none focus:border-zinc-900 transition-colors text-sm bg-white"
              />
            </div>

            {/* Filter and Sort */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-zinc-200 rounded-full text-sm hover:border-zinc-900 transition-colors bg-white"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-zinc-200 rounded-full text-sm focus:outline-none focus:border-zinc-900 transition-colors bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <span className="text-sm text-zinc-500">
                {filteredAndSortedArtworks.length} artworks
              </span>
            </div>
          </div>

          {/* Filter Drawer */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 bg-white border border-zinc-200 rounded-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Medium Filter */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-3">
                    Medium
                  </label>
                  <select
                    value={selectedMedium}
                    onChange={(e) => setSelectedMedium(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                  >
                    {mediums.map((medium) => (
                      <option key={medium} value={medium}>
                        {medium}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Collection Filter */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-3">
                    Collection
                  </label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                  >
                    <option value="All">All Collections</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-3">
                    Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                    <span className="text-zinc-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-sm hover:border-zinc-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* Artwork Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          {filteredAndSortedArtworks.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-zinc-500 text-lg">No artworks found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-zinc-900 underline hover:no-underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredAndSortedArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/collections/${artwork.id}`} className="group block">
                    <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden mb-4">
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

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(artwork.id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            wishlist.has(artwork.id) ? "fill-red-500 text-red-500" : "text-zinc-600"
                          }`}
                        />
                      </button>

                      {/* Status Badge */}
                      {artwork.status === "SOLD_OUT" && (
                        <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                          Sold Out
                        </div>
                      )}

                      {artwork.featured && artwork.status === "IN_SALE" && (
                        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-zinc-900 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                          Featured
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-xs uppercase tracking-widest font-medium">
                          View Artwork
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div>
                      <h3 className="font-medium text-zinc-900 mb-1">{artwork.title}</h3>
                      <p className="text-sm text-zinc-500 mb-2">
                        {artwork.medium} • {artwork.size || "Various sizes"}
                      </p>
                      <p className="text-base font-light text-zinc-900">{formatPrice(artwork.price)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <GenZGlassyFooter />
    </>
  );
}
