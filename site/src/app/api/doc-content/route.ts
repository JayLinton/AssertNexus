import { NextResponse } from "next/server";
import { getDocContent } from "@/lib/docs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const content = await getDocContent(slug);
  if (!content) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Truncate to 8000 chars to match previous behavior
  return NextResponse.json({ content: content.substring(0, 8000) });
}
