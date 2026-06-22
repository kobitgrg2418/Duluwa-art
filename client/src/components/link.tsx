import { Link as RouterLink } from "react-router-dom";
import type { ComponentProps, ReactNode, CSSProperties } from "react";

// Drop-in replacement for `next/link` so existing `<Link href="...">` usage
// works unchanged on top of react-router. Internal hrefs (including hash links
// like "/#featured") go through react-router; external/protocol hrefs fall back
// to a plain anchor.
type AnchorProps = Omit<ComponentProps<"a">, "href">;

interface LinkProps extends AnchorProps {
  href: string;
  children?: ReactNode;
  style?: CSSProperties;
}

function isExternal(href: string) {
  return /^([a-z]+:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

export default function Link({ href, children, ...rest }: LinkProps) {
  if (isExternal(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink to={href} {...rest}>
      {children}
    </RouterLink>
  );
}
