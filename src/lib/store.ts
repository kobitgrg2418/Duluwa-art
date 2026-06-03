import "server-only";
import { prisma } from "./db";
import type { Artwork, ArtworkStatus, Collection, ProcessStep, SiteMedia, Testimonial } from "./data";

// ── Artworks ──

function toArtwork(a: {
  id: string; title: string; year: string; medium: string; size: string;
  collectionId: string; hue: number; ratio: number; featured: boolean;
  note: string; image: string; video: string; price: number; status: string;
}): Artwork {
  return {
    id: a.id, title: a.title, year: a.year, medium: a.medium, size: a.size,
    coll: a.collectionId, hue: a.hue, ratio: a.ratio, feat: a.featured,
    note: a.note, image: a.image, video: a.video, price: a.price,
    status: a.status as ArtworkStatus,
  };
}

export async function getArtworks(): Promise<Artwork[]> {
  const rows = await prisma.artwork.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toArtwork);
}

export async function saveArtwork(item: Artwork) {
  await prisma.artwork.upsert({
    where: { id: item.id },
    update: {
      title: item.title, year: item.year, medium: item.medium, size: item.size,
      collectionId: item.coll, hue: item.hue, ratio: item.ratio, featured: item.feat,
      note: item.note, image: item.image ?? "", video: item.video ?? "", price: item.price, status: item.status,
    },
    create: {
      id: item.id, title: item.title, year: item.year, medium: item.medium, size: item.size,
      collectionId: item.coll, hue: item.hue, ratio: item.ratio, featured: item.feat,
      note: item.note, image: item.image ?? "", video: item.video ?? "", price: item.price, status: item.status,
    },
  });
}

export async function batchUpdateArtworkStatus(ids: string[], status: ArtworkStatus) {
  await prisma.artwork.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });
}

export async function deleteArtworkById(id: string): Promise<boolean> {
  try {
    await prisma.artwork.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// ── Collections ──

function toCollection(c: {
  id: string; no: string; title: string; count: number; hue: number; blurb: string;
}): Collection {
  return { id: c.id, no: c.no, title: c.title, count: c.count, hue: c.hue, blurb: c.blurb };
}

export async function getCollections(): Promise<Collection[]> {
  const rows = await prisma.collection.findMany({ orderBy: { no: "asc" } });
  return rows.map(toCollection);
}

export async function saveCollection(item: Collection, editId?: string) {
  if (editId) {
    await prisma.collection.update({
      where: { id: editId },
      data: { id: item.id, no: item.no, title: item.title, count: item.count, hue: item.hue, blurb: item.blurb },
    });
  } else {
    await prisma.collection.create({
      data: { id: item.id, no: item.no, title: item.title, count: item.count, hue: item.hue, blurb: item.blurb },
    });
  }
}

export async function deleteCollectionById(id: string): Promise<boolean> {
  try {
    await prisma.collection.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// ── Process Steps ──

function toProcessStep(s: { no: string; title: string; hue: number; text: string }): ProcessStep {
  return { no: s.no, title: s.title, hue: s.hue, text: s.text };
}

export async function getProcess(): Promise<ProcessStep[]> {
  const rows = await prisma.processStep.findMany({ orderBy: { no: "asc" } });
  return rows.map(toProcessStep);
}

export async function saveProcessStep(item: ProcessStep, editNo?: string) {
  if (editNo) {
    await prisma.processStep.update({
      where: { no: editNo },
      data: { no: item.no, title: item.title, hue: item.hue, text: item.text },
    });
  } else {
    await prisma.processStep.create({
      data: { no: item.no, title: item.title, hue: item.hue, text: item.text },
    });
  }
}

export async function deleteProcessStepByNo(no: string): Promise<boolean> {
  try {
    await prisma.processStep.delete({ where: { no } });
    return true;
  } catch {
    return false;
  }
}

// ── Testimonials ──

function toTestimonial(t: { quote: string; who: string; role: string }): Testimonial {
  return { quote: t.quote, who: t.who, role: t.role };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await prisma.testimonial.findMany();
  return rows.map(toTestimonial);
}

export async function getTestimonialIds(): Promise<string[]> {
  const rows = await prisma.testimonial.findMany({ select: { id: true } });
  return rows.map((r) => r.id);
}

export async function saveTestimonial(item: Testimonial, editId?: string) {
  if (editId) {
    await prisma.testimonial.update({
      where: { id: editId },
      data: { quote: item.quote, who: item.who, role: item.role },
    });
  } else {
    await prisma.testimonial.create({
      data: { quote: item.quote, who: item.who, role: item.role },
    });
  }
}

export async function deleteTestimonialById(id: string): Promise<boolean> {
  try {
    await prisma.testimonial.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// ── Site Media ──

export async function getSiteMedia(): Promise<SiteMedia[]> {
  const rows = await prisma.siteMedia.findMany();
  return rows.map((r) => ({ key: r.key, value: r.value, label: r.label }));
}

export async function getSiteMediaValue(key: string): Promise<string> {
  const row = await prisma.siteMedia.findUnique({ where: { key } });
  return row?.value ?? "";
}

export async function saveSiteMedia(item: SiteMedia) {
  await prisma.siteMedia.upsert({
    where: { key: item.key },
    update: { value: item.value, label: item.label },
    create: { key: item.key, value: item.value, label: item.label },
  });
}

export async function deleteSiteMediaByKey(key: string): Promise<boolean> {
  try {
    await prisma.siteMedia.delete({ where: { key } });
    return true;
  } catch {
    return false;
  }
}
