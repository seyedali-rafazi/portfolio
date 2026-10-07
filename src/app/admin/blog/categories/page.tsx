import { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminCategoryManager } from "@/components/admin/AdminCategoryManager";

export const metadata: Metadata = {
  title: "Category Management | Admin Blog",
  description: "Manage technical blog categories and taxonomy.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminCategoriesPage() {
  return (
    <AdminAuthGuard>
      <AdminCategoryManager />
    </AdminAuthGuard>
  );
}
