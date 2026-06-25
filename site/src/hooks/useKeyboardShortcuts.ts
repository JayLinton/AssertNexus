"use client";

import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  /** Only fires when NOT focused on input/textarea/contenteditable */
  ignoreInput?: boolean;
  handler: (e: KeyboardEvent) => void;
}

/**
 * Register global keyboard shortcuts.
 * Shortcuts with `ignoreInput: true` (default) are suppressed
 * when the user is typing in an input, textarea, or contenteditable.
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Always ignore when meta/ctrl is held (let browser shortcuts through)
      // Exception: we handle Ctrl+K ourselves elsewhere

      for (const shortcut of shortcuts) {
        if (e.key !== shortcut.key) continue;

        const ignoreInput = shortcut.ignoreInput !== false;
        if (ignoreInput) {
          const tag = (e.target as HTMLElement)?.tagName;
          const isInput = tag === "INPUT" || tag === "TEXTAREA";
          const isEditable = (e.target as HTMLElement)?.isContentEditable;
          if (isInput || isEditable) continue;
        }

        shortcut.handler(e);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
