"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setCompleted(true);
      clearCart();
      toast.success("Order placed successfully! We have sent a confirmation email.");
    }, 1200);
  };

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      <section className="rx-hero">
        <div className="pb-8 border-b border-black/10">
          <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black/50 hover:text-black mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bag
          </Link>
          <h1 className="rx-hero-title mb-2">Secure Acquisition</h1>
          <p className="text-black/60 text-sm">Complete your artwork acquisition and delivery details.</p>
        </div>

        {completed ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <CheckCircle2 className="w-16 h-16 text-black mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-3">Order Confirmed</h2>
            <p className="text-black/60 text-sm mb-8 leading-relaxed">
              Thank you for supporting authentic Nepalese art. Your certificate of authenticity and tracking details will be emailed to you shortly.
            </p>
            <Link href="/" className="rx-btn rx-btn-black">
              Return to Gallery
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCompleteOrder} className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Delivery Details */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Delivery &amp; Collector Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Collector Full Name"
                      className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="name@domain.com"
                      className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Shipping Destination</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                      Street Address *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Apartment, suite, unit, street"
                      className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                        City *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Kathmandu"
                        className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder="44600"
                        className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                <div className="border border-black/15 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <input type="radio" id="pay1" name="payment" defaultChecked className="accent-black" />
                    <label htmlFor="pay1" className="text-sm font-semibold cursor-pointer">
                      Credit Card / International Bank Transfer / eSewa
                    </label>
                  </div>
                  <p className="text-xs text-black/60 pl-6 leading-relaxed">
                    We will send secure direct checkout instructions and payment confirmation link.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5 bg-black/5 p-8 rounded-2xl h-fit">
              <h3 className="text-xl font-bold mb-6">Acquisition Overview</h3>
              <div className="space-y-3 mb-6 border-b border-black/10 pb-6">
                {items.map((i) => (
                  <div key={i.artwork.id} className="flex justify-between text-sm">
                    <span className="line-clamp-1 max-w-[200px]">{i.artwork.title} (x{i.quantity})</span>
                    <span className="font-semibold">{formatPrice(i.artwork.price * i.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-lg font-bold mb-8">
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="rx-btn rx-btn-black w-full py-4 text-center text-sm"
              >
                {submitting ? "Processing..." : "Place Acquisition Order"}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-black/50 mt-4">
                <ShieldCheck className="w-4 h-4" /> Archival protection &amp; insured shipment
              </div>
            </div>
          </form>
        )}
      </section>

      <RevixFooter />
    </div>
  );
}
