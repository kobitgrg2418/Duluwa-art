// Maps next/image requests onto the pre-generated image URLs.
// `src` can be:
// 1. A full rendition URL from the API (e.g., http://localhost:8000/media/artworks/xxx-1600.webp)
// 2. A local path (e.g., /artworks/xxx-1600.webp)
// This loader swaps the size suffix based on requested width.
const SIZES = [480, 960, 1600];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const w = SIZES.find((s) => s >= width) ?? SIZES[SIZES.length - 1];
  
  // If it's a local path, just swap the size suffix
  if (src.startsWith('/artworks/')) {
    return src.replace(/-(480|960|1600)\.webp$/, `-${w}.webp`);
  }
  
  // If it's a remote URL, extract the slug and construct a local path
  // Format: http://localhost:8000/media/artworks/slug-1600.webp
  const match = src.match(/\/([^/]+)-(480|960|1600)\.webp$/);
  if (match) {
    const slug = match[1];
    return `/artworks/${slug}-${w}.webp`;
  }
  
  // Fallback: return the original src with size suffix swapped
  return src.replace(/-(480|960|1600)\.webp$/, `-${w}.webp`);
}
