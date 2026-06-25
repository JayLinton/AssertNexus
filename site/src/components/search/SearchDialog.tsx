"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, FileText, ArrowRight, X } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

interface SearchResult {
  slug: string;
  title: string;
  folder: string;
  snippet: string;
  headingId?: string;
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Lock body scroll (shared with MobileDrawer)
  useScrollLock(open);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setActiveIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.nativeEvent.isComposing) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        const result = results[activeIndex];
        const hash = result.headingId ? `#${result.headingId}` : "";
        window.location.href = `/docs/${result.slug}${hash}`;
        onClose();
      }
    },
    [results, activeIndex, onClose]
  );

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[activeIndex] as HTMLElement;
    if (item) item.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop — frosted glass */}
      <div
        className="fixed inset-0 z-[60]"
        style={{
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="fixed z-[70] left-1/2 top-[15vh] w-full max-w-[560px] -translate-x-1/2 animate-fade-in"
        style={{ padding: "0 16px" }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
          }}
        >
          {/* Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 16px",
              height: "52px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <Search size={16} style={{ color: "#a1a1aa", flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索文档..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "15px",
                fontFamily: "var(--font-sans)",
                color: "#18181b",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "4px",
                  border: "none",
                  background: "transparent",
                  color: "#a1a1aa",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </button>
            )}
            <kbd
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                color: "#71717a",
                background: "#f4f4f5",
                border: "1px solid #e4e4e7",
                borderBottomWidth: "2px",
                borderRadius: "5px",
                padding: "2px 6px",
                lineHeight: "16px",
                letterSpacing: "0.02em",
              }}
            >
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            style={{ overflowY: "auto", maxHeight: "400px" }}
          >
            {!query.trim() && (
              <div
                style={{
                  padding: "40px 16px",
                  textAlign: "center",
                  color: "#a1a1aa",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                输入关键词开始搜索
              </div>
            )}

            {query.trim() && loading && (
              <div
                style={{
                  padding: "40px 16px",
                  textAlign: "center",
                  color: "#a1a1aa",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                搜索中...
              </div>
            )}

            {query.trim() && !loading && results.length === 0 && (
              <div
                style={{
                  padding: "40px 16px",
                  textAlign: "center",
                  color: "#a1a1aa",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                未找到匹配结果
              </div>
            )}

            <div style={{ padding: "6px 8px" }}>
              {results.map((result, i) => {
                const isActive = i === activeIndex;
                const hash = result.headingId ? `#${result.headingId}` : "";
                return (
                  <a
                    key={result.slug}
                    href={`/docs/${result.slug}${hash}`}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: isActive ? "#f4f4f5" : "transparent",
                      textDecoration: "none",
                      transition: "background 0.1s ease",
                      marginBottom: i < results.length - 1 ? "2px" : "0",
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <FileText
                      size={15}
                      style={{
                        color: isActive ? "#71717a" : "#a1a1aa",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "#18181b",
                            fontSize: "14px",
                            fontWeight: isActive ? 500 : 400,
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {result.title}
                        </span>
                        <span
                          style={{
                            flexShrink: 0,
                            fontSize: "11px",
                            fontFamily: "var(--font-sans)",
                            color: "#71717a",
                            background: "#f4f4f5",
                            borderRadius: "9999px",
                            padding: "1px 8px",
                            lineHeight: "18px",
                          }}
                        >
                          {result.folder}
                        </span>
                      </div>
                      {result.snippet && (
                        <p
                          style={{
                            marginTop: "3px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "#a1a1aa",
                            fontSize: "13px",
                            lineHeight: "1.4",
                            fontFamily: "var(--font-sans)",
                            margin: "3px 0 0 0",
                          }}
                          dangerouslySetInnerHTML={{ __html: result.snippet }}
                        />
                      )}
                    </div>
                    {isActive && (
                      <ArrowRight
                        size={14}
                        style={{ color: "#a1a1aa", flexShrink: 0 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer hint */}
          {results.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "8px 16px",
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                fontSize: "12px",
                color: "#a1a1aa",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span>↑↓ 导航</span>
              <span>↵ 打开</span>
              <span>ESC 关闭</span>
              <span style={{ marginLeft: "auto" }}>{results.length} 个结果</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
