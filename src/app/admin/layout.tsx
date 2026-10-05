import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { RootLayoutBase } from "@/components/layout/RootLayoutBase";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070b12",
};

export const metadata: Metadata = {
  title: "Message Moderation Dashboard | Admin",
  description: "Moderation dashboard for managing and reviewing user contact messages.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutBase locale="en">{children}</RootLayoutBase>;
}
