import { Router } from "express";
import {
  getArtworks,
  getCollections,
  getProcess,
  getTestimonials,
  getSiteMedia,
  getCommissionPricing,
} from "../lib/store";

const router = Router();

// Public, read-only content powering the public site.

router.get("/artworks", async (_req, res) => {
  res.json(await getArtworks());
});

router.get("/collections", async (_req, res) => {
  res.json(await getCollections());
});

router.get("/process", async (_req, res) => {
  res.json(await getProcess());
});

router.get("/testimonials", async (_req, res) => {
  res.json(await getTestimonials());
});

router.get("/site-media", async (_req, res) => {
  res.json(await getSiteMedia());
});

router.get("/commission-pricing", async (_req, res) => {
  res.json(await getCommissionPricing());
});

export default router;
