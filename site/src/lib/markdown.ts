import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize from "rehype-sanitize";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let processorInstance: any = null;

function getProcessor() {
  if (!processorInstance) {
    processorInstance = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeSanitize)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: "wrap",
        properties: {
          className: ["heading-anchor"],
        },
      })
      .use(rehypePrettyCode, {
        theme: "vitesse-light",
        keepBackground: false,
      })
      .use(rehypeStringify);
  }
  return processorInstance;
}

export async function renderMarkdown(content: string): Promise<string> {
  // Pre-process: convert [!type] callout syntax in blockquotes to HTML divs
  let processed = content;

  const calloutRegex = /^(>\s*\[!(info|warning|success|error|tip)\]\s*[\s\S]*?)(?=\n[^>]|\n$|$)/gm;
  processed = processed.replace(calloutRegex, (match, _: string, type: string) => {
    const lines = match.split("\n").map((line: string) => line.replace(/^>\s?/, ""));
    const inner = lines.join("\n").replace(/^\[!\w+\]\s*/, "");
    return `<div class="callout callout-${type}" data-callout="${type}">${inner}</div>`;
  });

  const result = await getProcessor().process(processed);
  return String(result);
}

export interface TocItem {
  id: string;
  text: string;
  level: number; // 2, 3, 4
}

/**
 * Extract TOC from rendered HTML.
 * This guarantees IDs match exactly what rehype-slug generates.
 */
export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const headingRegex = /<h([2-4])\s+id="([^"]*)"[^>]*>([\s\S]*?)<\/h[2-4]>/gi;
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    // Strip HTML tags from heading text
    const text = match[3].replace(/<[^>]*>/g, "").trim();
    if (id && text) {
      items.push({ id, text, level });
    }
  }

  return items;
}
