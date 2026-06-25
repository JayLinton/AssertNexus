"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { FolderGroup } from "@/lib/types";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  groups: FolderGroup[];
  currentSlug?: string;
  onNavigate?: (slug: string) => void;
}

export function MobileDrawer({ open, onClose, groups, currentSlug, onNavigate }: MobileDrawerProps) {
  // Lock body scroll when drawer is open (shared with SearchDialog)
  useScrollLock(open);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop — z-50 to cover FAB buttons (z-40) */}
      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: "rgba(0,0,0,0.3)" }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel — z-[60] above backdrop */}
      <div
        className="fixed top-0 left-0 z-[60] h-full lg:hidden transition-transform duration-300 ease-out"
        style={{
          width: "280px",
          maxWidth: "85vw",
          background: "var(--color-sidebar-bg)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          boxShadow: open ? "var(--shadow-deep)" : "none",
        }}
      >
        {/* Close button — minimal, no redundant header */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 12px 0 0" }}>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "#71717a",
              cursor: "pointer",
            }}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <Sidebar
          groups={groups}
          currentSlug={currentSlug}
          onNavigate={(slug) => {
            onNavigate?.(slug);
            onClose();
          }}
        />
      </div>
    </>
  );
}
