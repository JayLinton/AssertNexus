import { getAllDocs } from "@/lib/docs";
import { getFolderDisplayName } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { FolderOverview } from "@/components/docs/FolderOverview";
import { notFound } from "next/navigation";
import { config } from "@/site.config";
import type { Metadata } from "next";

export const revalidate = 300;

interface FolderPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: FolderPageProps): Promise<Metadata> {
  const { slug: slugParts } = await params;
  const folderName = slugParts.map((s) => decodeURIComponent(s)).join("/");
  const displayName = getFolderDisplayName(folderName);
  return { title: `${displayName} | ${config.siteName}` };
}

export async function generateStaticParams() {
  const groups = await getAllDocs();
  return groups.map((g) => ({ slug: [g.name] }));
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { slug: slugParts } = await params;
  const folderName = slugParts.map((s) => decodeURIComponent(s)).join("/");

  const groups = await getAllDocs();
  const group = groups.find((g) => g.name === folderName);

  if (!group) {
    notFound();
  }

  const displayName = getFolderDisplayName(group.name);
  const breadcrumbs = [
    { label: config.homeLabel, href: "/" },
    { label: displayName },
  ];

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      <FolderOverview group={group} />
    </AppShell>
  );
}
