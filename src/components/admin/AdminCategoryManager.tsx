"use client";

import React, { useState, useEffect } from "react";
import {
  FolderTree,
  PlusCircle,
  Search,
  FileEdit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  FileText,
  X,
  Check,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { generateSlug } from "@/lib/blog/slug";
import { toast } from "sonner";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount: number;
  createdAt: string;
}

export function AdminCategoryManager() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setIsCreateOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || "");
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      setFormSlug(generateSlug(val));
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const isEdit = Boolean(editingCategory);
      const url = isEdit
        ? `/api/blog/categories/${editingCategory!.id}`
        : `/api/blog/categories`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          slug: formSlug.trim() || generateSlug(formName),
          description: formDesc.trim() || null,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to save category");
      }

      toast.success(isEdit ? "Category updated!" : "Category created!");
      setIsCreateOpen(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error saving category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/blog/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to delete category");
      }

      toast.success("Category deleted.");
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative selection:bg-[var(--primary)] selection:text-white">
      {/* Background glow effects */}
      <div className="bg-glow one pointer-events-none opacity-40" />
      <div className="bg-glow two pointer-events-none opacity-30" />

      {/* Top Navbar */}
      <AdminNavbar onRefresh={fetchCategories} isRefreshing={isLoading} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-bright)] tracking-tight">
                Category Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--surface-3)] text-[var(--muted)]">
                {categories.length} total
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">
              Organize articles into core technology topics and domain areas.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:brightness-110 active:scale-[0.98] text-white text-sm font-semibold flex items-center gap-2 shadow-[0_4px_20px_var(--glow)] transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Category</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        {/* Categories Table */}
        <div className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-16 text-center text-sm text-[var(--muted)] flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
              <span>Loading categories...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <FolderTree className="w-12 h-12 text-[var(--muted-2)] mx-auto" />
              <h3 className="font-bold text-[var(--text-bright)] text-base">
                No categories found
              </h3>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                Create categories to classify your technical articles.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]/80 text-[var(--muted)] text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-center">Published Articles</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.map((cat) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-[var(--surface-2)]/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-[var(--text-bright)]">
                        {cat.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[var(--primary-light)] text-xs">
                        /category/{cat.slug}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[var(--muted)] max-w-xs truncate">
                        {cat.description || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--surface-3)] text-[var(--muted)] border border-[var(--border)]">
                          {cat.articleCount} articles
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--primary-light)] transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(cat)}
                            className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create / Edit Category Modal */}
      {(isCreateOpen || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-bright)] text-base flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[var(--primary)]" />
                <span>
                  {editingCategory ? "Edit Category" : "Create New Category"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingCategory(null);
                }}
                className="text-[var(--muted)] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
                  Category Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Frontend Engineering"
                  required
                  className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. frontend-engineering"
                  required
                  className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] font-mono focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Articles focused on React, performance, UI/UX, and web standards..."
                  className="w-full p-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--muted)] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[var(--primary)] hover:brightness-110 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[var(--surface)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-bright)]">
                Delete Category?
              </h3>
            </div>

            {categoryToDelete.articleCount > 0 ? (
              <p className="text-xs text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 leading-relaxed">
                Cannot delete category <strong>&ldquo;{categoryToDelete.name}&rdquo;</strong> because it is currently linked to <strong>{categoryToDelete.articleCount}</strong> published article(s). Please reassign or update those articles first.
              </p>
            ) : (
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Are you sure you want to delete category{" "}
                <strong className="text-[var(--text-bright)]">
                  &ldquo;{categoryToDelete.name}&rdquo;
                </strong>
                ? This action cannot be undone.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] cursor-pointer"
              >
                Close
              </button>
              {categoryToDelete.articleCount === 0 && (
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
