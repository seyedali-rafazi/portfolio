import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dictionaries } from "@/i18n";
import { getNotFoundMetadata } from "@/lib/metadata";

export const metadata = getNotFoundMetadata("en");

export default function NotFound() {
  const dict = dictionaries.en.notFound;

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center min-h-[70vh] px-4 py-24 text-center" id="main-content">
        <div className="max-w-md space-y-6">
          <Badge variant="primarySubtle" className="px-3 py-1 text-xs">
            {dict.badge}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-bright)] tracking-tight">
            {dict.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            {dict.description}
          </p>
          <div>
            <Button asChild size="lg" className="rounded-xl px-8 font-bold">
              <Link href="/">{dict.backHome}</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
