"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, Send } from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;

  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  const shareTelegram = `https://t.me/share/url?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(title)}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-[var(--muted)] flex items-center gap-1.5 mr-1">
        <Share2 className="w-3.5 h-3.5 text-[var(--primary)]" />
        <span>Share:</span>
      </span>

      {/* Copy link button */}
      <button
        type="button"
        onClick={handleCopy}
        className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] flex items-center gap-1.5 transition-colors cursor-pointer"
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Twitter / X */}
      <a
        href={shareTwitter}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] flex items-center gap-1.5 transition-colors"
        title="Share on X (Twitter)"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>X</span>
      </a>

      {/* LinkedIn */}
      <a
        href={shareLinkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] flex items-center gap-1.5 transition-colors"
        title="Share on LinkedIn"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
        <span>LinkedIn</span>
      </a>

      {/* Telegram */}
      <a
        href={shareTelegram}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] flex items-center gap-1.5 transition-colors"
        title="Share on Telegram"
      >
        <Send className="w-3.5 h-3.5 text-sky-400" />
        <span>Telegram</span>
      </a>
    </div>
  );
}
