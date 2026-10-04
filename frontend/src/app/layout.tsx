import type { Metadata } from "next";
import "./globals.css";
import "./template.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Duluwa Art Gallery",
  description: "Discover unique artworks and commission custom pieces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
