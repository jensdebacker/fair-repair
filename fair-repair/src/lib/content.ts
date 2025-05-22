import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface Post {
  slug: string;
  title: string;
  date: string; // Of Date, afhankelijk van hoe je het verwerkt
  category: string;
  image?: string; // Optioneel, als niet elk bericht een afbeelding heeft
  description?: string; // Optioneel
  featured?: boolean; // Optioneel, voor uitgelichte berichten
  // Voeg hier eventuele andere velden toe die je uit je Markdown frontmatter haalt
  content?: string; // Optioneel, als je de content apart wilt opslaan/verwerken
}

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

//hiermee kun je de content metadata ophalen
// Dit is de functie die alle content metadata ophaalt
//gebruikt op de homepage en in de categorie pagina's
export async function getAllContentMetadata(): Promise<ContentMetadata[]> {
  // Hier wordt de content directory gedefinieerd
  // Dit is de functie die alle content metadata ophaalt
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

// Dit is de functie die een specifieke content item ophaalt
// gebruikt op de detailpagina's van artikelen, reviews en gidsen
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

// Dit is de functie die alle content paden ophaalt
// gebruikt voor de sitemap en de statische generatie van pagina's
export async function getAllContentPaths() {
  const allContent = await getAllContentMetadata();
  return allContent.map((item: ContentMetadata) => ({
    category: item.category,
    slug: item.slug,
  }));
}
