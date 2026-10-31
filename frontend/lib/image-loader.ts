// Maps next/image requests onto the pre-generated files in /public/artworks
// (created by scripts/process-images.ts). `src` is the artwork id.
const SIZES = [480, 960, 1600];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const w = SIZES.find((s) => s >= width) ?? SIZES[SIZES.length - 1];
  return `/artworks/${src}-${w}.webp`;
}
