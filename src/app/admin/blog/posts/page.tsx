import { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminPostList } from "@/components/admin/AdminPostList";

export const metadata: Metadata = {
  title: "Article Management | Admin Blog",
  description: "Manage portfolio articles, drafts, and technical posts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPostsPage() {
  return (
    <AdminAuthGuard>
      <AdminPostList />
    </AdminAuthGuard>
  );
}
