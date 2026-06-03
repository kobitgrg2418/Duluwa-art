import "server-only";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import type { Artwork, Collection, ProcessStep, Testimonial } from "./data";
import {
  ARTWORKS as DEFAULT_ARTWORKS,
  COLLECTIONS as DEFAULT_COLLECTIONS,
  PROCESS as DEFAULT_PROCESS,
  TESTIMONIALS as DEFAULT_TESTIMONIALS,
} from "./data";

const DIR = process.cwd();

async function loadJSON<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(join(DIR, file), "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function saveJSON(file: string, data: unknown) {
  await writeFile(join(DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

export async function getArtworks(): Promise<Artwork[]> {
  return loadJSON("data-artworks.json", DEFAULT_ARTWORKS);
}

export async function saveArtworks(items: Artwork[]) {
  await saveJSON("data-artworks.json", items);
}

export async function getCollections(): Promise<Collection[]> {
  return loadJSON("data-collections.json", DEFAULT_COLLECTIONS);
}

export async function saveCollections(items: Collection[]) {
  await saveJSON("data-collections.json", items);
}

export async function getProcess(): Promise<ProcessStep[]> {
  return loadJSON("data-process.json", DEFAULT_PROCESS);
}

export async function saveProcess(items: ProcessStep[]) {
  await saveJSON("data-process.json", items);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return loadJSON("data-testimonials.json", DEFAULT_TESTIMONIALS);
}

export async function saveTestimonials(items: Testimonial[]) {
  await saveJSON("data-testimonials.json", items);
}
