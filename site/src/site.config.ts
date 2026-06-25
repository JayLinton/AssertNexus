/**
 * Site configuration — edit this file to customize the knowledge base.
 * All hardcoded values across the app are sourced from here.
 *
 * For self-hosted deployment, use environment variables:
 * - SITE_NAME: Site name (default: "Assert Nexus")
 * - SITE_DESCRIPTION: Site description
 * - AI_API_KEY: DeepSeek API key (optional, hides AI if empty)
 * - AI_MODEL: AI model name (default: "deepseek-chat")
 * - AI_NAME: AI assistant display name (default: "Mock")
 * - DOCS_PATH: Path to docs directory (default: "../knowledge-base")
 */

// Helper to split site name for styling (e.g., "Assert Nexus" → ["Assert", "Nexus"])
function splitSiteName(name: string): { bold: string; light: string } {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return { bold: parts[0], light: parts.slice(1).join(" ") };
  }
  return { bold: name, light: "" };
}

const siteName = process.env.SITE_NAME || "Assert Nexus";
const { bold: siteNameBold, light: siteNameLight } = splitSiteName(siteName);

export const config = {
  // ── Site metadata ──
  siteName,
  siteNameBold,
  siteNameLight,
  description: process.env.SITE_DESCRIPTION || "测试工程师学习笔记与实践总结",
  titleTemplate: `%s | ${siteName}`,
  titleDefault: `${siteName} | 知识库`,

  // ── UI labels ──
  homeLabel: "首页",
  searchPlaceholder: "搜索文档...",
  docTreeLabel: "文档目录",
  footer: `© 2026 ${siteName}. All rights reserved.`,

  // ── AI assistant ──
  aiName: process.env.AI_NAME || "Mock",
  aiSubtitle: `基于 ${siteName} 为您解答`,
  aiToolbarLabel: `${process.env.AI_NAME || "Mock"} 解释`,
  aiFavicon: "/framer.svg",
  aiApiKey: process.env.AI_API_KEY || "",
  aiModel: process.env.AI_MODEL || "deepseek-chat",

  // ── Assets ──
  logo: "/favicon.png",
  favicon: "/favicon.png",

  // ── Content ──
  docsDir: process.env.DOCS_PATH || "../knowledge-base",  // relative to site/ directory or absolute path
} as const;
