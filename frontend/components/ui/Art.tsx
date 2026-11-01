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
  const hasBlur = a.blurDataURL && a.blurDataURL.length > 0;
  const common = {
    src: a.image,
    alt: label,
    sizes,
    priority,
    placeholder: hasBlur ? ('blur' as const) : undefined,
    blurDataURL: hasBlur ? a.blurDataURL : undefined,
    className: clsx(a.status === 'sold' && 'sold-img', className),
  };
  return fill ? <Image {...common} fill /> : <Image {...common} width={a.width} height={a.height} />;
}
