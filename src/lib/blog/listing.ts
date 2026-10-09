import { prisma } from "@/lib/prisma";

export const PAGE_SIZE_OPTIONS = [6, 9, 12, 24] as const;
export const DEFAULT_PAGE_SIZE = 9;

export interface BlogListingParams {
  page?: string;
  pageSize?: string;
  q?: string;
}

export function parseListingParams(params: BlogListingParams) {
  const rawPage = parseInt(params.page || "1", 10);
  const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
  const rawSize = parseInt(params.pageSize || "", 10);
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawSize)
    ? rawSize
    : DEFAULT_PAGE_SIZE;
  const q = (params.q || "").trim().slice(0, 100);
  return { page, pageSize, q };
}

const articleInclude = {
  author: { select: { name: true, avatar: true } },
  categories: { select: { id: true, name: true, slug: true } },
  tags: { select: { id: true, name: true, slug: true } },
} as const;

/**
 * Fetches a page of published articles. Searching, pagination and page size
 * are all resolved in the database query.
 */
export async function getBlogListing(params: BlogListingParams) {
  const { page, pageSize, q } = parseListingParams(params);
  const isSearching = q.length > 0;

  // Featured spotlight only on the first page of the unfiltered feed
  const featuredArticle =
    page === 1 && !isSearching
      ? await prisma.article.findFirst({
          where: { status: "PUBLISHED", featured: true },
          orderBy: { publishedAt: "desc" },
          include: articleInclude,
        })
      : null;

  const where: any = {
    status: "PUBLISHED",
    ...(featuredArticle ? { id: { not: featuredArticle.id } } : {}),
    ...(isSearching
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [articles, totalCount, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: articleInclude,
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { articles: { where: { status: "PUBLISHED" } } } },
      },
    }),
  ]);

  return {
    articles,
    featuredArticle,
    categories,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    page,
    pageSize,
    q,
  };
}

/** Static shell data for the blog index: featured spotlight + categories. */
export async function getBlogShell() {
  const [featuredArticle, categories] = await Promise.all([
    prisma.article.findFirst({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { publishedAt: "desc" },
      include: articleInclude,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { articles: { where: { status: "PUBLISHED" } } } },
      },
    }),
  ]);
  return { featuredArticle, categories };
}
