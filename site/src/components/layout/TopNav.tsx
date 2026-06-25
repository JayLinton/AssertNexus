"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { config } from "@/site.config";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopNavProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  breadcrumbs?: BreadcrumbItem[];
}

export function TopNav({ sidebarOpen, onToggleSidebar, onOpenSearch, breadcrumbs }: TopNavProps) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // 向下滑动超过 10px → 隐藏
      if (currentY > lastScrollY.current && currentY - lastScrollY.current > 10) {
        setVisible(false);
        clearTimeout(timeoutRef.current);
      }
      // 向上滑动 → 立即显示
      else if (currentY < lastScrollY.current) {
        setVisible(true);
        clearTimeout(timeoutRef.current);
      }

      lastScrollY.current = currentY;

      // 停止滑动 1.5秒后显示
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(true), 1500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Desktop TopNav */}
      <header
        className="sticky top-0 z-30 hidden lg:flex items-center justify-between transition-colors-theme"
        style={{
          height: "44px",
          padding: "0 24px",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Left: hamburger + breadcrumbs */}
        <div className="flex items-center gap-2" style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
          <button
            onClick={onToggleSidebar}
            className="flex items-center justify-center w-8 h-8 rounded-btn transition-colors-theme"
            style={{ color: "var(--color-text)", flexShrink: 0 }}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              style={{
                display: "flex",
                alignItems: "center",
                minWidth: 0,
                overflow: "hidden",
                flex: 1,
              }}
            >
              {breadcrumbs.map((item, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <span key={i} style={{ display: "flex", alignItems: "center", minWidth: 0, flexShrink: i === breadcrumbs.length - 1 ? 1 : 0 }}>
                    {i > 0 && (
                      <ChevronRight
                        size={12}
                        style={{ color: "#d4d4d8", margin: "0 6px", flexShrink: 0 }}
                      />
                    )}
                    {item.href && !isLast ? (
                      <Link
                        href={item.href}
                        style={{
                          fontSize: "13px",
                          fontFamily: "var(--font-sans)",
                          color: "#a1a1aa",
                          textDecoration: "none",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          transition: "color 0.15s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#71717a"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#a1a1aa"; }}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        style={{
                          fontSize: "13px",
                          fontFamily: "var(--font-sans)",
                          fontWeight: isLast ? 500 : 400,
                          color: isLast ? "#3f3f46" : "#a1a1aa",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                          minWidth: 0,
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </span>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right: search */}
        <div className="flex items-center" style={{ flexShrink: 0 }}>
          <button
            onClick={onOpenSearch}
            className="flex items-center justify-center w-8 h-8 rounded-btn transition-colors-theme"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </header>

      {/* Mobile TopNav - logo + brand, auto-hide with scroll */}
      <header
        className="fixed top-0 left-0 right-0 z-30 flex lg:hidden items-center"
        style={{
          height: "52px",
          padding: "0 16px",
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <Link
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
            alt={config.siteName}
            width={24}
            height={24}
            style={{ borderRadius: "4px", flexShrink: 0 }}
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
        </Link>
      </header>
    </>
  );
}
