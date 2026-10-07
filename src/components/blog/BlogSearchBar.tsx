"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface BlogSearchBarProps {
  initialQuery?: string;
  locale?: "en" | "fa";
}

export function BlogSearchBar({ initialQuery = "", locale = "en" }: BlogSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const isFa = locale === "fa";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (clean) {
      router.push(`/blog/search?q=${encodeURIComponent(clean)}`);
    } else {
      router.push(isFa ? "/fa/blog" : "/blog");
    }
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
            if (initialQuery) router.push(isFa ? "/fa/blog" : "/blog");
          }}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
