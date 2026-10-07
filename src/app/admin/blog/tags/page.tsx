import { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminTagManager } from "@/components/admin/AdminTagManager";

export const metadata: Metadata = {
  title: "Tag Management | Admin Blog",
  description: "Manage technical tags and taxonomies.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminTagsPage() {
  return (
    <AdminAuthGuard>
      <AdminTagManager />
    </AdminAuthGuard>
  );
}
