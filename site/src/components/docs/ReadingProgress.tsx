"use client";

import { useReadingProgress } from "@/hooks/useReadingProgress";

/**
 * Client component that saves/restores scroll position for a document.
 * Render this inside the document page to enable reading progress.
 */
export function ReadingProgress({ slug }: { slug: string }) {
  useReadingProgress(slug);
  return null;
}
