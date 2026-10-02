import type { Metadata } from "next";
import { HomeView } from "@/views/HomeView";
import { getHomeMetadata } from "@/lib/metadata";

export const metadata: Metadata = getHomeMetadata("fa");

export default function FaHomePage() {
  return <HomeView locale="fa" />;
}
