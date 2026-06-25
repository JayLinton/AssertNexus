import { getAllDocs } from "@/lib/docs";
import { MainLayout } from "./MainLayout";

interface AppShellProps {
  currentSlug?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
}

/**
 * Server Component that fetches doc tree and wraps MainLayout (client).
 */
export async function AppShell({ currentSlug, breadcrumbs, children }: AppShellProps) {
  const groups = await getAllDocs();

  return (
    <MainLayout groups={groups} currentSlug={currentSlug} breadcrumbs={breadcrumbs}>
      {children}
    </MainLayout>
  );
}
