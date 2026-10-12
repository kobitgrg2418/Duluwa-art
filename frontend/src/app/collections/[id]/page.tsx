"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DuluwaNavbar from "@/components/duluwa-navbar";
import GenZGlassyFooter from "@/components/genz-footer";
import { formatPrice } from "@/lib/utils";
import { Artwork, Collection } from "@/types";
import { artworkData, collectionData } from "@/lib/collection-data";

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtwork();
  }, [params.id]);

  const fetchArtwork = async () => {
    setLoading(true);
    try {
      const { api } = await import("@/lib/api");
      const response = await api.get(`/artworks/${params.id}/`).catch(() => ({ data: null }));

      if (response.data) {
        setArtwork(response.data);
        // Fetch collection
        const collectionResponse = await api.get(`/collections/${response.data.collection_id}/`).catch(() => ({ data: null }));
        setCollection(collectionResponse.data);

        // Fetch related artworks from same collection
        const relatedResponse = await api.get(`/artworks/?collection=${response.data.collection_id}`).catch(() => ({ data: { results: [] } }));
        setRelatedArtworks(
          (relatedResponse.data.results || relatedResponse.data || [])
            .filter((a: Artwork) => a.id !== response.data.id)
            .slice(0, 4)
        );
      } else {
        // Fallback to mock data
        const mockArtwork = artworkData.find((a) => a.id === params.id);
        if (mockArtwork) {
          setArtwork(mockArtwork);
          setCollection(collectionData.find((c) => c.id === mockArtwork.collection_id) || null);
          setRelatedArtworks(
            artworkData
              .filter((a) => a.collection_id === mockArtwork.collection_id && a.id !== mockArtwork.id)
              .slice(0, 4)
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch artwork:", error);
      // Fallback to mock data
      const mockArtwork = artworkData.find((a) => a.id === params.id);
      if (mockArtwork) {
        setArtwork(mockArtwork);
        setCollection(collectionData.find((c) => c.id === mockArtwork.collection_id) || null);
        setRelatedArtworks(
          artworkData
            .filter((a) => a.collection_id === mockArtwork.collection_id && a.id !== mockArtwork.id)
            .slice(0, 4)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log("Added to cart:", artwork?.id);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
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

  if (!artwork) {
    return (
      <>
        <DuluwaNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light mb-4">Artwork not found</h1>
            <Link href="/gallery">
              <Button>Back to Gallery</Button>
            </Link>
          </div>
        </div>
        <GenZGlassyFooter />
      </>
    );
  }

  return (
    <>
      <DuluwaNavbar />

      <main className="min-h-screen bg-white text-zinc-900 pb-20 pt-[76px]">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-zinc-100 rounded-xl overflow-hidden">
                {artwork.image ? (
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full h-[600px] flex items-center justify-center text-zinc-400">
                    No image available
                  </div>
                )}
              </div>

              {artwork.status === "SOLD_OUT" && (
                <div className="mt-4">
                  <span className="inline-block bg-zinc-900 text-white text-xs uppercase tracking-wider px-4 py-2 rounded-full">
                    Sold Out
                  </span>
                </div>
              )}
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col"
            >
              {/* Collection Badge */}
              {collection && (
                <Link
                  href={`/collections/${collection.id}`}
                  className="inline-block text-xs uppercase tracking-widest text-red-500 hover:text-red-600 mb-4"
                >
                  {collection.title}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                {artwork.title}
              </h1>

              {/* Price */}
              <div className="text-2xl md:text-3xl font-light text-zinc-900 mb-8">
                {formatPrice(artwork.price)}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Year</p>
                  <p className="text-base">{artwork.year}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Medium</p>
                  <p className="text-base">{artwork.medium}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Size</p>
                  <p className="text-base">{artwork.size || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Status</p>
                  <p className="text-base">{artwork.status === "IN_SALE" ? "Available" : "Sold Out"}</p>
                </div>
              </div>

              {/* Description */}
              {artwork.note && (
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">About this piece</p>
                  <p className="text-base text-zinc-600 leading-relaxed">{artwork.note}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                {artwork.status === "IN_SALE" && (
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 py-6 text-base"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                )}
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1 border-zinc-200 hover:border-zinc-900 py-6 text-base"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
            <h2 className="text-2xl font-light mb-8">More from this collection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedArtworks.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/gallery/${related.id}`} className="group block">
                    <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden mb-3">
                      {related.image ? (
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                          Preview
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm mb-1">{related.title}</h3>
                    <p className="text-sm text-zinc-500">{formatPrice(related.price)}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      <GenZGlassyFooter />
    </>
  );
}
