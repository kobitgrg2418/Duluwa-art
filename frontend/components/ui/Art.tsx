import Image from 'next/image';
import clsx from 'clsx';
import type { Artwork } from '@/lib/types';

interface Props {
  a: Artwork;
  sizes: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  alt?: string;
}

/** Every artwork on the site goes through here: next/image, blur-up, reserved aspect ratio. */
export default function Art({ a, sizes, priority, className, fill, alt }: Props) {
  const label = alt ?? `${a.title} — ${a.medium.toLowerCase()}, ${a.widthCm} × ${a.heightCm} cm, by Kobit Gurung`;
  const common = {
    src: a.image,
    alt: label,
    sizes,
    priority,
    placeholder: 'blur' as const,
    blurDataURL: a.blurDataURL,
    className: clsx(a.status === 'sold' && 'sold-img', className),
  };
  return fill ? <Image {...common} fill /> : <Image {...common} width={a.width} height={a.height} />;
}
