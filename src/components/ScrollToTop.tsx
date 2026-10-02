"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Prevent browser from restoring old scroll offset on client navigation
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // Scroll immediately to the top of the page on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Extra frame check in case page components mount asynchronously
    const frameId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });

    return () => cancelAnimationFrame(frameId);
  }, [pathname]);

  return null;
}
