import type { Metadata } from "next";
import "../template.css";

export const metadata: Metadata = {
  title: "Collections - Duluwa Art Gallery",
  description: "Browse our curated art collections",
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
