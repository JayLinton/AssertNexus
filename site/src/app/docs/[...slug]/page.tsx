import { getDocContent, getAllDocs, getCachedRenderedHtml, setCachedRenderedHtml } from "@/lib/docs";
import { renderMarkdown, extractToc } from "@/lib/markdown";
import { getFolderDisplayName } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { DocumentRenderer } from "@/components/docs/DocumentRenderer";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { DocNav } from "@/components/docs/DocNav";
import { ReadingProgress } from "@/components/docs/ReadingProgress";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { notFound } from "next/navigation";
import { config } from "@/site.config";
import type { Metadata } from "next";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function generateStaticParams() {
  const groups = await getAllDocs();
  return groups.flatMap((group) =>
    group.docs.map((doc) => ({
      slug: doc.slug.split("/"),
    }))
  );
}

interface DocsPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { slug: slugParts } = await params;
  const slug = slugParts.map((s) => decodeURIComponent(s)).join("/");
  const content = await getDocContent(slug);
  if (!content) return {};

  const titleMatch = content.match(/^#\s+(.+)/m);
  const title = titleMatch ? titleMatch[1] : slug.split("/").pop() || slug;

  return { title };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug: slugParts } = await params;
  const slug = slugParts.map((s) => decodeURIComponent(s)).join("/");
  const content = await getDocContent(slug);

  if (!content) {
    notFound();
  }

  // Use cached rendered HTML if available, otherwise render and cache
  let html = getCachedRenderedHtml(slug);
  if (!html) {
    html = await renderMarkdown(content);
    setCachedRenderedHtml(slug, html);
  }
  const toc = extractToc(html);

  // 提取文档标题（第一个 H1 标题）
  const titleMatch = content.match(/^#\s+(.+)/m);
  const title = titleMatch ? titleMatch[1] : slug.split('/').pop() || slug;

  // 面包屑：首页 > 分类名 > 文档标题
  const parts = slug.split("/");
  const rawFolder = parts.length > 1 ? parts[0] : undefined;
  const folderName = rawFolder ? getFolderDisplayName(rawFolder) : undefined;
  const breadcrumbs = [
    { label: config.homeLabel, href: "/" },
    ...(folderName && rawFolder ? [{ label: folderName, href: `/folder/${rawFolder}` }] : []),
    { label: title },
  ];

  // 上一篇/下一篇导航
  const groups = await getAllDocs();
  const flatDocs = groups.flatMap((g) => g.docs.map((d) => ({ slug: d.slug, title: d.title })));
  const currentIndex = flatDocs.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? flatDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex >= 0 && currentIndex < flatDocs.length - 1 ? flatDocs[currentIndex + 1] : null;

  return (
    <AppShell currentSlug={slug} breadcrumbs={breadcrumbs}>
      <ReadingProgress slug={slug} />
      <article>
        <DocumentRenderer html={html} />
        <DocNav prev={prevDoc} next={nextDoc} />
      </article>
      <TableOfContents items={toc} />
      <AIAssistant
        docSlug={slug}
        docTitle={title}
      />
    </AppShell>
  );
}
