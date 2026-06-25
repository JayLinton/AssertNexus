"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { List, Search, ArrowUp } from "lucide-react";
import { config } from "@/site.config";

interface MobileBottomBarProps {
  onToggleToc: () => void;
  onOpenSearch: () => void;
  tocOpen: boolean;
  docSlug?: string;
  docTitle?: string;
}

export function MobileBottomBar({ onToggleToc, onOpenSearch, tocOpen, docSlug, docTitle }: MobileBottomBarProps) {
  const chatUrl = docSlug
    ? `/chat?doc=${encodeURIComponent(docSlug)}&title=${encodeURIComponent(docTitle || '')}`
    : '/chat';

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowBackToTop(currentY > 300);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-around lg:hidden"
      style={{
        height: "56px",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderTop: "1px solid rgba(0, 0, 0, 0.06)",
        paddingBottom: "env(safe-area-inset-bottom)",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s ease",
      }}
    >
      {/* 目录按钮 */}
      <button
        onClick={onToggleToc}
        className="flex flex-col items-center justify-center gap-0.5"
        style={{
          flex: 1,
          height: "100%",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: tocOpen ? "var(--color-text)" : "var(--color-text-secondary)",
        }}
        aria-label={tocOpen ? "关闭目录" : "打开目录"}
      >
        <List size={20} />
        <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 500 }}>目录</span>
      </button>

      {/* 搜索按钮 */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center gap-0.5"
        style={{
          flex: 1,
          height: "100%",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "var(--color-text-secondary)",
        }}
        aria-label="搜索"
      >
        <Search size={20} />
        <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 500 }}>搜索</span>
      </button>

      {/* AI 按钮 */}
      <Link
        href={chatUrl}
        className="flex flex-col items-center justify-center gap-0.5"
        style={{
          flex: 1,
          height: "100%",
          textDecoration: "none",
          color: "var(--color-text-secondary)",
        }}
        aria-label="AI 助手"
      >
        <img
          src={config.aiFavicon}
          alt={config.aiName}
          width={20}
          height={20}
          style={{ filter: "brightness(0.3)" }}
        />
        <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 500 }}>{config.aiName}</span>
      </Link>

      {/* 回到顶部按钮 */}
      <button
        onClick={scrollToTop}
        className="flex flex-col items-center justify-center gap-0.5"
        style={{
          flex: 1,
          height: "100%",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "var(--color-text-secondary)",
          opacity: showBackToTop ? 1 : 0.3,
          transition: "opacity 0.2s ease",
        }}
        aria-label="回到顶部"
      >
        <ArrowUp size={20} />
        <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 500 }}>顶部</span>
      </button>
    </nav>
  );
}
