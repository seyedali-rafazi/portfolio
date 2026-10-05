"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Shield,
  Lock,
  LogOut,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  Clock,
  Sparkles,
  Send,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface StatsData {
  total: number;
  unread: number;
  read: number;
  today: number;
}

export function AdminModerationDashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [secretInput, setSecretInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    unread: 0,
    read: 0,
    today: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Show sonner toast
  const showNotice = (text: string, type: "success" | "error" = "success") => {
    if (type === "success") {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        filter,
        search: debouncedSearch,
      });

      const res = await fetch(`/api/admin/messages?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || "Failed to fetch messages"
        );
      }

      const data = await res.json();
      const messageList: MessageItem[] = Array.isArray(data.messages)
        ? data.messages
        : [];

      setMessages(messageList);
      setStats(
        data.stats || {
          total: 0,
          unread: 0,
          read: 0,
          today: 0,
        }
      );

      const computedTotalPages = Math.max(1, data.pagination?.totalPages || 1);
      setTotalPages(computedTotalPages);
      setTotalCount(data.pagination?.total || 0);

      // If page is beyond total pages (e.g. after deleting all messages on last page)
      if (page > computedTotalPages) {
        setPage(1);
      }

      // Update or clear selected message if it no longer exists
      setSelectedMessage((prev) => {
        if (!prev) return null;
        return messageList.find((m) => m.id === prev.id) || null;
      });
    } catch (err: any) {
      console.error(err);
      showNotice(
        err?.message || "Failed to load messages from server",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, page, filter, debouncedSearch]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated, fetchMessages]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretInput.trim()) return;

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secretInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setIsAuthenticated(true);
      setSecretInput("");
    } catch (err: any) {
      setAuthError(err.message || "Invalid admin secret key");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setSelectedMessage(null);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Read Status for single message
  const handleToggleRead = async (
    message: MessageItem,
    e?: React.MouseEvent,
  ) => {
    e?.stopPropagation();
    const newStatus = !message.isRead;

    // Optimistic UI update
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, isRead: newStatus } : m)),
    );
    setSelectedMessage((prev) =>
      prev && prev.id === message.id ? { ...prev, isRead: newStatus } : prev
    );
    setStats((prev) => ({
      ...prev,
      unread: newStatus ? Math.max(0, prev.unread - 1) : prev.unread + 1,
      read: newStatus ? prev.read + 1 : Math.max(0, prev.read - 1),
    }));

    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: newStatus }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to update status");
      }

      showNotice(
        newStatus ? "Marked message as read" : "Marked message as unread",
      );
    } catch (err: any) {
      await fetchMessages();
      showNotice(err?.message || "Failed to update status", "error");
    }
  };

  // Delete single message
  const handleDeleteMessage = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this message?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to delete message");
      }

      setMessages((prev) => prev.filter((m) => m.id !== id));
      setSelectedMessage((prev) => (prev?.id === id ? null : prev));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      showNotice("Message permanently deleted");
      await fetchMessages();
    } catch (err: any) {
      showNotice(err?.message || "Failed to delete message", "error");
    }
  };

  // Bulk actions
  const handleBulkAction = async (
    action: "markRead" | "markUnread" | "delete",
  ) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    if (
      action === "delete" &&
      !confirm(`Permanently delete ${ids.length} selected messages?`)
    ) {
      return;
    }

    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Bulk action failed");
      }

      showNotice(`Bulk action applied to ${ids.length} messages`);
      setSelectedIds(new Set());
      await fetchMessages();
    } catch (err: any) {
      showNotice(err?.message || "Bulk action failed", "error");
    }
  };


  const handleSelectAll = () => {
    if (selectedIds.size === messages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map((m) => m.id)));
    }
  };

  const handleToggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return dateStr;
    }
  };

  // Helper for generating avatar initials and color
  const getInitials = (name: string) => {
    return (name || "?")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Check initial loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  // Render Login Lock Screen if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg)]">
        <div className="bg-glow one pointer-events-none" />
        <div className="bg-glow two pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10 border border-[var(--border)] rounded-3xl bg-[var(--surface)]/95 backdrop-blur-xl p-8 sm:p-10 shadow-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_var(--glow-strong)] text-white">
            <Shield className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-extrabold text-center text-[var(--text-bright)] tracking-tight mb-2">
            Moderator Access
          </h1>
          <p className="text-sm text-center text-[var(--muted)] mb-8">
            Enter the admin passcode to access user messages stored in your
            database.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  placeholder="Enter ADMIN_SECRET..."
                  required
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:brightness-110 active:scale-[0.99] text-white font-semibold text-sm shadow-[0_4px_20px_var(--glow)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Unlock Moderation Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text-bright)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Portfolio</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative selection:bg-[var(--primary)] selection:text-white">
      {/* Background glow effects */}
      <div className="bg-glow one pointer-events-none opacity-40" />
      <div className="bg-glow two pointer-events-none opacity-30" />


      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white shadow-[0_0_12px_var(--glow)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--text-bright)] text-sm sm:text-base tracking-tight">
                  Portfolio Admin
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30">
                  Moderation
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PostgreSQL Neon Connected</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => fetchMessages()}
              disabled={isLoading}
              title="Refresh messages"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--muted)]">
                Total Messages
              </span>
              <Inbox className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-bright)]">
              {stats.total}
            </div>
            <div className="text-[11px] text-[var(--muted-2)] mt-1">
              All time received
            </div>
          </div>

          <div className="border border-amber-500/30 bg-amber-500/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-300">Unread</span>
              <Mail className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {stats.unread}
            </div>
            <div className="text-[11px] text-amber-400/70 mt-1">
              Needs attention
            </div>
          </div>

          <div className="border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-emerald-300">
                Handled
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {stats.read}
            </div>
            <div className="text-[11px] text-emerald-400/70 mt-1">
              Marked as read
            </div>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--muted)]">
                Received Today
              </span>
              <Calendar className="w-4 h-4 text-[var(--primary-light)]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-bright)]">
              {stats.today}
            </div>
            <div className="text-[11px] text-[var(--muted-2)] mt-1">
              Last 24 hours
            </div>
          </div>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-md p-3 rounded-2xl">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-xl">
            <button
              onClick={() => {
                setFilter("all");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => {
                setFilter("unread");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                filter === "unread"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              <span>Unread</span>
              {stats.unread > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
            <button
              onClick={() => {
                setFilter("read");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "read"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              Read ({stats.read})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, text..."
              className="w-full pl-9 pr-3 py-1.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)] transition-all"
            />
          </div>
        </div>

        {/* Bulk Action Strip (Visible when items selected) */}
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-2xl text-xs"
          >
            <span className="font-semibold text-[var(--text-bright)]">
              {selectedIds.size}{" "}
              {selectedIds.size === 1 ? "message" : "messages"} selected
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("markRead")}
                className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text)] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <MailOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Read</span>
              </button>
              <button
                onClick={() => handleBulkAction("markUnread")}
                className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text)] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Mark Unread</span>
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-2 py-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Messages List (5 of 12 cols on desktop) */}
          <div className="lg:col-span-5 border border-[var(--border)] rounded-2xl bg-[var(--surface)]/80 backdrop-blur-md overflow-hidden flex flex-col">
            {/* List Header */}
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    messages.length > 0 && selectedIds.size === messages.length
                  }
                  onChange={handleSelectAll}
                  className="rounded border-[var(--border)] cursor-pointer text-[var(--primary)] focus:ring-0"
                />
                <span>Select All</span>
              </div>
              <span>
                {messages.length} of {totalCount}
              </span>
            </div>

            {/* List Items */}
            <div className="divide-y divide-[var(--border)] max-h-[620px] overflow-y-auto">
              {isLoading && messages.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
                  <span>Loading messages from database...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-3">
                  <Inbox className="w-8 h-8 opacity-40" />
                  <p className="font-semibold text-sm text-[var(--text-bright)]">
                    No messages found
                  </p>
                  <p className="text-[var(--muted-2)] max-w-xs">
                    {search
                      ? "No inquiries match your current search terms."
                      : "Messages submitted from the portfolio contact form will appear here."}
                  </p>
                </div>
              ) : (
                messages.map((item) => {
                  const isSelected = selectedMessage?.id === item.id;
                  const isChecked = selectedIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedMessage(item);
                        // If unread, auto mark read on inspect
                        if (!item.isRead) {
                          handleToggleRead(item);
                        }
                      }}
                      className={`p-4 transition-all cursor-pointer relative flex items-start gap-3 text-start ${
                        isSelected
                          ? "bg-[var(--primary)]/10 border-l-4 border-l-[var(--primary)]"
                          : "hover:bg-[var(--surface-2)]/60"
                      } ${!item.isRead ? "font-semibold" : "opacity-90"}`}
                    >
                      {/* Checkbox */}
                      <div
                        onClick={(e) => handleToggleSelectOne(item.id, e)}
                        className="pt-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-[var(--border)] cursor-pointer text-[var(--primary)]"
                        />
                      </div>

                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--surface-3)] to-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--primary-light)] shrink-0">
                        {getInitials(item.name)}
                      </div>

                      {/* Info & Snippet */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-bold text-[var(--text-bright)] truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-[var(--muted-2)] whitespace-nowrap">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>

                        <div className="text-[11px] text-[var(--muted)] truncate mb-1">
                          {item.email}
                        </div>

                        <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>

                      {/* Unread indicator dot */}
                      {!item.isRead && (
                        <span
                          title="Unread message"
                          className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)] shrink-0 mt-1"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="p-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Inspector (7 of 12 cols) */}
          <div className="lg:col-span-7 border border-[var(--border)] rounded-2xl bg-[var(--surface)]/90 backdrop-blur-md p-6 sm:p-8 min-h-[500px] flex flex-col justify-between shadow-xl">
            {selectedMessage ? (
              <div className="space-y-6 flex-1 flex flex-col">
                {/* Header Profile */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[var(--border)]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white font-extrabold text-base shadow-[0_0_15px_var(--glow)]">
                      {getInitials(selectedMessage.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-[var(--text-bright)]">
                          {selectedMessage.name}
                        </h2>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            selectedMessage.isRead
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          }`}
                        >
                          {selectedMessage.isRead ? "Read" : "Unread"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-xs text-[var(--primary-light)] hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{selectedMessage.email}</span>
                        </a>
                        <button
                          onClick={() => copyToClipboard(selectedMessage.email)}
                          title="Copy email address"
                          className="p-1 hover:bg-[var(--surface-2)] rounded text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                        >
                          {copiedEmail ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedMessage)}
                      className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {selectedMessage.isRead ? (
                        <>
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>Mark Unread</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mark Read</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata row */}
                <div className="flex items-center justify-between text-xs text-[var(--muted-2)]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(selectedMessage.createdAt).toLocaleString(
                        undefined,
                        {
                          dateStyle: "full",
                          timeStyle: "medium",
                        },
                      )}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] opacity-60">
                    ID: {selectedMessage.id}
                  </span>
                </div>

                {/* Message Body */}
                <div className="flex-1 rounded-2xl bg-[var(--surface-2)]/60 border border-[var(--border)] p-5 text-sm sm:text-base leading-relaxed text-[var(--text)] whitespace-pre-wrap selection:bg-[var(--primary)] selection:text-white">
                  {selectedMessage.message}
                </div>

                {/* Quick Reply Bar */}
                <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[var(--muted)]">
                    Want to reply directly to {selectedMessage.name}?
                  </span>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your inquiry on Portfolio&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A---%0D%0AOriginal message:%0D%0A${encodeURIComponent(
                      selectedMessage.message,
                    )}`}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white text-xs font-bold shadow-[0_4px_15px_var(--glow)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply via Email Client</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="m-auto text-center p-12 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--muted)]">
                  <MessageSquare className="w-8 h-8 opacity-50" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-bright)]">
                    No Message Selected
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-1 max-w-sm mx-auto">
                    Select a message from the list on the left to review its
                    content, toggle read status, or send a reply.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
