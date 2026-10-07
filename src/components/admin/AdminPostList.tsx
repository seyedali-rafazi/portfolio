"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  FileEdit,
  Eye,
  Trash2,
  Copy,
  Star,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Upload,
  Globe,
  Archive,
  MoreVertical,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { toast } from "sonner";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  readingTime: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string; avatar: string | null } | null;
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export function AdminPostList() {
  const [posts, setPosts] = useState<ArticleItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [featuredFilter, setFeaturedFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal for delete confirmation
  const [postToDelete, setPostToDelete] = useState<ArticleItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Action in progress ID
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/blog/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        status: statusFilter,
        search: debouncedSearch,
      });

      if (categoryFilter) {
        params.append("category", categoryFilter);
      }
      if (featuredFilter) {
        params.append("featured", featuredFilter);
      }

      const res = await fetch(`/api/blog/posts?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      setPosts(data.posts || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.total || 0);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, categoryFilter, featuredFilter, debouncedSearch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Toggle publish / unpublish
  const handleTogglePublish = async (post: ArticleItem) => {
    const isCurrentlyPublished = post.status === "PUBLISHED";
    const endpoint = `/api/blog/posts/${post.id}/${
      isCurrentlyPublished ? "unpublish" : "publish"
    }`;

    setActionLoadingId(post.id);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (!res.ok) throw new Error("Failed to change status");

      toast.success(
        isCurrentlyPublished
          ? `Article "${post.title}" moved to draft.`
          : `Article "${post.title}" published successfully!`
      );
      await fetchPosts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (post: ArticleItem) => {
    setActionLoadingId(post.id);
    try {
      const res = await fetch(`/api/blog/posts/${post.id}/toggle-featured`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to toggle featured status");

      const data = await res.json();
      toast.success(
        data.featured
          ? `Marked "${post.title}" as featured!`
          : `Removed "${post.title}" from featured.`
      );
      await fetchPosts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to toggle featured");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Duplicate post
  const handleDuplicate = async (post: ArticleItem) => {
    setActionLoadingId(post.id);
    try {
      const res = await fetch(`/api/blog/posts/${post.id}/duplicate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to duplicate article");

      toast.success(`Duplicated "${post.title}" as draft!`);
      await fetchPosts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to duplicate post");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blog/posts/${postToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");

      toast.success(`Article "${postToDelete.title}" deleted.`);
      setPostToDelete(null);
      await fetchPosts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative selection:bg-[var(--primary)] selection:text-white">
      {/* Background glow effects */}
      <div className="bg-glow one pointer-events-none opacity-40" />
      <div className="bg-glow two pointer-events-none opacity-30" />

      {/* Top Navbar */}
      <AdminNavbar onRefresh={fetchPosts} isRefreshing={isLoading} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-bright)] tracking-tight">
                Article Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--surface-3)] text-[var(--muted)]">
                {totalCount} total
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">
              Create, review, publish, and manage all your technical blog articles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/blog/posts/new"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:brightness-110 active:scale-[0.98] text-white text-sm font-semibold flex items-center gap-2 shadow-[0_4px_20px_var(--glow)] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Post</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="relative sm:col-span-5">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, excerpt, content..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)] transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Drafts Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)] transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Filter */}
          <div className="sm:col-span-2">
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)] transition-all"
            >
              <option value="">All Posts</option>
              <option value="true">Featured Only</option>
              <option value="false">Standard Only</option>
            </select>
          </div>
        </div>

        {/* Posts Table */}
        <div className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-16 text-center text-sm text-[var(--muted)] flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
              <span>Loading articles...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <FileText className="w-12 h-12 text-[var(--muted-2)] mx-auto" />
              <h3 className="font-bold text-[var(--text-bright)] text-base">
                No articles match your criteria
              </h3>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                Try adjusting your search terms or filters, or create a brand new article.
              </p>
              <Link
                href="/admin/blog/posts/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:brightness-110 transition-all mt-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create New Post</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]/80 text-[var(--muted)] text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4 w-12">Cover</th>
                    <th className="py-3 px-4 min-w-[200px]">Title & Slug</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {posts.map((post) => {
                    const isBusy = actionLoadingId === post.id;
                    return (
                      <tr
                        key={post.id}
                        className="hover:bg-[var(--surface-2)]/40 transition-colors"
                      >
                        {/* Cover Image Thumbnail */}
                        <td className="py-3.5 px-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--surface-3)] flex items-center justify-center shrink-0">
                            {post.coverImage ? (
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileText className="w-5 h-5 text-[var(--muted-2)]" />
                            )}
                          </div>
                        </td>

                        {/* Title and Excerpt */}
                        <td className="py-3.5 px-4 min-w-[200px]">
                          <div className="space-y-0.5">
                            <Link
                              href={`/admin/blog/posts/${post.id}/edit`}
                              className="font-bold text-[var(--text-bright)] hover:text-[var(--primary-light)] transition-colors line-clamp-1"
                            >
                              {post.title}
                            </Link>
                            <p className="text-[11px] font-mono text-[var(--muted-2)] truncate max-w-xs">
                              /{post.slug}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePublish(post)}
                            disabled={isBusy}
                            title={
                              post.status === "PUBLISHED"
                                ? "Click to unpublish"
                                : "Click to publish"
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                              post.status === "PUBLISHED"
                                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                post.status === "PUBLISHED"
                                  ? "bg-emerald-400"
                                  : "bg-amber-400"
                              }`}
                            />
                            <span>{post.status}</span>
                          </button>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {post.categories.length > 0 ? (
                              post.categories.map((c) => (
                                <span
                                  key={c.id}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--surface-3)] text-[var(--muted)]"
                                >
                                  {c.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-[var(--muted-2)]">
                                Uncategorized
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Author */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-xs text-[var(--muted)]">
                            {post.author?.name || "Seyedali"}
                          </span>
                        </td>

                        {/* Dates */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[var(--muted)]">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[11px]">
                              <span className="text-[var(--muted-2)]">Pub:</span>
                              <span>
                                {post.publishedAt
                                  ? new Date(post.publishedAt).toLocaleDateString(
                                      "en-US",
                                      { month: "short", day: "numeric", year: "numeric" }
                                    )
                                  : "—"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-[var(--muted-2)]">
                              <span>Mod:</span>
                              <span>
                                {new Date(post.updatedAt).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Featured */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleFeatured(post)}
                            disabled={isBusy}
                            title={
                              post.featured
                                ? "Featured! Click to remove"
                                : "Click to mark as featured"
                            }
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              post.featured
                                ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
                                : "border-[var(--border)] text-[var(--muted-2)] hover:text-purple-400 hover:border-purple-500/30"
                            }`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                post.featured ? "fill-purple-400" : ""
                              }`}
                            />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Preview */}
                            <Link
                              href={`/admin/blog/posts/${post.id}/preview`}
                              className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-[var(--text-bright)] transition-colors"
                              title="Preview article"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/admin/blog/posts/${post.id}/edit`}
                              className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--primary-light)] hover:text-white transition-colors"
                              title="Edit article"
                            >
                              <FileEdit className="w-3.5 h-3.5" />
                            </Link>

                            {/* Duplicate */}
                            <button
                              onClick={() => handleDuplicate(post)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-[var(--text-bright)] transition-colors cursor-pointer"
                              title="Duplicate as draft"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setPostToDelete(post)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                              title="Delete article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
              <div>
                Page {page} of {totalPages} ({totalCount} total posts)
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[var(--surface)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-bright)]">
                Delete Article?
              </h3>
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[var(--text-bright)]">
                &ldquo;{postToDelete.title}&rdquo;
              </strong>
              ? This action cannot be undone and will remove it from all public listings and search engines.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
