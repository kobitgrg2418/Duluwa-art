"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Share2 } from "lucide-react";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";
import { formatPrice } from "@/lib/utils";
import { Artwork, Collection } from "@/types";
import { artworkData, collectionData } from "@/lib/collection-data";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

export default function CollectionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    // Find collection
    const foundCol = collectionData.find((c) => c.id === id) || collectionData[0];
    setCollection(foundCol);

    // Filter artworks in this collection or related
    const related = artworkData.filter((a) => a.collection_id === id || a.collection?.category?.toLowerCase() === foundCol?.category?.toLowerCase());
    setArtworks(related.length > 0 ? related : artworkData.slice(0, 4));
    setLoading(false);
  }, [id]);

  const handleAddToCart = (art: Artwork) => {
    addItem(art);
    toast.success(`"${art.title}" added to your cart.`);
  };

  if (!collection && !loading) {
    return (
      <div className="bg-[#fcfcfc] text-black min-h-screen">
        <RevixNavbar />
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold mb-4">Collection not found</h2>
          <Link href="/collections" className="rx-btn rx-btn-black">
            Return to Collections
          </Link>
        </div>
        <RevixFooter />
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      <section className="rx-hero">
        <div className="pb-8 border-b border-black/10">
          <Link href="/collections" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black/50 hover:text-black mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> All Collections
          </Link>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
                Curated Series
              </div>
              <h1 className="rx-hero-title mb-2">{collection?.title}</h1>
            </div>
            <p className="max-w-md text-sm text-black/70 leading-relaxed">
              {collection?.blurb || (collection as any)?.description || "Curated body of Himalayan paintings and works on cotton rag."}
            </p>
          </div>
        </div>

        {/* Artworks in this collection */}
        <div className="py-16">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold">Series Artworks ({artworks.length})</h2>
            <Link href="/commission" className="rx-btn rx-btn-outline text-xs">
              Commission Similar Piece
            </Link>
          </div>

          <div className="rx-grid">
            {artworks.map((art) => {
              const displayImg = art.image || "/art/drawing-09.jpg";
              return (
                <div key={art.id} className="rx-card group">
                  <div className="rx-card-media relative">
                    <Image
                      src={displayImg}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="rx-card-info">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="rx-card-title text-xl">{art.title}</h3>
                      <span className="font-semibold text-sm">
                        {formatPrice ? formatPrice(art.price) : `Rs. ${art.price}`}
                      </span>
                    </div>
                    <p className="rx-card-meta mb-3">
                      {art.medium} &bull; {art.size}
                    </p>
                    <p className="text-xs text-black/60 line-clamp-2 mb-4 leading-relaxed">
                      {art.note || (art as any).description || "Original artwork on cotton rag."}
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-black/5">
                      <button
                        onClick={() => handleAddToCart(art)}
                        className="rx-btn rx-btn-black text-[11px] py-2 px-4"
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <RevixFooter />
    </div>
  );
}
