import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface ContentMetadata {
  slug: string;
  title: string;
  date: string; // ISO format: YYYY-MM-DD
  category: string;
  layoutType: string;
  excerpt?: string;
  featuredImage?: string;
  reparabilityScore?: number;
  //... andere velden uit frontmatter
  [key: string]: any; // Voor overige frontmatter velden
}

export async function getAllContentMetadata(): Promise<ContentMetadata[]> {
  const allContent: ContentMetadata[] = [];
  const categories = fs
    .readdirSync(contentDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const category of categories) {
    const categoryPath = path.join(contentDirectory, category);
    if (!fs.existsSync(categoryPath)) continue; // Sla over als de map niet bestaat

    const fileNames = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".mdx"));

    for (const fileName of fileNames) {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      allContent.push({
        slug,
        category,
        title: typeof data.title === "string" ? data.title : "Geen titel",
        date:
          typeof data.date === "string"
            ? data.date
            : new Date().toISOString().split("T")[0],
        layoutType:
          typeof data.layoutType === "string" ? data.layoutType : "article",
        ...(data as Omit<
          Partial<ContentMetadata>,
          "title" | "date" | "layoutType" | "slug" | "category"
        >),
      });
    }
  }
  return allContent.sort(
    (a: ContentMetadata, b: ContentMetadata) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getContentByCategory(
  category: string
): Promise<ContentMetadata[]> {
  const allContent = await getAllContentMetadata();
  return allContent.filter(
    (item: ContentMetadata) => item.category === category
  );
}

export async function getContentItem(
  category: string,
  slug: string
): Promise<{ metadata: ContentMetadata; content: string } | null> {
  const filePath = path.join(contentDirectory, category, `${slug}.mdx`);
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Content item not found: ${filePath}`);
      return null;
    }
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    return {
      metadata: {
        slug,
        category,
        title: typeof data.title === "string" ? data.title : "Geen titel",
        date:
          typeof data.date === "string"
            ? data.date
            : new Date().toISOString().split("T")[0],
        layoutType:
          typeof data.layoutType === "string" ? data.layoutType : "article",
        ...(data as Omit<
          Partial<ContentMetadata>,
          "title" | "date" | "layoutType" | "slug" | "category"
        >),
      },
      content,
    };
  } catch (error) {
    console.error(`Error reading content item ${category}/${slug}:`, error);
    return null;
  }
}

export async function getAllContentPaths() {
  const allContent = await getAllContentMetadata();
  return allContent.map((item: ContentMetadata) => ({
    category: item.category,
    slug: item.slug,
  }));
}
