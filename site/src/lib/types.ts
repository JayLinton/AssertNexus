export interface DocItem {
  slug: string;
  title: string;
  folder: string;
  fileName: string;
}

export interface FolderGroup {
  name: string;
  order: number;
  docs: DocItem[];
  lastModified?: string; // ISO date string
}

export function getFolderDisplayName(name: string): string {
  return name.replace(/^\d+-/, "");
}
