import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { RootLayoutBase } from "@/components/layout/RootLayoutBase";
import { getRootMetadata } from "@/lib/metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070b12",
};

export const metadata: Metadata = getRootMetadata("en");

export default function EnRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutBase locale="en">{children}</RootLayoutBase>;
}
