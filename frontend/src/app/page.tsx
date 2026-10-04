import { Metadata } from "next";
import TemplatePage from "./template-page";

export const metadata: Metadata = {
  title: "Duluwa Art Gallery - Discover Unique Artworks",
  description: "Explore curated collections of exceptional artworks. Commission custom pieces from talented artists.",
};

export default function HomePage() {
  return <TemplatePage />;
}
