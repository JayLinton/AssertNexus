"use client";

import { useEffect, useRef } from "react";
import { useHashHighlight } from "@/hooks/useHashHighlight";

interface DocumentRendererProps {
  html: string;
}

export function DocumentRenderer({ html }: DocumentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // SPA-compatible search target highlight
  useHashHighlight();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Transform each <pre><code> into a code-block (no line numbers)
    const codeBlocks = container.querySelectorAll("pre > code");
    codeBlocks.forEach((codeEl) => {
      const pre = codeEl.parentElement;
      if (!pre || pre.closest(".code-block")) return;

      const rawCode = codeEl.textContent || "";

      // Check data-language on <pre> (Shiki) or language-* class on <code> (highlight.js)
      const preLang = pre.getAttribute("data-language") || "";
      const langClass = Array.from(codeEl.classList).find((c) => c.startsWith("language-"));
      const lang = preLang || (langClass ? langClass.replace("language-", "") : "");

      // Build code-block
      const block = document.createElement("div");
      block.className = "code-block";

      // Language label
      if (lang) {
        const label = document.createElement("span");
        label.className = "code-lang-label";
        label.textContent = lang;
        block.appendChild(label);
      }

      // Copy button
      const copyBtn = document.createElement("button");
      copyBtn.className = "code-copy-btn";
      copyBtn.innerHTML = copyIcon;
      copyBtn.title = "复制";
      copyBtn.onclick = async () => {
        await navigator.clipboard.writeText(rawCode);
        copyBtn.classList.add("copied");
        copyBtn.textContent = "已复制";
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          copyBtn.innerHTML = copyIcon;
        }, 1500);
      };
      block.appendChild(copyBtn);

      // Move pre into block, then put block where pre was
      const parent = pre.parentNode;
      const next = pre.nextSibling;
      block.appendChild(pre);
      if (parent) {
        parent.insertBefore(block, next);
      }
    });

    // Wrap tables in overflow container
    const tables = container.querySelectorAll("table");
    tables.forEach((table) => {
      if (table.parentElement?.classList.contains("table-wrapper")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }, [html]);

  return (
    <div className="doc-content">
      <div
        ref={containerRef}
        className="article-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

const copyIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
