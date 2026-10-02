import type { Metadata } from "next";
import { ContactView } from "@/views/ContactView";
import { getContactMetadata } from "@/lib/metadata";

export const metadata: Metadata = getContactMetadata("en");

export default function ContactPage() {
  return <ContactView locale="en" />;
}
