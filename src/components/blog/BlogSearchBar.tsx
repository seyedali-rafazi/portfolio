"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface BlogSearchBarProps {
  initialQuery?: string;
}

export function BlogSearchBar({ initialQuery = "" }: BlogSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (clean) {
      router.push(`/blog/search?q=${encodeURIComponent(clean)}`);
    } else {
      router.push("/blog");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search engineering articles, tools, keywords..."
        className="w-full pl-10 pr-9 py-2.5 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 backdrop-blur-md transition-all shadow-sm"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            if (initialQuery) router.push("/blog");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
