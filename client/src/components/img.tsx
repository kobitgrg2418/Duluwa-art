import type { CSSProperties, ImgHTMLAttributes } from "react";

// Drop-in replacement for `next/image` so existing `<Image .../>` usage works
// unchanged. Supports the `fill`, `width`, `height`, `sizes`, and `priority`
// props the codebase relies on.
interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height"> {
  src: string;
  alt?: string;
  fill?: boolean;
  width?: number | string;
  height?: number | string;
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
}

export default function Image({
  src,
  alt = "",
  fill,
  width,
  height,
  priority: _priority,
  style,
  ...rest
}: ImageProps) {
  const fillStyle: CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : {};
  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : (width as number | undefined)}
      height={fill ? undefined : (height as number | undefined)}
      style={{ ...fillStyle, ...style }}
      {...rest}
    />
  );
}

export { Image };
