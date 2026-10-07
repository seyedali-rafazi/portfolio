import { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminBlogDashboard } from "@/components/admin/AdminBlogDashboard";

export const metadata: Metadata = {
  title: "Blog CMS Dashboard | Admin",
  description: "Manage portfolio articles, drafts, categories, and publications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBlogPage() {
  return (
    <AdminAuthGuard>
      <AdminBlogDashboard />
    </AdminAuthGuard>
  );
}
