"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TocItem } from "@/lib/markdown";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);
  const pauseScrollspy = useRef(false);

  // Scroll main page to heading
  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 52; // 44px TopNav + 8px spacing
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  // Scroll the TOC container to keep active item visible
  const scrollTocToActive = useCallback((id: string) => {
    const nav = navRef.current;
    if (!nav) return;
    const link = nav.querySelector(`a[href="#${id}"]`) as HTMLElement | null;
    if (!link) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const linkTop = linkRect.top - navRect.top + nav.scrollTop;
    const linkCenter = linkTop + linkRect.height / 2;
    const navCenter = navRect.height / 2;

    // Only scroll if the active item is outside the visible center zone
    const threshold = navRect.height * 0.3;
    const offset = linkCenter - navCenter;

    if (Math.abs(offset) > threshold) {
      nav.scrollTo({
        top: nav.scrollTop + offset,
        behavior: "smooth",
      });
    }
  }, []);

  // IntersectionObserver for active heading tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (pauseScrollspy.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-60px 0px -80% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  // Auto-scroll TOC container when active item changes
  useEffect(() => {
    if (activeId) {
      scrollTocToActive(activeId);
    }
  }, [activeId, scrollTocToActive]);

  // Handle hash on page load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => scrollToHeading(hash), 100);
    }
  }, [scrollToHeading]);

  // Handle browser back/forward with hash changes
  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.slice(1);
      if (hash) scrollToHeading(hash);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, [scrollToHeading]);

  // Click handler: jump to heading and pause scrollspy
  const handleClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    history.pushState(null, "", `#${id}`);
    setActiveId(id);

    // Pause scrollspy to prevent flickering during smooth scroll
    pauseScrollspy.current = true;
    scrollToHeading(id);
    setTimeout(() => {
      pauseScrollspy.current = false;
    }, 1000);
  }, [scrollToHeading]);

  if (items.length === 0) return null;

  return (
    <nav
      ref={navRef}
      className="hidden lg:block scrollbar-autohide"
      style={{
        position: "fixed",
        right: 24,
        top: 60,
        width: 260,
        maxHeight: "calc(100vh - 80px)",
        overflowY: "auto",
      }}
      aria-label="Table of contents"
    >
      <p
        style={{
          color: "#a39e98",
          fontWeight: 600,
          fontSize: "12px",
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        目录
      </p>
      <ul style={{ display: "flex", flexDirection: "column", gap: "1px", borderLeft: "1px solid rgba(0,0,0,0.06)" }}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          const indent = (item.level - 2) * 16;
          return (
            <li
              key={item.id}
              style={{
                borderLeft: isActive ? "2px solid #18181b" : "2px solid transparent",
                marginLeft: "-1px",
              }}
            >
              <a
                href={`#${item.id}`}
                style={{
                  display: "block",
                  padding: "4px 0 4px 12px",
                  paddingLeft: `${12 + indent}px`,
                  color: isActive ? "#18181b" : "#615d59",
                  fontWeight: isActive ? 500 : 400,
                  fontSize: "14px",
                  lineHeight: "1.5",
                  fontFamily: "var(--font-sans)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  transition: "color 0.15s ease",
                }}
                onClick={(e) => handleClick(e, item.id)}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#3f3f46";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#615d59";
                }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
