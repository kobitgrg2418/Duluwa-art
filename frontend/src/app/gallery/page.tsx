"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Filter, ChevronDown, Grid, List, Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Artwork, Collection } from "@/types";

// Mock data for fallback
const mockCollections: Collection[] = [
  {
    id: "1",
    no: "01",
    title: "Himalaya",
    count: 15,
    hue: 200,
    blurb: "Majestic peaks and serene valleys of the Himalayas",
    cover: "/assets/auth-brushes.png",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  },
  {
    id: "2",
    no: "02", 
    title: "Culture",
    count: 12,
    hue: 150,
    blurb: "Traditional Nepalese culture and customs",
    cover: "/assets/IMG_3838.jpeg",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  }
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
    image: "/assets/IMG_3956_1780590402771.jpeg",
    video: "",
    price: 500,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
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
    image: "/assets/IMG_3838.jpeg",
    video: "",
    price: 750,
    status: "IN_SALE",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
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
    image: "/assets/auth-brushes.png",
    video: "",
    price: 950,
    status: "SOLD_OUT",
    created_at: "2023-01-01",
    updated_at: "2023-01-01"
  }
];

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    collection: "",
    status: "",
    sort: "newest",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Try to fetch from API, fallback to mock data
      const { api } = await import("@/lib/api");
      
      const [artworksResponse, collectionsResponse] = await Promise.all([
        api.get("/artworks/").catch(() => ({ data: mockArtworks })),
        api.get("/collections/").catch(() => ({ data: mockCollections }))
      ]);

      setArtworks(artworksResponse.data.results || artworksResponse.data || mockArtworks);
      setCollections(collectionsResponse.data.results || collectionsResponse.data || mockCollections);
      setPagination(prev => ({
        ...prev,
        total: (artworksResponse.data.results || artworksResponse.data || mockArtworks).length,
        totalPages: Math.ceil((artworksResponse.data.results || artworksResponse.data || mockArtworks).length / 12)
      }));
    } catch (error) {
      console.error("Failed to fetch data, using mock data:", error);
      setArtworks(mockArtworks);
      setCollections(mockCollections);
      setPagination(prev => ({
        ...prev,
        total: mockArtworks.length,
        totalPages: Math.ceil(mockArtworks.length / 12)
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Filter artworks based on current filters
  const filteredArtworks = artworks.filter(artwork => {
    if (filters.collection && artwork.collection_id !== filters.collection) return false;
    if (filters.status && artwork.status !== filters.status) return false;
    if (filters.search && !artwork.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Sort artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (filters.sort) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">The Gallery</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            A comprehensive archive of Kobit Gurung&apos;s original works. From quick, unguarded watercolour sketches caught in the monsoon rain, to sweeping, meticulously detailed Himalayan landscapes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Filters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Collection</label>
                    <Select value={filters.collection} onValueChange={(v) => handleFilterChange("collection", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Collections" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Collections</SelectItem>
                        {collections.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Select value={filters.status} onValueChange={(v) => handleFilterChange("status", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All</SelectItem>
                        <SelectItem value="IN_SALE">Available</SelectItem>
                        <SelectItem value="SOLD_OUT">Sold Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <Select value={filters.sort} onValueChange={(v) => handleFilterChange("sort", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Newest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                        <SelectItem value="title">Title A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setFilters({ collection: "", status: "", sort: "newest", search: "" })}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{sortedArtworks.length} artworks</span>
                <Button 
                  variant={view === "grid" ? "default" : "ghost"} 
                  size="icon" 
                  onClick={() => setView("grid")} 
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={view === "list" ? "default" : "ghost"} 
                  size="icon" 
                  onClick={() => setView("list")} 
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 sm:flex-none">
                <Input
                  placeholder="Search artworks..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </div>

            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedArtworks.map((artwork, index) => (
                  <motion.article
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ArtworkCard artwork={artwork} />
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedArtworks.map((artwork, index) => (
                  <motion.article
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ArtworkListItem artwork={artwork} />
                  </motion.article>
                ))}
              </div>
            )}

            {sortedArtworks.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No artworks found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setFilters({ collection: "", status: "", sort: "newest", search: "" })}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link href={`/gallery/${artwork.id}`} className="group">
      <Card className="overflow-hidden h-full transition-shadow hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {artwork.image ? (
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
              Artwork Preview
            </div>
          )}
          {artwork.status === "SOLD_OUT" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Sold Out
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm" asChild>
              <span><Heart className="h-4 w-4" /></span>
            </Button>
            <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm" asChild>
              <span><Eye className="h-4 w-4" /></span>
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {artwork.collection.no}
            </Badge>
            <span className="text-sm font-medium text-primary">{formatPrice(artwork.price)}</span>
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">{artwork.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{artwork.medium} • {artwork.size}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function ArtworkListItem({ artwork }: { artwork: Artwork }) {
  return (
    <Card className="flex">
      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-muted">
        {artwork.image ? (
          <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 text-xs">
            Preview
          </div>
        )}
        {artwork.status === "SOLD_OUT" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Sold Out</Badge>
          </div>
        )}
      </div>
      <CardContent className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">{artwork.collection.no}</Badge>
            <span className="text-lg font-medium text-primary">{formatPrice(artwork.price)}</span>
          </div>
          <Link href={`/gallery/${artwork.id}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors">{artwork.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">{artwork.medium} • {artwork.size}</p>
          <p className="text-sm text-muted-foreground mt-1">Collection: {artwork.collection.title}</p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/gallery/${artwork.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
