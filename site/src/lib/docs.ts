import fs from "fs/promises";
import path from "path";
import { LRUCache } from "lru-cache";
import { config } from "@/site.config";
import type { DocItem, FolderGroup } from "./types";

export type { DocItem, FolderGroup };

const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), config.docsDir);

// ── Memory cache for doc tree with stale-while-revalidate ──
interface CacheEntry {
  groups: FolderGroup[];
  timestamp: number;
}

let docCache: CacheEntry | null = null;
let refreshing = false;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function readDocTree(): Promise<FolderGroup[]> {
  try {
    await fs.access(KNOWLEDGE_BASE_DIR);
  } catch {
    return [];
  }

  const entries = await fs.readdir(KNOWLEDGE_BASE_DIR, { withFileTypes: true });
  const folders = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name));

  const groups: FolderGroup[] = [];

  for (const folder of folders) {
    const folderPath = path.join(KNOWLEDGE_BASE_DIR, folder.name);
    const files = (await fs.readdir(folderPath))
      .filter((f) => f.endsWith(".md"))
      .sort();

    const docs: DocItem[] = files.map((fileName) => {
      const title = fileName.replace(/\.md$/, "").replace(/^\d+-/, "");
      return {
        slug: `${folder.name}/${fileName.replace(/\.md$/, "")}`,
        title,
        folder: folder.name,
        fileName,
      };
    });

    if (docs.length > 0) {
      let latestMtime = 0;
      for (const file of files) {
        const stat = await fs.stat(path.join(folderPath, file));
        if (stat.mtimeMs > latestMtime) latestMtime = stat.mtimeMs;
      }

      const orderMatch = folder.name.match(/^(\d+)/);
      groups.push({
        name: folder.name,
        order: orderMatch ? parseInt(orderMatch[1], 10) : 999,
        docs,
        lastModified: latestMtime ? new Date(latestMtime).toISOString() : undefined,
      });
    }
  }

  return groups.sort((a, b) => a.order - b.order);
}

// Stale-while-revalidate: return cached data immediately, refresh in background
export async function getAllDocs(): Promise<FolderGroup[]> {
  const now = Date.now();

  if (docCache && now - docCache.timestamp < CACHE_TTL) {
    return docCache.groups;
  }

  // Return stale data while refreshing in background
  if (docCache && !refreshing) {
    refreshing = true;
    readDocTree()
      .then((groups) => {
        docCache = { groups, timestamp: Date.now() };
      })
      .catch(() => { /* ignore refresh errors */ })
      .finally(() => {
        refreshing = false;
      });
    return docCache.groups;
  }

  // No cache at all — must wait
  const groups = await readDocTree();
  docCache = { groups, timestamp: now };
  return groups;
}

// ── Rendered HTML cache (LRU, max 200 entries, 10 min TTL) ──
const renderedCache = new LRUCache<string, string>({
  max: 200,
  ttl: 10 * 60 * 1000,
});

export function getCachedRenderedHtml(slug: string): string | undefined {
  return renderedCache.get(slug);
}

export function setCachedRenderedHtml(slug: string, html: string): void {
  renderedCache.set(slug, html);
}

export async function getDocContent(slug: string): Promise<string | null> {
  const mdPath = path.join(KNOWLEDGE_BASE_DIR, `${slug}.md`);
  // Path traversal guard: resolved path must stay inside KNOWLEDGE_BASE_DIR
  const resolved = path.resolve(mdPath);
  if (!resolved.startsWith(path.resolve(KNOWLEDGE_BASE_DIR))) return null;
  try {
    return await fs.readFile(resolved, "utf-8");
  } catch {
    return null;
  }
}

export { getFolderDisplayName } from "./types";
