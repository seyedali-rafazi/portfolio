"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface BlogSearchBarProps {
  initialQuery?: string;
  locale?: "en" | "fa";
}

export function BlogSearchBar({ initialQuery = "", locale = "en" }: BlogSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery || searchParams.get("q") || "");
  const isFa = locale === "fa";
  const basePath = isFa ? "/fa/blog" : "/blog";

  const navigate = (term: string) => {
    const sp = new URLSearchParams();
    if (term) sp.set("q", term);
    const size = searchParams.get("pageSize");
    if (size) sp.set("pageSize", size);
    const qs = sp.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={
          isFa
            ? "جستجوی مقالات تخصصی، ابزارها، کلیدواژه‌ها..."
            : "Search engineering articles, tools, keywords..."
        }
        className="w-full ps-10 pe-9 py-2.5 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 backdrop-blur-md transition-all shadow-sm"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            if (searchParams.get("q")) navigate("");
          }}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
