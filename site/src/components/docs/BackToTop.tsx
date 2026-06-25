"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed z-[80] flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:opacity-80 back-to-top-button"
      style={{
        bottom: "80px",
        right: "308px",
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text-secondary)",
        border: "1px solid var(--color-border-subtle)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
      }}
      title="回到顶部"
      aria-label="回到顶部"
    >
      <ArrowUp size={18} />
    </button>
  );
}
