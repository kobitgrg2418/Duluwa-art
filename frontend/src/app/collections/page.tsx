"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collection } from "@/types";

// Mock data for fallback
const mockCollections: Collection[] = [
  {
    id: "1",
    no: "01",
    title: "Himalaya",
    count: 15,
    hue: 200,
    blurb: "Majestic peaks and serene valleys of the Himalayas captured in delicate watercolor washes. These works explore the interplay of light and shadow across Nepal's most iconic mountain ranges.",
    cover: "/assets/IMG_3956_1780590402771.jpeg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "2",
    no: "02",
    title: "Culture",
    count: 12,
    hue: 150,
    blurb: "Traditional Nepalese culture and customs brought to life through intimate portraits and ceremonial scenes. Each piece tells a story of heritage and tradition.",
    cover: "/assets/IMG_3838.jpeg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "3",
    no: "03",
    title: "Wildlife",
    count: 8,
    hue: 100,
    blurb: "Nepal's incredible biodiversity captured in moments of natural beauty. From the forests of Chitwan to the highlands of Mustang.",
    cover: "/assets/auth-brushes.png",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "4",
    no: "04",
    title: "Portraits",
    count: 18,
    hue: 50,
    blurb: "Intimate character studies of Nepal's people. These portraits capture the dignity, wisdom, and spirit of individuals from all walks of life.",
    cover: "/assets/IMG_3838.jpeg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "5",
    no: "05",
    title: "Lifestyle",
    count: 10,
    hue: 300,
    blurb: "Daily life in Nepal, from bustling markets to quiet moments of reflection. These scenes celebrate the rhythm of everyday existence.",
    cover: "/assets/auth-brushes.png",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "6",
    no: "06",
    title: "Sketches",
    count: 25,
    hue: 250,
    blurb: "Quick studies and observational drawings that capture fleeting moments and spontaneous inspiration. The raw energy of artistic discovery.",
    cover: "/assets/IMG_3956_1780590402771.jpeg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  }
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      // Try to fetch from API, fallback to mock data
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
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Curated Collections</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            These thematic collections group the artist&apos;s work into specific subjects and visual studies. Explore intimate portraits, traditional lifestyles, and the raw beauty of Nepalese wildlife and landscapes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.article
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/collections/${collection.id}`} className="group">
                <Card className="overflow-hidden h-full transition-all hover:shadow-xl">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10">
                    {collection.cover ? (
                      <img
                        src={collection.cover}
                        alt={collection.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-8">
                          <Image className="h-16 w-16 mx-auto text-primary/30 mb-3" />
                          <span className="text-muted-foreground">Collection Cover</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          #{collection.no}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold">{collection.title}</h3>
                      <p className="text-sm opacity-80 mt-1">{collection.count} artworks</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {collection.blurb || "A curated collection of exceptional artworks."}
                    </p>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                      <span>
                        Explore Collection
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.article>
          ))}

          {collections.length === 0 && (
            <div className="col-span-full text-center py-16">
              <Image className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Collections Yet</h3>
              <p className="text-muted-foreground mb-6">Check back soon for new curated collections.</p>
            </div>
          )}
        </div>

        {/* Featured Collection Highlight */}
        {collections.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Discover More</h2>
              <p className="text-muted-foreground mb-6">
                Each collection represents years of dedicated work and artistic exploration. 
                Dive deeper into the world of Nepalese watercolor artistry.
              </p>
              <Button asChild size="lg">
                <Link href="/gallery">
                  View All Artworks
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
