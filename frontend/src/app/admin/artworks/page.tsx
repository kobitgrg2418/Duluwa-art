"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { formatPrice } from "@/lib/utils";
import { Artwork, Collection } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const artworkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  year: z.string().min(1, "Year is required"),
  medium: z.string().min(1, "Medium is required"),
  size: z.string().optional(),
  collection_id: z.string().min(1, "Collection is required"),
  hue: z.coerce.number().default(0),
  ratio: z.coerce.number().default(1),
  featured: z.boolean().default(false),
  note: z.string().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  price: z.coerce.number().default(0),
  status: z.enum(["IN_SALE", "SOLD_OUT"]).default("IN_SALE"),
});

type ArtworkFormData = z.infer<typeof artworkSchema>;

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [filters, setFilters] = useState({ collection: "", status: "", search: "" });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkSchema),
  });

  useEffect(() => {
    fetchArtworks();
    fetchCollections();
  }, [filters, pagination.page]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page.toString());
      if (filters.collection) params.set("collection", filters.collection);
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);

      const response = await api.get(`/admin/artworks/?${params.toString()}`);
      setArtworks(response.data.results || response.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil((response.data.count || response.data.length) / 20),
      }));
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await api.get("/collections/");
      setCollections(response.data.results || response.data);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };

  const openCreateDialog = () => {
    setEditingArtwork(null);
    form.reset({
      title: "",
      year: new Date().getFullYear().toString(),
      medium: "",
      size: "",
      collection_id: "",
      hue: 0,
      ratio: 1,
      featured: false,
      note: "",
      image: "",
      video: "",
      price: 0,
      status: "IN_SALE",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    form.reset({
      id: artwork.id,
      title: artwork.title,
      year: artwork.year,
      medium: artwork.medium,
      size: artwork.size,
      collection_id: artwork.collection_id,
      hue: artwork.hue,
      ratio: artwork.ratio,
      featured: artwork.featured,
      note: artwork.note,
      image: artwork.image,
      video: artwork.video,
      price: artwork.price,
      status: artwork.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (data: ArtworkFormData) => {
    try {
      if (editingArtwork) {
        await api.put(`/admin/artworks/${editingArtwork.id}/`, data);
        toast.success("Artwork updated");
      } else {
        await api.post("/admin/artworks/", data);
        toast.success("Artwork created");
      }
      setDialogOpen(false);
      fetchArtworks();
    } catch (error) {
      toast.error("Failed to save artwork");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    try {
      await api.delete(`/admin/artworks/${id}/`);
      toast.success("Artwork deleted");
      fetchArtworks();
    } catch {
      toast.error("Failed to delete artwork");
    }
  };

  const handleBulkStatusChange = async (newStatus: "IN_SALE" | "SOLD_OUT") => {
    if (selectedArtworks.length === 0) {
      toast.error("No artworks selected");
      return;
    }
    try {
      await api.post("/admin/artworks/batch_status/", {
        ids: selectedArtworks,
        status: newStatus,
      });
      toast.success(`${selectedArtworks.length} artworks updated`);
      setSelectedArtworks([]);
      fetchArtworks();
    } catch {
      toast.error("Failed to update artworks");
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.postForm("/admin/upload/", formData);
      const imageUrl = response.data.url;
      form.setValue("image", imageUrl);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const toggleSelectArtwork = (id: string) => {
    setSelectedArtworks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedArtworks.length === artworks.length) {
      setSelectedArtworks([]);
    } else {
      setSelectedArtworks(artworks.map((a) => a.id));
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artworks</h1>
          <p className="text-muted-foreground">Manage your artwork catalog</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Artwork
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artworks..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
                  className="pl-10"
                />
              </div>
              <Select value={filters.collection} onValueChange={(v) => setFilters((prev) => ({ ...prev, collection: v, page: 1 }))}>
                <SelectTrigger className="w-[200px]">
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
              <Select value={filters.status} onValueChange={(v) => setFilters((prev) => ({ ...prev, status: v, page: 1 }))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="IN_SALE">In Sale</SelectItem>
                  <SelectItem value="SOLD_OUT">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedArtworks.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedArtworks.length} selected
                </span>
                <div className="flex gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusChange("IN_SALE")}
                  >
                    Mark In Sale
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusChange("SOLD_OUT")}
                  >
                    Mark Sold Out
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedArtworks([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedArtworks.length === artworks.length && artworks.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Artwork</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artworks.map((artwork) => (
              <TableRow key={artwork.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedArtworks.includes(artwork.id)}
                    onChange={() => toggleSelectArtwork(artwork.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                      {artwork.image ? (
                        <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{artwork.title}</p>
                      <p className="text-sm text-muted-foreground">{artwork.medium} • {artwork.year}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {artwork.collection.no}
                  </Badge>
                  <span className="ml-2 text-sm">{artwork.collection.title}</span>
                </TableCell>
                <TableCell className="font-medium text-primary">{formatPrice(artwork.price)}</TableCell>
                <TableCell>
                  <Badge variant={artwork.status === "IN_SALE" ? "default" : "destructive"}>
                    {artwork.status === "IN_SALE" ? "In Sale" : "Sold Out"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {artwork.featured && (
                    <Badge variant="default" className="text-xs">Featured</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(artwork)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(artwork.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {artworks.length === 0 && (
          <TableCaption className="py-8 text-center">No artworks found</TableCaption>
        )}
      </Card>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArtwork ? "Edit Artwork" : "New Artwork"}</DialogTitle>
            <DialogDescription>
              {editingArtwork ? "Update the artwork details" : "Add a new artwork to the catalog"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...form.register("title")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input id="year" {...form.register("year")} className="mt-1" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medium">Medium *</Label>
                <Input id="medium" {...form.register("medium")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="size">Size</Label>
                <Input id="size" {...form.register("size")} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="collection_id">Collection *</Label>
              <Select
                onValueChange={(value) => form.setValue("collection_id", value)}
                defaultValue={form.getValues("collection_id")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" {...form.register("price")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="hue">Hue</Label>
                <Input id="hue" type="number" {...form.register("hue")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ratio">Ratio</Label>
                <Input id="ratio" type="number" step="0.01" {...form.register("ratio")} className="mt-1" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => form.setValue("status", value as "IN_SALE" | "SOLD_OUT")}
                  defaultValue={form.getValues("status")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_SALE">In Sale</SelectItem>
                    <SelectItem value="SOLD_OUT">Sold Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...form.register("featured")} className="h-4 w-4" />
                  Featured
                </Label>
              </div>
            </div>
            <div>
              <Label htmlFor="note">Note</Label>
              <textarea id="note" rows={3} {...form.register("note")} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <div className="mt-1 flex gap-2">
                <Input id="image" {...form.register("image")} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </div>
              {form.watch("image") && (
                <div className="mt-2">
                  <img
                    src={form.watch("image")}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="video">Video URL</Label>
              <Input id="video" {...form.register("video")} className="mt-1" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : editingArtwork ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}