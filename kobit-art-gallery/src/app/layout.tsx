import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "Duluwa Art — Kobit Gurung, Watercolourist & Sketch Artist",
  description: "The watercolours and sketches of Kobit Gurung — a self-taught painter and sketch artist of Nepal's people, peaks and wild places.",
  openGraph: {
    title: "Duluwa Art — Kobit Gurung, Watercolourist & Sketch Artist",
    description: "The watercolours and sketches of Kobit Gurung — a self-taught painter and sketch artist of Nepal's people, peaks and wild places.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><AuthProvider><CartProvider>{children}</CartProvider></AuthProvider></body>
    </html>
  );
}
