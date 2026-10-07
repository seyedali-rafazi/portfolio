import { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { PostEditor } from "@/components/admin/editor/PostEditor";

export const metadata: Metadata = {
  title: "Create New Post | Admin Blog",
  description: "Compose a new technical blog post.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewPostPage() {
  return (
    <AdminAuthGuard>
      <PostEditor />
    </AdminAuthGuard>
  );
}
