import { renderBrandIcon } from "@/lib/brand-icon";

// Serves /favicon.ico (crawlers like Google request this path directly).
export const dynamic = "force-static";

export function GET() {
  return renderBrandIcon(96);
}
