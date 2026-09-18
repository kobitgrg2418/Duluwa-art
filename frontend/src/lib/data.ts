import { api } from "./api";
import type { Artwork, Collection, ProcessStep, Testimonial, CommissionTier, SiteMedia } from "@/types";

export async function getArtworks(): Promise<Artwork[]> {
  const res = await api.get("/artworks");
  return res.data.results || res.data;
}

export async function getCollections(): Promise<Collection[]> {
  const res = await api.get("/collections");
  return res.data.results || res.data;
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  const res = await api.get("/artworks?featured=true");
  return res.data.results || res.data;
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  const res = await api.get("/process");
  return res.data.results || res.data;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await api.get("/testimonials");
  return res.data.results || res.data;
}

export async function getCommissionPricing(): Promise<CommissionTier[]> {
  const res = await api.get("/commission-pricing");
  return res.data.tiers || [];
}

export async function getSiteMedia(): Promise<SiteMedia[]> {
  const res = await api.get("/site-media");
  return res.data.results || res.data;
}

export async function getArtwork(id: string): Promise<Artwork> {
  const res = await api.get(`/artworks/${id}`);
  return res.data;
}

export async function getCollection(id: string): Promise<Collection> {
  const res = await api.get(`/collections/${id}`);
  return res.data;
}