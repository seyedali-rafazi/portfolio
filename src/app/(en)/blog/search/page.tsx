import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

// Search is now handled by the paginated blog index (server-side query).
export default async function BlogSearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || "").trim();
  redirect(query ? `/blog?q=${encodeURIComponent(query)}` : "/blog");
}
