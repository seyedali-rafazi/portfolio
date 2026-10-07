import { marked } from "marked";
import Prism from "prismjs";

// Load common Prism languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Normalizes heading text into a valid HTML anchor ID.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Maps common aliases to Prism-supported language keys.
 */
function normalizeLanguage(lang: string): string {
  const l = (lang || "").toLowerCase().trim();
  switch (l) {
    case "ts":
      return "typescript";
    case "js":
      return "javascript";
    case "tsx":
    case "react":
    case "next":
    case "nextjs":
      return "tsx";
    case "jsx":
      return "jsx";
    case "sh":
    case "shell":
    case "zsh":
      return "bash";
    case "py":
      return "python";
    case "yml":
      return "yaml";
    default:
      return Prism.languages[l] ? l : "javascript";
  }
}

/**
 * Extracts headings for Table of Contents from markdown content.
 */
export function extractTableOfContents(markdown: string): TocHeading[] {
  if (!markdown) return [];

  const headings: TocHeading[] = [];
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    // Strip markdown formatting from heading text (e.g. bold, links)
    const text = rawText
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1");

    const id = slugifyHeading(text);
    if (id) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}

/**
 * Preserves intentional consecutive blank lines and spaces between lines.
 * Standard markdown collapses multiple blank lines into one.
 * Outside of code blocks, this converts extra consecutive newlines into visible line breaks.
 */
function preserveExtraLineBreaks(text: string): string {
  if (!text) return "";
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part, index) => {
      // Code blocks (odd indices) remain untouched
      if (index % 2 === 1) return part;

      // Outside code blocks:
      // When 3 or more consecutive newlines (or empty lines with spaces) are found,
      // preserve each extra line as an explicit blank paragraph
      return part.replace(/(?:\r?\n[ \t]*){3,}/g, (match) => {
        const lineCount = (match.match(/\n/g) || []).length;
        const extraCount = Math.max(1, lineCount - 2);
        return "\n\n" + Array(extraCount).fill("&nbsp;\n\n").join("");
      });
    })
    .join("");
}

/**
 * Parses markdown into rich, sanitized HTML with:
 * - Syntax highlighting for code blocks
 * - Anchor IDs for headings
 * - Responsive image markup with caption support
 * - Line break and paragraph spacing preservation
 */
export function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";

  const prepared = preserveExtraLineBreaks(markdown);
  const renderer = new marked.Renderer();

  // Custom heading renderer to add anchor IDs and support bold/italic/code within headings
  renderer.heading = function (token: any) {
    const depth = token.depth;
    const formattedHtml =
      token.tokens && (this as any)?.parser
        ? (this as any).parser.parseInline(token.tokens)
        : marked.parseInline(token.text || "");

    const plainText = (token.text || "")
      .replace(/<[^>]+>/g, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1");
    const id = slugifyHeading(plainText);

    return `<h${depth} id="${id}" class="blog-heading group">
      <span>${formattedHtml}</span>
      <a href="#${id}" class="heading-anchor" aria-hidden="true" tabindex="-1">#</a>
    </h${depth}>`;
  };

  // Custom text renderer to preserve consecutive spaces and tabs between words
  renderer.text = function (token: any) {
    const raw = typeof token === "string" ? token : token?.text || "";
    return raw
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/ {2,}/g, (match: string) => " " + "&nbsp;".repeat(match.length - 1));
  };

  // Custom code block renderer with Prism syntax highlighting
  renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
    const rawLang = lang || "code";
    const prismLang = normalizeLanguage(rawLang);
    let highlighted = text;

    try {
      if (Prism.languages[prismLang]) {
        highlighted = Prism.highlight(
          text,
          Prism.languages[prismLang],
          prismLang
        );
      }
    } catch {
      // Fallback to unhighlighted text if prism throws
      highlighted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    const displayLang = (lang || "code").toUpperCase();

    return `<div class="code-block-wrapper my-6 rounded-2xl overflow-hidden border border-[var(--border)] bg-[#0d1117] shadow-xl" data-lang="${displayLang}">
      <div class="code-block-header flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[var(--border)] text-xs text-[var(--muted)]">
        <div class="flex items-center gap-2 font-mono">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          <span class="ml-2 font-semibold text-[var(--muted)] tracking-wider">${displayLang}</span>
        </div>
        <button type="button" class="copy-code-btn flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-white hover:bg-[var(--surface-3)] transition-all cursor-pointer" data-code="${encodeURIComponent(
          text
        )}" title="Copy code">
          <svg class="copy-icon w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span class="copy-text">Copy</span>
        </button>
      </div>
      <pre class="language-${prismLang} p-4 text-sm font-mono overflow-x-auto text-slate-100 leading-relaxed"><code class="language-${prismLang}">${highlighted}</code></pre>
    </div>`;
  };

  // Custom inline code renderer
  renderer.codespan = ({ text }: { text: string }) => {
    return `<code class="px-1.5 py-0.5 text-xs font-mono rounded-md bg-[var(--surface-2)] text-[var(--primary-light)] border border-[var(--border)]">${text}</code>`;
  };

  // Custom image renderer with caption support
  renderer.image = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
    const caption = title || text;
    return `<figure class="my-8 text-center">
      <div class="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] shadow-xl inline-block max-w-full">
        <img src="${href}" alt="${text || caption || "Blog Image"}" class="max-h-[520px] w-auto mx-auto object-cover" loading="lazy" />
      </div>
      ${
        caption
          ? `<figcaption class="mt-3 text-xs text-[var(--muted)] italic text-center">${caption}</figcaption>`
          : ""
      }
    </figure>`;
  };

  // Custom link renderer with rel="noopener noreferrer" for external URLs and inline formatting support
  renderer.link = function (token: any) {
    const href = token.href || "";
    const title = token.title;
    const isExternal = href.startsWith("http://") || href.startsWith("https://");
    const rel = isExternal ? ' rel="noopener noreferrer" target="_blank"' : "";
    const titleAttr = title ? ` title="${title}"` : "";
    const textHtml =
      token.tokens && (this as any)?.parser
        ? (this as any).parser.parseInline(token.tokens)
        : token.text || "";
    return `<a href="${href}" class="text-[var(--primary-light)] underline decoration-[var(--primary)]/40 underline-offset-4 hover:decoration-[var(--primary-light)] hover:text-white transition-colors"${titleAttr}${rel}>${textHtml}</a>`;
  };

  // Custom blockquote renderer
  renderer.blockquote = function (token: any) {
    const content =
      token.tokens && (this as any)?.parser
        ? (this as any).parser.parse(token.tokens)
        : token.text || "";
    return `<blockquote class="border-l-4 border-[var(--primary)] pl-5 py-2 my-6 text-[var(--text-bright)] italic bg-[var(--surface-2)]/60 rounded-r-2xl">${content}</blockquote>`;
  };

  // Custom table renderer (compatible with modern marked tokens)
  renderer.table = (token: any) => {
    let headerHtml = "";
    if (token.header) {
      headerHtml = token.header
        .map((cell: any) => `<th class="p-3 font-semibold border-b border-[var(--border)]">${marked.parseInline(cell.text || "")}</th>`)
        .join("");
    }
    let bodyHtml = "";
    if (token.rows) {
      bodyHtml = token.rows
        .map(
          (row: any) =>
            `<tr class="border-b border-[var(--border)]/60 hover:bg-[var(--surface-2)]/50 transition-colors">${row
              .map((cell: any) => `<td class="p-3">${marked.parseInline(cell.text || "")}</td>`)
              .join("")}</tr>`
        )
        .join("");
    }
    return `<div class="my-6 overflow-x-auto rounded-xl border border-[var(--border)] shadow-md">
      <table class="min-w-full divide-y divide-[var(--border)] text-sm text-left">
        <thead class="bg-[var(--surface-2)] text-[var(--text-bright)] font-semibold"><tr>${headerHtml}</tr></thead>
        <tbody class="divide-y divide-[var(--border)] bg-[var(--surface)] text-[var(--text)]">${bodyHtml}</tbody>
      </table>
    </div>`;
  };

  return marked.parse(prepared, {
    renderer,
    gfm: true,
    breaks: true,
  }) as string;
}
