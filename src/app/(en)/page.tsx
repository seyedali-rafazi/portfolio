import type { Metadata } from "next";
import { HomeView } from "@/views/HomeView";
import { getHomeMetadata } from "@/lib/metadata";

export const metadata: Metadata = getHomeMetadata("en");

export default function HomePage() {
  return <HomeView locale="en" />;
}
