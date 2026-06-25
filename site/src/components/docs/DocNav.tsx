"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavItem {
  slug: string;
  title: string;
}

interface DocNavProps {
  prev?: NavItem | null;
  next?: NavItem | null;
}

export function DocNav({ prev, next }: DocNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      style={{
        maxWidth: 720,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        gap: 16,
        marginTop: 48,
        paddingTop: 24,
        borderTop: "1px solid #e4e4e7",
      }}
      aria-label="文档导航"
    >
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderRadius: 10,
            border: "1px solid #e4e4e7",
            textDecoration: "none",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e4e4e7";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <ChevronLeft size={16} style={{ color: "#a1a1aa", flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "12px", color: "#a1a1aa", fontFamily: "var(--font-sans)", marginBottom: 2 }}>
              上一篇
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#18181b",
              fontFamily: "var(--font-sans)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {prev.title}
            </div>
          </div>
        </Link>
      ) : <div style={{ flex: 1 }} />}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
            padding: "14px 16px",
            borderRadius: 10,
            border: "1px solid #e4e4e7",
            textDecoration: "none",
            textAlign: "right",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e4e4e7";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "12px", color: "#a1a1aa", fontFamily: "var(--font-sans)", marginBottom: 2 }}>
              下一篇
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#18181b",
              fontFamily: "var(--font-sans)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {next.title}
            </div>
          </div>
          <ChevronRight size={16} style={{ color: "#a1a1aa", flexShrink: 0 }} />
        </Link>
      ) : <div style={{ flex: 1 }} />}
    </nav>
  );
}
