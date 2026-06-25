"use client";

import Link from "next/link";
import { FileText, FolderOpen } from "lucide-react";
import { getFolderDisplayName, type FolderGroup } from "@/lib/types";

function formatRelativeDate(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月前`;
  return `${Math.floor(diffDays / 365)} 年前`;
}

export function FolderOverview({ group }: { group: FolderGroup }) {
  const displayName = getFolderDisplayName(group.name);
  const relDate = formatRelativeDate(group.lastModified);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#f4f4f5",
              flexShrink: 0,
            }}
          >
            <FolderOpen size={22} style={{ color: "#71717a" }} />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              color: "#18181b",
              letterSpacing: "-0.02em",
            }}
          >
            {displayName}
          </h1>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#a1a1aa",
            fontFamily: "var(--font-sans)",
          }}
        >
          {group.docs.length} 篇文档
          {relDate && <span style={{ marginLeft: 8 }}>· {relDate}更新</span>}
        </p>
      </div>

      {/* Doc list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {group.docs.map((doc, index) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#a1a1aa",
                fontFamily: "var(--font-mono)",
                width: 24,
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {index + 1}
            </span>
            <FileText size={16} style={{ color: "#a1a1aa", flexShrink: 0 }} />
            <span
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: "#18181b",
                fontFamily: "var(--font-sans)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {doc.title}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "12px",
                color: "#a1a1aa",
                fontFamily: "var(--font-sans)",
                flexShrink: 0,
              }}
            >
              {doc.fileName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
