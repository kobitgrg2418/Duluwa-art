import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Duluwa Art — Kobit Gurung, Watercolourist",
  description: "The watercolours of Kobit Gurung — a self-taught painter of Nepal's people, peaks and wild places.",
  openGraph: {
    title: "Duluwa Art — Kobit Gurung, Watercolourist",
    description: "The watercolours of Kobit Gurung — a self-taught painter of Nepal's people, peaks and wild places.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-palette="verdant">
      <body>{children}</body>
    </html>
  );
}
