"use client";

import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ArticleContentRendererProps {
  htmlContent: string;
}

export function ArticleContentRenderer({ htmlContent }: ArticleContentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Attach interactive click handlers to copy code buttons inside the rendered HTML
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const copyButtons = container.querySelectorAll<HTMLButtonElement>(".copy-code-btn");

    const handlers: { btn: HTMLButtonElement; fn: () => void }[] = [];

    copyButtons.forEach((btn) => {
      const fn = async () => {
        const rawCode = btn.getAttribute("data-code");
        if (!rawCode) return;

        try {
          const decoded = decodeURIComponent(rawCode);
          await navigator.clipboard.writeText(decoded);

          const copyText = btn.querySelector<HTMLElement>(".copy-text");
          if (copyText) {
            copyText.textContent = "Copied!";
          }
          btn.classList.add("text-emerald-400");
          toast.success("Code copied to clipboard!");

          setTimeout(() => {
            if (copyText) {
              copyText.textContent = "Copy";
            }
            btn.classList.remove("text-emerald-400");
          }, 2000);
        } catch (err) {
          console.error(err);
          toast.error("Failed to copy code");
        }
      };

      btn.addEventListener("click", fn);
      handlers.push({ btn, fn });
    });

    return () => {
      handlers.forEach(({ btn, fn }) => {
        btn.removeEventListener("click", fn);
      });
    };
  }, [htmlContent]);

  return (
    <div
      ref={containerRef}
      className="blog-content-body max-w-none text-[var(--text)] leading-relaxed text-base sm:text-lg"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
