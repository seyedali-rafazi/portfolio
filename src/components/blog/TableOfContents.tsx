"use client";

import React, { useState, useEffect } from "react";
import { ListTree, ChevronDown } from "lucide-react";
import type { TocHeading } from "@/lib/blog/markdown";

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[var(--text-bright)]">
          <ListTree className="w-4 h-4 text-[var(--primary)]" />
          <span>Table of Contents</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpenMobile((o) => !o)}
          className="lg:hidden p-1 text-[var(--muted)] hover:text-white"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpenMobile ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`mt-4 space-y-2 text-xs transition-all ${
          isOpenMobile ? "block" : "hidden lg:block"
        }`}
      >
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const paddingLeft =
            heading.level === 3 ? "pl-4" : heading.level === 4 ? "pl-7" : "pl-1";

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveId(heading.id);
                }
              }}
              className={`block transition-colors py-1 ${paddingLeft} border-l-2 ${
                isActive
                  ? "border-[var(--primary)] text-[var(--primary-light)] font-semibold"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--text-bright)] hover:border-[var(--muted-2)]"
              }`}
            >
              {heading.text}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
