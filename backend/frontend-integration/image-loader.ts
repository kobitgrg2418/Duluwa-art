// Replace duluwa-art/lib/image-loader.ts when artworks come from the API.
// Pass the artwork's rendition URL base as `src`, e.g. <Image src={a.renditions['1600']} .../>
// The backend already stores 480 / 960 / 1600 px WebP files, so the loader just picks the closest one.
export default function imageLoader({ src, width }: { src: string; width: number }) {
  const size = width <= 480 ? 480 : width <= 960 ? 960 : 1600;
  return src.replace(/-(480|960|1600)\.webp$/, `-${size}.webp`);
}
// Also add the backend host to next.config.mjs images.remotePatterns (or keep loader: 'custom', which needs no allow-list).
