import { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { PostEditor } from "@/components/admin/editor/PostEditor";

export const metadata: Metadata = {
  title: "Edit Article | Admin Blog",
  description: "Edit technical blog post.",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPageProps) {
  const { id } = await params;

  return (
    <AdminAuthGuard>
      <PostEditor initialId={id} />
    </AdminAuthGuard>
  );
}
