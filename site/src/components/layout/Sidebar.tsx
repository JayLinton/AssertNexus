"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, FileText, Search, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { config } from "@/site.config";
import { type FolderGroup, getFolderDisplayName } from "@/lib/types";
import { getProgressSlugs } from "@/hooks/useReadingProgress";

interface SidebarProps {
  groups: FolderGroup[];
  currentSlug?: string;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: (slug: string) => void;
  onOpenSearch?: () => void;
}

export function Sidebar({ groups, currentSlug, collapsed, onToggleCollapsed, onNavigate, onOpenSearch }: SidebarProps) {
  const [progressSlugs, setProgressSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setProgressSlugs(getProgressSlugs());
  }, [currentSlug]);

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set(groups.map((g) => g.name));
    try {
      const saved = localStorage.getItem("sidebar-expanded");
      if (saved) {
        const arr = JSON.parse(saved) as string[];
        // Only keep names that still exist in current groups
        const valid = new Set(groups.map((g) => g.name));
        const restored = arr.filter((n) => valid.has(n));
        if (restored.length > 0) return new Set(restored);
      }
    } catch { /* ignore */ }
    return new Set(groups.map((g) => g.name));
  });

  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [currentSlug]);

  const toggleFolder = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      // Persist to localStorage
      try {
        localStorage.setItem("sidebar-expanded", JSON.stringify(Array.from(next)));
      } catch { /* ignore */ }
      return next;
    });
  };

  if (collapsed) {
    return (
      <nav className="h-full overflow-y-auto scrollbar-autohide" role="navigation" aria-label="Document tree" style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <img src={config.logo} alt="Logo" width={24} height={24} style={{ borderRadius: "4px" }} />
        </a>
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            title="搜索"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: 8, border: "none",
              background: "transparent", cursor: "pointer", color: "#a1a1aa", marginBottom: 8,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <Search size={16} />
          </button>
        )}
        {onToggleCollapsed && (
          <button
            onClick={onToggleCollapsed}
            title="展开侧边栏"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: 8, border: "none",
              background: "transparent", cursor: "pointer", color: "#a1a1aa",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <PanelLeftOpen size={16} />
          </button>
        )}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col h-full" role="navigation" aria-label="Document tree">

      {/* ── 常驻头部：Logo + Search（固定不滚动） ── */}
      <div className="shrink-0" style={{ background: "#ffffff", paddingBottom: "24px" }}>
        {/* Branding + Collapse toggle */}
        <div style={{ padding: "20px 16px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <img
              src={config.logo}
              alt="Logo"
              width={24}
              height={24}
              style={{ flexShrink: 0, borderRadius: "4px" }}
            />
            <span style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span style={{
                fontSize: "16px",
                fontWeight: 800,
                fontFamily: "var(--font-sans)",
                color: "#18181b",
                letterSpacing: "-0.02em",
              }}>
                {config.siteNameBold}
              </span>
              <span style={{
                fontSize: "16px",
                fontWeight: 300,
                fontFamily: "var(--font-sans)",
                color: "#71717a",
                letterSpacing: "-0.01em",
              }}>
                {config.siteNameLight}
              </span>
            </span>
          </a>
          {onToggleCollapsed && (
            <button
              onClick={onToggleCollapsed}
              title="收起侧边栏"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 28, height: 28, borderRadius: 6, border: "none",
                background: "transparent", cursor: "pointer", color: "#a1a1aa", flexShrink: 0,
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f5"; e.currentTarget.style.color = "#71717a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#a1a1aa"; }}
            >
              <PanelLeftClose size={15} />
            </button>
          )}
        </div>

        {/* Search trigger */}
        {onOpenSearch && (
          <div style={{ padding: "16px 16px 0" }}>
            <button
              onClick={onOpenSearch}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "7px 12px",
                borderRadius: "8px",
                border: "none",
                outline: "none",
                background: "#f4f4f5",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e4e4e7"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f4f4f5"; }}
            >
              <Search size={14} style={{ color: "#a1a1aa", flexShrink: 0 }} />
              <span style={{
                flex: 1,
                textAlign: "left",
                fontSize: "13px",
                color: "#a1a1aa",
                fontFamily: "var(--font-sans)",
              }}>
                {config.searchPlaceholder}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                <kbd style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  color: "#a1a1aa",
                  background: "#ffffff",
                  border: "1px solid #e4e4e7",
                  borderBottomWidth: "2px",
                  borderRadius: "4px",
                  padding: "1px 5px",
                  lineHeight: "17px",
                }}>
                  Ctrl
                </kbd>
                <kbd style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  color: "#a1a1aa",
                  background: "#ffffff",
                  border: "1px solid #e4e4e7",
                  borderBottomWidth: "2px",
                  borderRadius: "4px",
                  padding: "1px 5px",
                  lineHeight: "17px",
                }}>
                  K
                </kbd>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ── 可滚动区域：目录树 ── */}
      <div className="flex-1 overflow-y-auto scrollbar-autohide" style={{ minHeight: 0 }}>

        <ul style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "0 0 16px" }}>
          {groups.map((group) => {
            const isExpanded = expanded.has(group.name);
            return (
              <li key={group.name}>
                {/* Folder header */}
                <button
                  onClick={() => toggleFolder(group.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "6px 16px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#71717a",
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "var(--font-sans)",
                    textAlign: "left",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#3f3f46"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#71717a"; }}
                >
                  <ChevronRight
                    size={13}
                    style={{
                      marginRight: 6,
                      flexShrink: 0,
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.15s ease",
                      color: "#a1a1aa",
                    }}
                  />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {getFolderDisplayName(group.name)}
                  </span>
                </button>

                {/* Doc list */}
                {isExpanded && (
                  <ul style={{ margin: "2px 16px 0 16px", padding: 0, listStyle: "none" }}>
                    {group.docs.map((doc) => {
                      const isActive = currentSlug === doc.slug;
                      const hasProgress = !isActive && progressSlugs.has(doc.slug);
                      return (
                        <li key={doc.slug}>
                          <Link
                            ref={isActive ? activeLinkRef : undefined}
                            href={`/docs/${doc.slug}`}
                            onClick={() => onNavigate?.(doc.slug)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "6px 16px",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: isActive ? 500 : 400,
                              fontFamily: "var(--font-sans)",
                              color: isActive ? "#18181b" : "#52525b",
                              background: isActive ? "rgba(0, 0, 0, 0.05)" : "transparent",
                              textDecoration: "none",
                              transition: "background 0.15s ease, color 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = "rgba(0, 0, 0, 0.03)";
                                e.currentTarget.style.color = "#3f3f46";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#52525b";
                              }
                            }}
                          >
                            <FileText
                              size={14}
                              style={{
                                color: isActive ? "#18181b" : "#a1a1aa",
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                              {doc.title}
                            </span>
                            {hasProgress && (
                              <span
                                title="有阅读进度"
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "#a1a1aa",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
