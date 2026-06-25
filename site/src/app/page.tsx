import { getAllDocs } from "@/lib/docs";
import { AppShell } from "@/components/layout/AppShell";
import { FolderCard } from "@/components/FolderCard";
import { FileText } from "lucide-react";
import { config } from "@/site.config";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function Home() {
  const groups = await getAllDocs();
  const totalDocs = groups.reduce((sum, g) => sum + g.docs.length, 0);

  return (
    <AppShell breadcrumbs={[{ label: config.homeLabel }]}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <h1 className="hero-title" style={{ margin: 0, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            <span style={{
              fontWeight: 800,
              fontFamily: "var(--font-sans)",
              color: "#18181b",
            }}>
              {config.siteNameBold}
            </span>
            <span style={{
              fontWeight: 300,
              fontFamily: "var(--font-sans)",
              color: "#71717a",
              marginLeft: 10,
            }}>
              {config.siteNameLight}
            </span>
          </h1>
          <p
            style={{
              color: "#a1a1aa",
              fontSize: "16px",
              lineHeight: 1.75,
              fontFamily: "var(--font-sans)",
              maxWidth: "600px",
              marginTop: 10,
            }}
          >
            {config.description}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 9999,
                background: "#f4f4f5",
                color: "#3f3f46",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
              }}
            >
              <FileText size={12} />
              {totalDocs} 篇文档
            </span>
            <span
              style={{
                color: "#a1a1aa",
                fontSize: "14px",
                fontFamily: "var(--font-sans)",
              }}
            >
              {groups.length} 个分类
            </span>
          </div>
        </div>

        {/* Folder grid: 3 col desktop / 2 col tablet / 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group) => (
            <FolderCard key={group.name} group={group} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
