"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Layers, Edit2, Trash2 } from "lucide-react";
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
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Collection } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const collectionSchema = z.object({
  id: z.string().optional(),
  no: z.string().min(1, "Number is required"),
  title: z.string().min(1, "Title is required"),
  count: z.coerce.number().default(0),
  hue: z.coerce.number().default(0),
  blurb: z.string().optional(),
  cover: z.string().optional(),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [filters, setFilters] = useState({ search: "" });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
  });

  useEffect(() => {
    fetchCollections();
  }, [filters, pagination.page]);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page.toString());
      if (filters.search) params.set("search", filters.search);

      const response = await api.get(`/admin/collections/?${params.toString()}`);
      setCollections(response.data.results || response.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil((response.data.count || response.data.length) / 20),
      }));
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingCollection(null);
    form.reset({ id: "", no: "", title: "", count: 0, hue: 0, blurb: "", cover: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (collection: Collection) => {
    setEditingCollection(collection);
    form.reset({
      id: collection.id,
      no: collection.no,
      title: collection.title,
      count: collection.count,
      hue: collection.hue,
      blurb: collection.blurb,
      cover: collection.cover,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (data: CollectionFormData) => {
    try {
      if (editingCollection) {
        await api.patch(`/admin/collections/${editingCollection.id}/`, data);
        toast.success("Collection updated");
      } else {
        await api.post("/admin/collections/", data);
        toast.success("Collection created");
      }
      setDialogOpen(false);
      fetchCollections();
    } catch (error) {
      toast.error("Failed to save collection");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    try {
      await api.delete(`/admin/collections/${id}/`);
      toast.success("Collection deleted");
      fetchCollections();
    } catch {
      toast.error("Failed to delete collection");
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Manage artwork collections</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Collection
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collection</TableHead>
              <TableHead>Artworks</TableHead>
              <TableHead>Hue</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.map((collection) => (
              <TableRow key={collection.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                      #{collection.no}
                    </div>
                    <div>
                      <p className="font-medium">{collection.title}</p>
                      <p className="text-sm text-muted-foreground">{collection.blurb?.slice(0, 50)}...</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{collection.artwork_count || collection.count}</TableCell>
                <TableCell>
                  <div className="w-6 h-6 rounded border" style={{ backgroundColor: `hsl(${collection.hue}, 70%, 50%)` }} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(collection)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(collection.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {collections.length === 0 && (
          <TableCaption className="py-8 text-center">No collections found</TableCaption>
        )}
      </Card>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCollection ? "Edit Collection" : "New Collection"}</DialogTitle>
            <DialogDescription>
              {editingCollection ? "Update the collection details" : "Add a new collection"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-4">
            <div>
              <Label htmlFor="no">Number *</Label>
              <Input id="no" {...form.register("no")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...form.register("title")} className="mt-1" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="count">Artwork Count</Label>
                <Input id="count" type="number" {...form.register("count")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="hue">Hue</Label>
                <Input id="hue" type="number" {...form.register("hue")} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="blurb">Description</Label>
              <textarea id="blurb" rows={3} {...form.register("blurb")} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <Label htmlFor="cover">Cover Image URL</Label>
              <Input id="cover" {...form.register("cover")} className="mt-1" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : editingCollection ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}