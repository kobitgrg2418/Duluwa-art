"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, total, itemCount } = useCart();

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      <section className="rx-hero">
        <div className="pb-8 border-b border-black/10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
            Checkout Review
          </div>
          <h1 className="rx-hero-title mb-2">Shopping Bag</h1>
          <p className="text-black/60 text-sm">
            {itemCount} {itemCount === 1 ? "piece" : "pieces"} selected for acquisition
          </p>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-black/30" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Your bag is empty</h2>
            <p className="text-black/60 text-sm mb-8 leading-relaxed">
              Explore our contemporary collection of Himalayan watercolours and archival prints to add pieces to your collection.
            </p>
            <Link href="/shop" className="rx-btn rx-btn-black">
              Explore Gallery <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Items List */}
            <div className="lg:col-span-8 divide-y divide-black/10">
              {items.map((item) => {
                const artwork = item.artwork;
                const displayImg = artwork.image || "/art/drawing-09.jpg";

                return (
                  <div key={artwork.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex gap-5 items-center">
                      <div className="relative w-24 h-24 rounded overflow-hidden bg-black/5 flex-shrink-0">
                        <Image
                          src={displayImg}
                          alt={artwork.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{artwork.title}</h3>
                        <p className="text-xs text-black/50 mb-1">
                          {artwork.medium || "Original Artwork"} &bull; {artwork.size || "Standard Size"}
                        </p>
                        <p className="text-sm font-semibold">{formatPrice(artwork.price)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center border border-black/15 rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(artwork.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:opacity-60"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(artwork.id, item.quantity + 1)}
                          className="p-1 hover:opacity-60"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(artwork.id)}
                        className="text-black/40 hover:text-red-500 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="pt-6 flex justify-between items-center">
                <Link href="/shop" className="text-xs font-semibold uppercase tracking-wider text-black flex items-center gap-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> Continue Browsing
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-black/50 hover:text-red-600 underline"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 bg-black/5 p-8 rounded-2xl h-fit">
              <h3 className="text-xl font-bold mb-6">Acquisition Summary</h3>
              <div className="space-y-4 text-sm mb-6 border-b border-black/10 pb-6">
                <div className="flex justify-between text-black/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Archival Packaging</span>
                  <span className="text-black font-semibold">Complimentary</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Shipping</span>
                  <span className="text-black/50 text-xs">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-8">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Link
                href="/checkout"
                className="rx-btn rx-btn-black w-full py-4 text-center text-sm"
              >
                Proceed to Checkout <ArrowUpRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-center text-black/50 mt-4">
                Secure transaction &bull; Authenticity Certificate included
              </p>
            </div>
          </div>
        )}
      </section>

      <RevixFooter />
    </div>
  );
}
