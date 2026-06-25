import { NextResponse } from "next/server";
import GithubSlugger from "github-slugger";
import { pinyin } from "pinyin-pro";
import { getAllDocs, getDocContent } from "@/lib/docs";

interface HeadingInfo {
  id: string;
  position: number; // character offset in content
}

interface CachedFile {
  title: string;
  titlePinyin: string;     // 全拼，如 "shuxuezhengming"
  titlePinyinAbbr: string; // 首字母，如 "szm"
  folder: string;
  content: string;
  headings: HeadingInfo[];
}

interface SearchResult {
  slug: string;
  title: string;
  folder: string;
  snippet: string;
  headingId?: string;
}

// ── Memory cache for search index ──
let fileCache: Map<string, CachedFile> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function extractHeadings(content: string): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const slugger = new GithubSlugger();
  const lines = content.split("\n");
  let offset = 0;

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (match) {
      const text = match[2].replace(/[*_`~\[\]]/g, "").trim();
      headings.push({
        id: slugger.slug(text),
        position: offset,
      });
    }
    offset += line.length + 1; // +1 for newline
  }

  return headings;
}

function toPinyin(text: string): { full: string; abbr: string } {
  try {
    const full = pinyin(text, { toneType: "none", type: "array" }).join("");
    const abbr = pinyin(text, { pattern: "first", toneType: "none", type: "array" }).join("");
    return { full: full.toLowerCase(), abbr: abbr.toLowerCase() };
  } catch {
    return { full: "", abbr: "" };
  }
}

async function buildIndex(): Promise<Map<string, CachedFile>> {
  const index = new Map<string, CachedFile>();
  const groups = await getAllDocs();

  for (const group of groups) {
    for (const doc of group.docs) {
      const content = await getDocContent(doc.slug);
      if (!content) continue;

      const { full, abbr } = toPinyin(doc.title);

      index.set(doc.slug, {
        title: doc.title,
        titlePinyin: full,
        titlePinyinAbbr: abbr,
        folder: group.name.replace(/^\d+-/, ""),
        content,
        headings: extractHeadings(content),
      });
    }
  }

  return index;
}

async function getFileIndex(): Promise<Map<string, CachedFile>> {
  const now = Date.now();
  if (fileCache && now - cacheTimestamp < CACHE_TTL) {
    return fileCache;
  }
  fileCache = await buildIndex();
  cacheTimestamp = now;
  return fileCache;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getSnippetWithHeading(
  content: string,
  query: string,
  headings: HeadingInfo[]
): { snippet: string; headingId?: string } {
  const lower = content.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) {
    return { snippet: escapeHtml(content.slice(0, 120).trim()) + "..." };
  }

  // Find nearest heading before the match
  let headingId: string | undefined;
  for (let i = headings.length - 1; i >= 0; i--) {
    if (headings[i].position <= idx) {
      headingId = headings[i].id;
      break;
    }
  }

  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + query.length + 80);
  let snippet = content.slice(start, end).trim();

  // Clean up markdown syntax FIRST, then find match position in cleaned text
  const cleaned = snippet.replace(/#{1,6}\s/g, "").replace(/[*_`~]/g, "");

  // Re-find the query in the cleaned snippet to get correct highlight positions
  const cleanedLower = cleaned.toLowerCase();
  const queryLower = query.toLowerCase();
  const matchStart = cleanedLower.indexOf(queryLower);

  if (matchStart === -1) {
    // Fallback: just escape and return without highlight
    snippet = escapeHtml(cleaned);
  } else {
    const matchEnd = matchStart + query.length;
    const before = escapeHtml(cleaned.slice(0, matchStart));
    const match = escapeHtml(cleaned.slice(matchStart, matchEnd));
    const after = escapeHtml(cleaned.slice(matchEnd));
    snippet = `${before}<mark>${match}</mark>${after}`;
  }

  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return { snippet, headingId };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 1 || q.length > 200) {
    return NextResponse.json({ results: [] });
  }

  const index = await getFileIndex();
  const query = q.toLowerCase();
  const results: SearchResult[] = [];

  // Check if query looks like pinyin (only ASCII letters)
  const isPinyinQuery = /^[a-z]+$/.test(query);

  index.forEach((file, slug) => {
    const titleMatch = file.title.toLowerCase().includes(query);
    const contentMatch = file.content.toLowerCase().includes(query);

    // Pinyin matching: full pinyin or abbreviation
    let pinyinTitleMatch = false;
    if (isPinyinQuery && !titleMatch && !contentMatch) {
      pinyinTitleMatch =
        file.titlePinyin.includes(query) ||
        file.titlePinyinAbbr.includes(query);
    }

    if (titleMatch || contentMatch || pinyinTitleMatch) {
      const { snippet, headingId } = contentMatch
        ? getSnippetWithHeading(file.content, q, file.headings)
        : { snippet: "", headingId: undefined };

      results.push({
        slug,
        title: file.title,
        folder: file.folder,
        snippet,
        headingId,
      });
    }
  });

  // Sort: title matches first, then pinyin title matches, then by folder order
  results.sort((a, b) => {
    const getRank = (r: SearchResult) => {
      if (r.title.toLowerCase().includes(query)) return 0;
      if (isPinyinQuery) {
        const f = index.get(r.slug);
        if (f && (f.titlePinyin.includes(query) || f.titlePinyinAbbr.includes(query))) return 1;
      }
      return 2;
    };
    const aRank = getRank(a);
    const bRank = getRank(b);
    if (aRank !== bRank) return aRank - bRank;
    return a.folder.localeCompare(b.folder);
  });

  return NextResponse.json({ results: results.slice(0, 20) });
}
