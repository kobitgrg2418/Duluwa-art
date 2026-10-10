import type { Metadata } from "next";
import "../template.css";

export const metadata: Metadata = {
  title: "Commission - Duluwa Art Gallery",
  description: "Commission custom artwork from talented artists",
};

export default function CommissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
