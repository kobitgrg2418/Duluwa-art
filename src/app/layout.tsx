import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: {
    default: "Duluwa Art Gallery — Watercolours & Sketches by Kobit Gurung",
    template: "%s | Duluwa Art Gallery",
  },
  description: "Original watercolour paintings and sketches by Kobit Gurung — a self-taught artist from Pokhara, Nepal. Portraits, landscapes, wildlife and Himalayan scenes.",
  keywords: ["watercolour", "Nepal art", "Kobit Gurung", "Pokhara", "Himalayan art", "original paintings", "sketches", "wildlife art", "portrait art"],
  authors: [{ name: "Kobit Gurung" }],
  creator: "Kobit Gurung",
  metadataBase: new URL("https://duluwa-art.com"),
  openGraph: {
    title: "Duluwa Art Gallery — Watercolours & Sketches by Kobit Gurung",
    description: "Original watercolour paintings and sketches from Pokhara, Nepal. Browse collections, commission a work, or bring one home.",
    type: "website",
    locale: "en_US",
    siteName: "Duluwa Art Gallery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Duluwa Art Gallery",
    description: "Original watercolour paintings and sketches by Kobit Gurung, Pokhara, Nepal.",
  },
  robots: {
    index: true,
    follow: true,
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
