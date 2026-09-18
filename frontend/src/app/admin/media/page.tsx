"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Image, MoreVertical, Edit2, Trash2, Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const mediaSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().optional(),
  label: z.string().optional(),
});

type MediaFormData = z.infer<typeof mediaSchema>;

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await api.get("/site-media/");
      setMedia(response.data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingMedia(null);
    form.reset({ key: "", value: "", label: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    setEditingMedia(item);
    form.reset({ key: item.key, value: item.value, label: item.label });
    setDialogOpen(true);
  };

  const handleSubmit = async (data: MediaFormData) => {
    try {
      if (editingMedia) {
        await api.patch(`/site-media/${editingMedia.key}/`, data);
        toast.success("Media updated");
      } else {
        await api.post("/site-media/", data);
        toast.success("Media created");
      }
      setDialogOpen(false);
      fetchMedia();
    } catch (error) {
      toast.error("Failed to save media");
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;
    try {
      await api.delete(`/site-media/${key}/`);
      toast.success("Media deleted");
      fetchMedia();
    } catch {
      toast.error("Failed to delete media");
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const response = await api.post("/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setValue("value", response.data.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage site media and images</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Media
          </Button>
          <Button variant="outline" onClick={() => document.getElementById("media-upload")?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <input
            id="media-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            disabled={uploading}
          />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {media.map((item) => (
              <TableRow key={item.key}>
                <TableCell>
                  {item.value && item.value.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img src={item.value} alt={item.key} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <Image className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm">{item.key}</TableCell>
                <TableCell>{item.label || "-"}</TableCell>
                <TableCell className="max-w-xs truncate font-mono text-sm">{item.value}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.key)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {media.length === 0 && (
          <TableCaption className="py-8 text-center">No media items found</TableCaption>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMedia ? "Edit Media" : "New Media"}</DialogTitle>
            <DialogDescription>
              {editingMedia ? "Update the media item" : "Add a new media item"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-4">
            <div>
              <Label htmlFor="key">Key *</Label>
              <Input id="key" {...form.register("key")} className="mt-1" disabled={!!editingMedia} />
            </div>
            <div>
              <Label htmlFor="label">Label</Label>
              <Input id="label" {...form.register("label")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="value">Value (URL or path) *</Label>
              <Input id="value" {...form.register("value")} className="mt-1" />
              <Button variant="outline" type="button" className="mt-2" onClick={() => document.getElementById("media-value-upload")?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <input
                id="media-value-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                disabled={uploading}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || uploading}>
                {uploading ? "Uploading..." : form.formState.isSubmitting ? "Saving..." : editingMedia ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}