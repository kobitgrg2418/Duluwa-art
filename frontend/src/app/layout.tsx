import type { Metadata } from "next";
import "./globals.css";
import "./template.css";
import "@/revix-styles/revix-clean.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Duluwa Art Gallery - Contemporary Himalayan Art & Exhibitions",
  description: "Discover curated collections of Himalayan artworks, fine portraits, and commission bespoke pieces.",
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
