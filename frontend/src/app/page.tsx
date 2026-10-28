import { Metadata } from "next";
import RevixHome from "@/components/revix-home";

export const metadata: Metadata = {
  title: "Duluwa Art Gallery - Contemporary Himalayan Art & Exhibitions",
  description: "Explore curated collections of exceptional Himalayan artworks, fine watercolour pieces, and bespoke commissions.",
};

export default function HomePage() {
  return <RevixHome />;
}
