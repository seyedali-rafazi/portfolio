"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  Send,
  Eye,
  ArrowLeft,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  FileCode,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Sparkles,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Star,
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { renderMarkdownToHtml } from "@/lib/blog/markdown";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { generateSlug } from "@/lib/blog/slug";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  name: string;
}

interface PostEditorProps {
  initialId?: string;
}

export function PostEditor({ initialId }: PostEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialId);

  // Form state
  const [postId, setPostId] = useState<string | null>(initialId || null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [featured, setFeatured] = useState(false);
  const [authorId, setAuthorId] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // SEO fields
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [showSeoSettings, setShowSeoSettings] = useState(false);

  // Metadata options from DB
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved"
  );
  const [viewMode, setViewMode] = useState<"edit" | "split" | "preview">(
    "split"
  );
  const [selectedCodeLang, setSelectedCodeLang] = useState("typescript");
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Preview HTML
  const [previewHtml, setPreviewHtml] = useState("");

  // Dirty state tracking for draft warning
  const isDirtyRef = useRef(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Warn before leaving if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Update preview when content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewHtml(renderMarkdownToHtml(content));
    }, 250);
    return () => clearTimeout(timer);
  }, [content]);

  // Load initial post if editing, plus categories, tags, authors
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [catRes, tagRes, authRes] = await Promise.all([
          fetch("/api/blog/categories"),
          fetch("/api/blog/tags"),
          fetch("/api/blog/authors"),
        ]);

        if (catRes.ok) {
          const d = await catRes.json();
          setCategories(d.categories || []);
        }
        if (tagRes.ok) {
          const d = await tagRes.json();
          setTags(d.tags || []);
        }
        if (authRes.ok) {
          const d = await authRes.json();
          setAuthors(d.authors || []);
          if (d.authors?.[0] && !authorId) {
            setAuthorId(d.authors[0].id);
          }
        }

        if (initialId) {
          const postRes = await fetch(`/api/blog/posts/${initialId}`);
          if (!postRes.ok) {
            throw new Error("Failed to load article");
          }
          const data = await postRes.json();
          const p = data.post;
          setTitle(p.title || "");
          setSlug(p.slug || "");
          setSlugManuallyEdited(true);
          setExcerpt(p.excerpt || "");
          setContent(p.content || "");
          setCoverImage(p.coverImage || "");
          setStatus(p.status || "DRAFT");
          setFeatured(Boolean(p.featured));
          setAuthorId(p.authorId || "");
          setSelectedCategoryIds(p.categories?.map((c: any) => c.id) || []);
          setSelectedTagIds(p.tags?.map((t: any) => t.id) || []);
          setSeoTitle(p.seoTitle || "");
          setSeoDescription(p.seoDescription || "");
          setCanonicalUrl(p.canonicalUrl || "");
          isDirtyRef.current = false;
          setSaveStatus("saved");
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to load post data");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [initialId]);

  // Title change: auto generate slug if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    isDirtyRef.current = true;
    setSaveStatus("unsaved");
    if (!slugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setSlugManuallyEdited(true);
    isDirtyRef.current = true;
    setSaveStatus("unsaved");
  };

  // Content change
  const handleContentChange = (val: string) => {
    setContent(val);
    isDirtyRef.current = true;
    setSaveStatus("unsaved");
  };

  // Tag helper
  const handleAddTag = async (e?: React.KeyboardEvent) => {
    if (e && e.key !== "Enter") return;
    if (e) e.preventDefault();

    const clean = tagInput.trim();
    if (!clean) return;

    // Check if tag already exists in list
    const existing = tags.find(
      (t) => t.name.toLowerCase() === clean.toLowerCase()
    );
    if (existing) {
      if (!selectedTagIds.includes(existing.id)) {
        setSelectedTagIds((prev) => [...prev, existing.id]);
      }
      setTagInput("");
      return;
    }

    // Create new tag via API
    try {
      const res = await fetch("/api/blog/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clean }),
      });
      if (res.ok) {
        const data = await res.json();
        setTags((prev) => [...prev, data.tag]);
        setSelectedTagIds((prev) => [...prev, data.tag.id]);
        setTagInput("");
        toast.success(`Created new tag "${clean}"`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
    isDirtyRef.current = true;
    setSaveStatus("unsaved");
  };

  // Category toggle
  const handleCategoryToggle = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
    isDirtyRef.current = true;
    setSaveStatus("unsaved");
  };

  // Cover image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/blog/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Upload failed");
      }

      const data = await res.json();
      if (isCover) {
        setCoverImage(data.url);
        toast.success("Cover image uploaded!");
      } else {
        insertMarkdownAtCursor(`\n![${file.name}](${data.url})\n`);
        toast.success("Image inserted into article!");
      }
      isDirtyRef.current = true;
      setSaveStatus("unsaved");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  // Text formatting insertion helper
  const insertMarkdownAtCursor = (
    prefix: string,
    suffix: string = "",
    defaultPlaceholder: string = ""
  ) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let selected = content.substring(start, end);

    // If applying bold formatting to a selection that already starts with heading hashes (e.g. "# Heading"):
    // keep the heading tag outside the bold asterisks: "# **Heading**"
    if (prefix === "**" && suffix === "**" && selected) {
      const headingMatch = selected.match(/^(#{1,6}\s+)(.*)$/);
      if (headingMatch) {
        const hPrefix = headingMatch[1];
        const hText = headingMatch[2] || defaultPlaceholder;
        const replacement = `${hPrefix}**${hText}**`;
        const newContent =
          content.substring(0, start) + replacement + content.substring(end);
        setContent(newContent);
        isDirtyRef.current = true;
        setSaveStatus("unsaved");
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + hPrefix.length + 2,
            start + hPrefix.length + 2 + hText.length
          );
        }, 50);
        return;
      }
    }

    if (!selected) {
      selected = defaultPlaceholder;
    }

    const replacement = `${prefix}${selected}${suffix}`;
    const newContent =
      content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);
    isDirtyRef.current = true;
    setSaveStatus("unsaved");

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 50);
  };

  // Code block insertion
  const handleInsertCodeBlock = (lang: string) => {
    const sample = `// Write ${lang} code here\n`;
    insertMarkdownAtCursor(`\n\`\`\`${lang}\n`, `\n\`\`\`\n`, sample);
    setShowCodeModal(false);
  };

  // Table insertion
  const handleInsertTable = () => {
    const tableTemplate = `\n| Header 1 | Header 2 | Header 3 |\n| :--- | :---: | ---: |\n| Cell 1 | Cell 2 | Cell 3 |\n| Value A | Value B | Value C |\n\n`;
    insertMarkdownAtCursor(tableTemplate);
  };

  // Core save function
  const savePost = async (publishImmediate = false): Promise<string | null> => {
    if (!title.trim()) {
      toast.error("Please enter an article title.");
      return null;
    }

    const currentSlug = slug.trim() || generateSlug(title);
    const targetStatus = publishImmediate ? "PUBLISHED" : status;

    setIsSaving(true);
    setSaveStatus("saving");

    const payload = {
      title: title.trim(),
      slug: currentSlug,
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim() || "Write article content here...",
      coverImage: coverImage.trim() || null,
      status: targetStatus,
      featured,
      authorId: authorId || undefined,
      categoryIds: selectedCategoryIds,
      tagIds: selectedTagIds,
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDescription.trim() || null,
      canonicalUrl: canonicalUrl.trim() || null,
    };

    try {
      const isPatch = Boolean(postId);
      const url = isPatch ? `/api/blog/posts/${postId}` : `/api/blog/posts`;
      const method = isPatch ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(
          errJson.error ||
            (errJson.issues ? "Validation failed" : "Failed to save post")
        );
      }

      const data = await res.json();
      const savedPost = data.post;

      setPostId(savedPost.id);
      setStatus(savedPost.status);
      setSlug(savedPost.slug);
      isDirtyRef.current = false;
      setSaveStatus("saved");

      toast.success(
        publishImmediate
          ? "Article published successfully!"
          : isPatch
          ? "Draft changes saved!"
          : "Draft created successfully!"
      );

      // If we just created the post, update URL without full reload
      if (!isEditing && savedPost.id) {
        window.history.replaceState(
          null,
          "",
          `/admin/blog/posts/${savedPost.id}/edit`
        );
      }

      return savedPost.id;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error saving article");
      setSaveStatus("unsaved");
      return null;
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  // Draft Autosave timer (debounced every 10 seconds if dirty and has title)
  useEffect(() => {
    if (!postId || !isDirtyRef.current || !title.trim()) return;

    const autoSaveTimer = setTimeout(() => {
      if (isDirtyRef.current && !isSaving) {
        savePost(false);
      }
    }, 10000);

    return () => clearTimeout(autoSaveTimer);
  }, [content, title, excerpt, slug, featured, selectedCategoryIds, selectedTagIds, postId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
          <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
          <span>Loading article editor...</span>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(content);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative selection:bg-[var(--primary)] selection:text-white">
      {/* Background glow effects */}
      <div className="bg-glow one pointer-events-none opacity-40" />
      <div className="bg-glow two pointer-events-none opacity-30" />

      {/* Top Navbar */}
      <AdminNavbar />

      {/* Editor Sub-Header Action Bar */}
      <div className="sticky top-[105px] z-30 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog/posts"
              className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text-bright)] transition-colors"
              title="Return to posts list"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--text-bright)] text-sm hidden sm:inline">
                {isEditing ? "Edit Article" : "New Article"}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  status === "PUBLISHED"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                }`}
              >
                {status}
              </span>

              {/* Autosave badge */}
              <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] pl-2 border-l border-[var(--border)]">
                {saveStatus === "saving" && (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-[var(--primary)]" />
                    <span>Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Saved</span>
                  </>
                )}
                {saveStatus === "unsaved" && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Unsaved changes</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "edit"
                    ? "bg-[var(--primary)] text-white font-semibold"
                    : "text-[var(--muted)] hover:text-white"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "split"
                    ? "bg-[var(--primary)] text-white font-semibold"
                    : "text-[var(--muted)] hover:text-white"
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "preview"
                    ? "bg-[var(--primary)] text-white font-semibold"
                    : "text-[var(--muted)] hover:text-white"
                }`}
              >
                Preview
              </button>
            </div>

            {/* Preview Page Link */}
            {postId && (
              <Link
                href={`/admin/blog/posts/${postId}/preview`}
                target="_blank"
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text-bright)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Preview full article page"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Preview</span>
              </Link>
            )}

            {/* Save Draft Button */}
            <button
              type="button"
              onClick={() => savePost(false)}
              disabled={isSaving}
              className="px-3 sm:px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-bright)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            {/* Publish Button */}
            <button
              type="button"
              onClick={() => {
                setIsPublishing(true);
                savePost(true);
              }}
              disabled={isSaving || isPublishing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:brightness-110 active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_16px_var(--glow)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{status === "PUBLISHED" ? "Update Live" : "Publish"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Content Editor */}
        <div
          className={`${
            showSeoSettings ? "lg:col-span-8" : "lg:col-span-8"
          } space-y-6`}
        >
          {/* Article Title & Slug Card */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md space-y-4 shadow-xl">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Article Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Architecting Scalable GIS Telemetry with Next.js & CesiumJS..."
                className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-base sm:text-lg font-bold text-[var(--text-bright)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8">
                <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
                  URL Slug:
                </label>
                <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs text-[var(--muted)] font-mono">
                  <span>/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="my-article-slug"
                    className="flex-1 bg-transparent border-none text-[var(--text-bright)] focus:outline-none pl-1"
                  />
                </div>
              </div>

              <div className="sm:col-span-4 flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    const freshSlug = generateSlug(title);
                    setSlug(freshSlug);
                    setSlugManuallyEdited(false);
                    isDirtyRef.current = true;
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-xs text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
                >
                  Regenerate Slug
                </button>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
                Excerpt / Summary
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  isDirtyRef.current = true;
                  setSaveStatus("unsaved");
                }}
                rows={2}
                placeholder="A concise synopsis of the article for cards, social sharing, and search engines..."
                className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)] transition-all resize-none"
              />
            </div>
          </div>

          {/* Markdown Editor Toolbar & Input */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md overflow-hidden shadow-xl flex flex-col">
            {/* Toolbar */}
            <div className="p-2 sm:p-2.5 border-b border-[var(--border)] bg-[var(--surface-2)]/90 flex flex-wrap items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("# ", "", "Heading 1")}
                title="Heading 1"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("## ", "", "Heading 2")}
                title="Heading 2"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("### ", "", "Heading 3")}
                title="Heading 3"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <Heading3 className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-[var(--border)] mx-1" />

              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("**", "**", "bold text")}
                title="Bold"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("*", "*", "italic text")}
                title="Italic"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <Italic className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-[var(--border)] mx-1" />

              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("[", "](https://example.com)", "link title")}
                title="Insert Link"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("> ", "", "Quote text")}
                title="Blockquote"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("- ", "", "List item")}
                title="Bulleted List"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("1. ", "", "List item")}
                title="Numbered List"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-[var(--border)] mx-1" />

              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("`", "`", "code")}
                title="Inline Code"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <Code className="w-4 h-4" />
              </button>

              {/* Code Block Dropdown/Modal Trigger */}
              <button
                type="button"
                onClick={() => setShowCodeModal(true)}
                title="Code Block with Syntax Highlighting"
                className="px-2.5 py-1.5 rounded-lg bg-[var(--primary)]/15 hover:bg-[var(--primary)]/25 text-[var(--primary-light)] border border-[var(--primary)]/30 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FileCode className="w-4 h-4" />
                <span className="hidden sm:inline">Code Block</span>
              </button>

              <button
                type="button"
                onClick={handleInsertTable}
                title="Insert Table"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <TableIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => insertMarkdownAtCursor("\n---\n")}
                title="Horizontal Rule"
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Inline image upload into markdown */}
              <label
                className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-white transition-colors cursor-pointer inline-flex items-center"
                title="Upload & Insert Image"
              >
                <ImageIcon className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  className="hidden"
                />
              </label>

              <div className="ml-auto text-[11px] text-[var(--muted-2)] flex items-center gap-3">
                <span>{readingTime} min read</span>
                <span>{content.length} chars</span>
              </div>
            </div>

            {/* Split / Single View Editor Body */}
            <div
              className={`grid ${
                viewMode === "split"
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              } divide-y md:divide-y-0 md:divide-x divide-[var(--border)] min-h-[500px]`}
            >
              {/* Write Side */}
              {(viewMode === "edit" || viewMode === "split") && (
                <div className="p-4 flex flex-col h-full bg-[var(--surface-2)]/30">
                  <textarea
                    ref={contentTextareaRef}
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Write article in Markdown with code blocks, headings, images, and links..."
                    className="w-full h-full min-h-[480px] bg-transparent border-none text-sm text-[var(--text)] font-mono placeholder-[var(--muted-2)] focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              )}

              {/* Preview Side */}
              {(viewMode === "preview" || viewMode === "split") && (
                <div className="p-5 h-full overflow-y-auto bg-[var(--bg)]/50 max-w-none">
                  {content.trim() ? (
                    <div
                      className="blog-content-body text-sm sm:text-base leading-relaxed text-[var(--text)]"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-[var(--muted-2)]">
                      Live markdown preview will appear here...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Settings, Cover Image, Taxonomy, SEO */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cover Image Box */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md space-y-3 shadow-xl">
            <h3 className="font-bold text-[var(--text-bright)] text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[var(--primary)]" />
              <span>Cover Image</span>
            </h3>

            {coverImage ? (
              <div className="relative rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] group aspect-video">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImage("");
                    isDirtyRef.current = true;
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                  title="Remove cover image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-[var(--border)] rounded-xl p-4 text-center space-y-2 bg-[var(--surface-2)]/40">
                <Upload className="w-6 h-6 text-[var(--muted)] mx-auto" />
                <p className="text-xs text-[var(--muted)]">
                  Upload an image or paste a direct image URL.
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:brightness-110 cursor-pointer">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            <div>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.value);
                  isDirtyRef.current = true;
                }}
                placeholder="Or paste cover image URL..."
                className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {/* Publishing Settings & Author */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md space-y-4 shadow-xl">
            <h3 className="font-bold text-[var(--text-bright)] text-sm">
              Publication Settings
            </h3>

            {/* Status select */}
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any);
                  isDirtyRef.current = true;
                }}
                className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="DRAFT">DRAFT (Hidden from public)</option>
                <option value="PUBLISHED">PUBLISHED (Live on blog)</option>
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">
                Author
              </label>
              <select
                value={authorId}
                onChange={(e) => {
                  setAuthorId(e.target.value);
                  isDirtyRef.current = true;
                }}
                className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <div>
                <span className="text-xs font-semibold text-[var(--text-bright)] block">
                  Featured Article
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  Highlight at the top of the blog page
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFeatured((f) => !f);
                  isDirtyRef.current = true;
                }}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  featured ? "bg-[var(--primary)]" : "bg-[var(--surface-3)]"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    featured ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md space-y-3 shadow-xl">
            <h3 className="font-bold text-[var(--text-bright)] text-sm">
              Categories
            </h3>
            {categories.length === 0 ? (
              <p className="text-xs text-[var(--muted)]">
                No categories yet. You can add them in Categories tab.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((c) => {
                  const checked = selectedCategoryIds.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--surface-2)] cursor-pointer text-xs text-[var(--text)] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCategoryToggle(c.id)}
                        className="rounded accent-[var(--primary)]"
                      />
                      <span>{c.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md space-y-3 shadow-xl">
            <h3 className="font-bold text-[var(--text-bright)] text-sm">
              Tags
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {selectedTagIds.map((id) => {
                const tagObj = tags.find((t) => t.id === id);
                if (!tagObj) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30 font-medium"
                  >
                    <span>{tagObj.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(id)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag and press Enter..."
                className="flex-1 px-3 py-1.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* SEO Collapsible Panel */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => setShowSeoSettings((s) => !s)}
              className="w-full p-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[var(--primary)]" />
                <span>Search Engine Optimization (SEO)</span>
              </div>
              {showSeoSettings ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showSeoSettings && (
              <div className="p-4 pt-0 space-y-3 border-t border-[var(--border)] mt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
                    Custom SEO Title (defaults to article title)
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => {
                      setSeoTitle(e.target.value);
                      isDirtyRef.current = true;
                    }}
                    placeholder="Custom <title> tag..."
                    className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => {
                      setSeoDescription(e.target.value);
                      isDirtyRef.current = true;
                    }}
                    placeholder="Custom meta description for search engines..."
                    className="w-full p-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
                    Canonical URL (optional)
                  </label>
                  <input
                    type="url"
                    value={canonicalUrl}
                    onChange={(e) => {
                      setCanonicalUrl(e.target.value);
                      isDirtyRef.current = true;
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Code Block Inserter Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-bright)] text-sm flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[var(--primary)]" />
                <span>Insert Code Block</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                className="text-[var(--muted)] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-2">
                Select Language:
              </label>
              <select
                value={selectedCodeLang}
                onChange={(e) => setSelectedCodeLang(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="tsx">React / TSX</option>
                <option value="jsx">React / JSX</option>
                <option value="nextjs">Next.js</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="sql">SQL / Postgres</option>
                <option value="python">Python</option>
                <option value="json">JSON</option>
                <option value="bash">Bash / Shell</option>
                <option value="markdown">Markdown</option>
                <option value="yaml">YAML</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                className="px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs text-[var(--muted)] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleInsertCodeBlock(selectedCodeLang)}
                className="px-4 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:brightness-110 cursor-pointer"
              >
                Insert Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
