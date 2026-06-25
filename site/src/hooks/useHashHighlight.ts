"use client";

import { useEffect } from "react";

/**
 * SPA-compatible hash highlight hook.
 *
 * Next.js soft routing doesn't trigger a full browser refresh,
 * so CSS `:target` won't re-fire on repeated clicks to the same hash.
 * This hook listens for `hashchange` and uses a reflow trick
 * to re-trigger the `.animate-target-flash` animation every time.
 */
export function useHashHighlight() {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const targetId = decodeURIComponent(hash.substring(1));
      const element = document.getElementById(targetId);

      if (element) {
        // Remove animation class first…
        element.classList.remove("animate-target-flash");
        // …force a reflow so the browser treats it as a new animation…
        void element.offsetWidth;
        // …then re-add the class to trigger the flash
        element.classList.add("animate-target-flash");
      }
    };

    // Listen for hash changes (SPA navigation)
    window.addEventListener("hashchange", handleHashChange);

    // Run once on mount (handles direct URL with hash)
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
}
