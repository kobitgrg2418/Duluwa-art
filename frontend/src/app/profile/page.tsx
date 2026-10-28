"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Package, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";
import { formatPrice } from "@/lib/utils";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      <section className="rx-hero">
        <div className="pb-8 border-b border-black/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
              Collector Account
            </div>
            <h1 className="rx-hero-title mb-1">My Collection</h1>
            <p className="text-black/60 text-sm">
              Signed in as <span className="font-semibold text-black">{user?.email || "Collector"}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rx-btn rx-btn-outline text-xs flex items-center gap-2 text-red-600 hover:border-red-600"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-4 pt-8 pb-8 border-b border-black/10">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "orders" ? "bg-black text-white" : "bg-black/5 text-black hover:bg-black/10"
            }`}
          >
            Acquisitions &amp; Orders
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "settings" ? "bg-black text-white" : "bg-black/5 text-black hover:bg-black/10"
            }`}
          >
            Collector Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-12">
          {activeTab === "orders" ? (
            <div className="text-center py-16 bg-black/5 rounded-2xl max-w-xl mx-auto p-8">
              <Package className="w-12 h-12 text-black/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No past acquisitions recorded</h3>
              <p className="text-black/60 text-sm mb-6 leading-relaxed">
                When you acquire artworks through our exhibition shop or commissioned catalog, your orders and certificates will appear here.
              </p>
              <Link href="/shop" className="rx-btn rx-btn-black text-xs">
                Browse Exhibited Works
              </Link>
            </div>
          ) : (
            <div className="max-w-xl mx-auto bg-black/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Profile Settings</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs uppercase text-black/50 font-semibold mb-1">Name</span>
                  <p className="font-semibold">{user?.name || (user as any)?.first_name || "Collector"}</p>
                </div>
                <div>
                  <span className="block text-xs uppercase text-black/50 font-semibold mb-1">Email</span>
                  <p className="font-semibold">{user?.email || "Not specified"}</p>
                </div>
                <div>
                  <span className="block text-xs uppercase text-black/50 font-semibold mb-1">Account Status</span>
                  <span className="rx-tag bg-white text-black">Active Member</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <RevixFooter />
    </div>
  );
}
