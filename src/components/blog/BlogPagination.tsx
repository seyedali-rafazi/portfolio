import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/blog/listing";

interface BlogPaginationProps {
  basePath: string;
  page: number;
  totalPages: number;
  pageSize: number;
  q?: string;
  locale?: "en" | "fa";
}

export function BlogPagination({
  basePath,
  page,
  totalPages,
  pageSize,
  q,
  locale = "en",
}: BlogPaginationProps) {
  const isFa = locale === "fa";

  const href = (p: number, size = pageSize) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (p > 1) sp.set("page", String(p));
    if (size !== DEFAULT_PAGE_SIZE) sp.set("pageSize", String(size));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const PrevIcon = isFa ? ChevronRight : ChevronLeft;
  const NextIcon = isFa ? ChevronLeft : ChevronRight;
  const btn =
    "px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold flex items-center gap-1.5 transition-colors";

  return (
    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
      {totalPages > 1 && (
        <div className="flex items-center gap-3">
          <Link
            href={href(Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={`${btn} ${
              page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-[var(--surface-2)] text-[var(--text)]"
            }`}
          >
            <PrevIcon className="w-4 h-4" />
            <span>{isFa ? "صفحه قبل" : "Previous"}</span>
          </Link>

          <span className="text-xs text-[var(--muted)] font-mono px-2">
            {page} {isFa ? "از" : "/"} {totalPages}
          </span>

          <Link
            href={href(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={`${btn} ${
              page >= totalPages
                ? "pointer-events-none opacity-40"
                : "hover:bg-[var(--surface-2)] text-[var(--text)]"
            }`}
          >
            <span>{isFa ? "صفحه بعد" : "Next"}</span>
            <NextIcon className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
        <span>{isFa ? "تعداد در صفحه:" : "Per page:"}</span>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <Link
            key={size}
            href={href(1, size)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              size === pageSize
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface-2)] border border-[var(--border)] hover:text-[var(--text-bright)]"
            }`}
          >
            {size}
          </Link>
        ))}
      </div>
    </div>
  );
}
