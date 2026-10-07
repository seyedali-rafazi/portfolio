/**
 * Calculates estimated reading time in minutes for markdown / rich text content.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  if (!content || typeof content !== "string") return 1;

  // Strip code blocks and HTML tags to count words in human-readable text
  const cleanText = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[#*`_~\[\]()>-]/g, " ")
    .trim();

  // Split on whitespace
  const words = cleanText.split(/\s+/).filter(Boolean);
  const minutes = Math.ceil(words.length / wordsPerMinute);

  return Math.max(1, minutes);
}
