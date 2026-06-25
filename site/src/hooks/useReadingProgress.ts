"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY = "reading-progress";
const MAX_AGE_DAYS = 30;
const RESTORE_DELAY = 600; // ms to wait before restoring scroll

interface ProgressEntry {
  scrollY: number;
  timestamp: number;
}

type ProgressMap = Record<string, ProgressEntry>;

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const map = JSON.parse(raw) as ProgressMap;
    // Clean up old entries
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    let changed = false;
    for (const key of Object.keys(map)) {
      if (map[key].timestamp < cutoff) {
        delete map[key];
        changed = true;
      }
    }
    if (changed) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(map)); } catch { /* ignore */ }
    }
    return map;
  } catch {
    return {};
  }
}

function saveScrollPosition(slug: string) {
  const scrollY = window.scrollY;
  if (scrollY < 100) {
    // User is near top — remove entry instead of saving
    try {
      const map = loadProgress();
      delete map[slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch { /* ignore */ }
    return;
  }
  try {
    const map = loadProgress();
    map[slug] = { scrollY, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch { /* ignore */ }
}

/**
 * Saves and restores reading scroll position for a document.
 * Returns the last saved progress map for sidebar markers.
 */
export function useReadingProgress(slug: string) {
  const savedRef = useRef(false);

  // Save on unload
  useEffect(() => {
    const handleBeforeUnload = () => saveScrollPosition(slug);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      // Also save on unmount (route change)
      saveScrollPosition(slug);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [slug]);

  // Restore on mount
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    const map = loadProgress();
    const entry = map[slug];
    if (!entry || entry.scrollY < 100) return;

    // Wait for DOM to settle
    const timer = setTimeout(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll < entry.scrollY) return; // Content changed, skip
      window.scrollTo(0, entry.scrollY);
    }, RESTORE_DELAY);

    return () => clearTimeout(timer);
  }, [slug]);
}

/**
 * Get the set of slugs that have saved reading progress.
 * Used by Sidebar to show markers.
 */
export function getProgressSlugs(): Set<string> {
  const map = loadProgress();
  return new Set(Object.keys(map));
}
