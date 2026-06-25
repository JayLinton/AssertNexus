"use client";

import Link from "next/link";
import { FolderOpen, FileText } from "lucide-react";
import type { FolderGroup } from "@/lib/types";
import { getFolderDisplayName } from "@/lib/types";

interface FolderCardProps {
  group: FolderGroup;
}

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

export function FolderCard({ group }: FolderCardProps) {
  const displayName = getFolderDisplayName(group.name);
  const relDate = formatRelativeDate(group.lastModified);

  return (
    <div
      className="block rounded-card p-6 transition-all duration-200 ease-out group"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      {/* Icon + Title — links to folder overview */}
      <Link
        href={`/folder/${group.name}`}
        style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, textDecoration: "none" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#f4f4f5",
            flexShrink: 0,
          }}
        >
          <FolderOpen size={18} style={{ color: "#71717a" }} />
        </div>
        <h3
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#18181b",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "1.4",
            fontFamily: "var(--font-sans)",
            margin: 0,
          }}
        >
          {displayName}
        </h3>
      </Link>

      {/* Description: doc count + last modified */}
      <p
        style={{
          color: "#71717a",
          fontSize: "13px",
          lineHeight: "1.5",
          fontFamily: "var(--font-sans)",
          margin: "0 0 16px 0",
        }}
      >
        {group.docs.length} 篇文档
        {relDate && (
          <span style={{ color: "#a1a1aa", marginLeft: 8 }}>
            · {relDate}更新
          </span>
        )}
      </p>

      {/* Doc list preview — each links to its doc */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {group.docs.slice(0, 3).map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#71717a",
              fontSize: "14px",
              lineHeight: "1.5",
              fontFamily: "var(--font-sans)",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#18181b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#71717a"; }}
          >
            <FileText size={13} style={{ flexShrink: 0, opacity: 0.5 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {doc.title}
            </span>
          </Link>
        ))}
        {group.docs.length > 3 && (
          <Link
            href={`/folder/${group.name}`}
            style={{
              color: "#a1a1aa",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              textDecoration: "none",
            }}
          >
            +{group.docs.length - 3} 更多
          </Link>
        )}
      </div>
    </div>
  );
}
