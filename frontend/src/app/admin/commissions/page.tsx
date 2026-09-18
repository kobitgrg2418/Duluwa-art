"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileText, MoreVertical, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Pagination } from "@/components/ui/pagination";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<any | null>(null);
  const [filters, setFilters] = useState({ status: "", type: "", search: "" });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchCommissions();
  }, [filters, pagination.page]);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page.toString());
      if (filters.status) params.set("status", filters.status);
      if (filters.type) params.set("type", filters.type);
      if (filters.search) params.set("search", filters.search);

      const response = await api.get(`/admin/commissions/?${params.toString()}`);
      setCommissions(response.data.results || response.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil((response.data.count || response.data.length) / 20),
      }));
    } catch (error) {
      console.error("Failed to fetch commissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/admin/commissions/${id}/`, { status: newStatus });
      toast.success("Commission status updated");
      fetchCommissions();
      setDialogOpen(false);
    } catch {
      toast.error("Failed to update commission status");
    }
  };

  const openDetailDialog = (commission: any) => {
    setSelectedCommission(commission);
    setDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new": return "outline";
      case "contacted": return "secondary";
      case "quoted": return "default";
      case "accepted": return "default";
      case "declined": return "destructive";
      case "completed": return "default";
      default: return "outline";
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
          <p className="text-muted-foreground">Manage commission inquiries</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search commissions..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
                className="pl-10"
              />
            </div>
            <Select value={filters.status} onValueChange={(v) => setFilters((prev) => ({ ...prev, status: v, page: 1 }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Inquiry</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell className="font-mono text-sm">{commission.id.slice(0, 12)}...</TableCell>
                <TableCell>
                  <p className="font-medium">{commission.name}</p>
                  <p className="text-sm text-muted-foreground">{commission.email}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{commission.type}</Badge>
                </TableCell>
                <TableCell>{formatDate(commission.created_at)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(commission.status)}>
                    {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openDetailDialog(commission)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      <Dialog open={dialogOpen && !!selectedCommission} onOpenChange={(open) => { if (!open) setSelectedCommission(null); setDialogOpen(open); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commission Details</DialogTitle>
            <DialogDescription>Review and update commission inquiry</DialogDescription>
          </DialogHeader>
          {selectedCommission && (
            <div className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Client</h4>
                  <p>{selectedCommission.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCommission.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedCommission.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Project Details</h4>
                  <p>Type: <span className="font-medium capitalize">{selectedCommission.type}</span></p>
                  <p>Size: <span className="font-medium">{selectedCommission.size}</span></p>
                  <p>Medium: <span className="font-medium">{selectedCommission.medium}</span></p>
                  <p>Budget: <span className="font-medium">{selectedCommission.budget}</span></p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Message</h4>
                <p className="text-muted-foreground whitespace-pre-line">{selectedCommission.message}</p>
              </div>

              {selectedCommission.ref_image && (
                <div>
                  <h4 className="font-medium mb-3">Reference Image</h4>
                  <img src={selectedCommission.ref_image} alt="Reference" className="max-w-full h-auto rounded-lg" />
                </div>
              )}

              <div>
                <h4 className="font-medium mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {["new", "contacted", "quoted", "accepted", "declined", "completed"].map((status) => (
                    <Button
                      key={status}
                      variant={selectedCommission.status === status ? "default" : "outline"}
                      onClick={() => handleStatusChange(selectedCommission.id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}