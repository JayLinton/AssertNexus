"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { MobileDrawer } from "./MobileDrawer";
import { MobileBottomBar } from "./MobileBottomBar";
import { SearchDialog } from "@/components/search/SearchDialog";
import { BackToTop } from "@/components/docs/BackToTop";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { config } from "@/site.config";
import type { FolderGroup } from "@/lib/types";

interface MainLayoutProps {
  groups: FolderGroup[];
  currentSlug?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
}

const SIDEBAR_EXPANDED = 280;
const SIDEBAR_COLLAPSED = 60;

export function MainLayout({ groups, currentSlug, breadcrumbs, children }: MainLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return localStorage.getItem("sidebar-collapsed") === "true"; } catch { return false; }
  });

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      try { localStorage.setItem("sidebar-collapsed", String(next)); } catch { /* ignore */ }
      return next;
    });
  };

  // Flatten all docs in order for prev/next navigation
  const flatDocs = useMemo(() => {
    return groups.flatMap((g) => g.docs.map((d) => ({ slug: d.slug, title: d.title })));
  }, [groups]);

  const currentIndex = useMemo(() => {
    if (!currentSlug) return -1;
    return flatDocs.findIndex((d) => d.slug === currentSlug);
  }, [flatDocs, currentSlug]);

  const prevDoc = currentIndex > 0 ? flatDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex >= 0 && currentIndex < flatDocs.length - 1 ? flatDocs[currentIndex + 1] : null;

  // Ctrl/⌘ + K — search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Global shortcuts: T, [, ], B
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useKeyboardShortcuts([
    { key: "t", handler: scrollToTop },
    { key: "b", handler: toggleCollapsed },
    ...(prevDoc ? [{ key: "[", handler: () => router.push(`/docs/${prevDoc.slug}`) }] : []),
    ...(nextDoc ? [{ key: "]", handler: () => router.push(`/docs/${nextDoc.slug}`) }] : []),
  ]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)" }}>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      <MobileDrawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        groups={groups}
        currentSlug={currentSlug}
        onNavigate={() => setSidebarOpen(false)}
      />

      {/* ── Desktop sidebar: fixed, full height, flush top ── */}
      <aside
        className="layout-sidebar transition-colors-theme"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: sidebarWidth,
          height: "100vh",
          background: "#ffffff",
          borderRight: "1px solid rgba(0, 0, 0, 0.04)",
          zIndex: 40,
          transition: "width 0.2s ease",
          overflow: "hidden",
        }}
      >
        <Sidebar
          groups={groups}
          currentSlug={currentSlug}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          onOpenSearch={() => setSearchOpen(true)}
        />
      </aside>

      {/* ── Main content area ── */}
      <div
        className="layout-main"
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          // marginLeft 移到 CSS 变量，让媒体查询能覆盖
          ["--sidebar-width" as string]: `${sidebarWidth}px`,
        }}
      >
        {/* Sticky header with breadcrumbs */}
        <TopNav
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onOpenSearch={() => setSearchOpen(true)}
          breadcrumbs={breadcrumbs}
        />

        {/* Page content — padding handled by .layout-content CSS */}
        <div className="layout-content" style={{ flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        <footer style={{ marginTop: "auto", borderTop: "1px solid #e4e4e7", padding: "12px 64px" }}>
          <p style={{ fontSize: "13px", color: "#a1a1aa", fontWeight: 300, fontFamily: "var(--font-sans)", margin: 0, textAlign: "center" }}>
            {config.footer}
          </p>
        </footer>
      </div>

      <BackToTop />

      {/* Mobile bottom navigation bar */}
      <MobileBottomBar
        onToggleToc={() => setSidebarOpen(v => !v)}
        onOpenSearch={() => setSearchOpen(true)}
        tocOpen={sidebarOpen}
        docSlug={currentSlug}
        docTitle={breadcrumbs?.[breadcrumbs.length - 1]?.label}
      />
    </div>
  );
}
