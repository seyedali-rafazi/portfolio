import type { Metadata } from "next";
import { ContactView } from "@/views/ContactView";
import { getContactMetadata } from "@/lib/metadata";

export const metadata: Metadata = getContactMetadata("fa");

export default function FaContactPage() {
  return <ContactView locale="fa" />;
}
