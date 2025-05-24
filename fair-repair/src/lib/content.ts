// import fs from "fs";
// import path from "path";
// import matter from "gray-matter";

// const contentDirectory = path.join(process.cwd(), "content");

// export interface Post {
//   slug: string;
//   title: string;
//   date: string; // Of Date, afhankelijk van hoe je het verwerkt
//   category: string;
//   image?: string; // Optioneel, als niet elk bericht een afbeelding heeft
//   description?: string; // Optioneel
//   featured?: boolean; // Optioneel, voor uitgelichte berichten
//   // Voeg hier eventuele andere velden toe die je uit je Markdown frontmatter haalt
//   content?: string; // Optioneel, als je de content apart wilt opslaan/verwerken
// }

// export interface ContentMetadata {
//   slug: string;
//   title: string;
//   date: string; // ISO format: YYYY-MM-DD
//   category: string;
//   layoutType: string;
//   excerpt?: string;
//   featuredImage?: string;
//   reparabilityScore?: number;
//   //... andere velden uit frontmatter
//   [key: string]: any; // Voor overige frontmatter velden
// }

// //hiermee kun je de content metadata ophalen
// // Dit is de functie die alle content metadata ophaalt
// //gebruikt op de homepage en in de categorie pagina's
// export async function getAllContentMetadata(): Promise<ContentMetadata[]> {
//   // Hier wordt de content directory gedefinieerd
//   // Dit is de functie die alle content metadata ophaalt
//   const allContent: ContentMetadata[] = [];
//   const categories = fs
//     .readdirSync(contentDirectory, { withFileTypes: true })
//     .filter((dirent) => dirent.isDirectory())
//     .map((dirent) => dirent.name);

//   for (const category of categories) {
//     const categoryPath = path.join(contentDirectory, category);
//     if (!fs.existsSync(categoryPath)) continue; // Sla over als de map niet bestaat

//     const fileNames = fs
//       .readdirSync(categoryPath)
//       .filter((file) => file.endsWith(".mdx"));

//     for (const fileName of fileNames) {
//       const slug = fileName.replace(/\.mdx$/, "");
//       const fullPath = path.join(categoryPath, fileName);
//       const fileContents = fs.readFileSync(fullPath, "utf8");
//       const { data } = matter(fileContents);

//       allContent.push({
//         slug,
//         category,
//         title: typeof data.title === "string" ? data.title : "Geen titel",
//         date:
//           typeof data.date === "string"
//             ? data.date
//             : new Date().toISOString().split("T")[0],
//         layoutType:
//           typeof data.layoutType === "string" ? data.layoutType : "article",
//         ...(data as Omit<
//           Partial<ContentMetadata>,
//           "title" | "date" | "layoutType" | "slug" | "category"
//         >),
//       });
//     }
//   }
//   return allContent.sort(
//     (a: ContentMetadata, b: ContentMetadata) =>
//       new Date(b.date).getTime() - new Date(a.date).getTime()
//   );
// }

// export async function getContentByCategory(
//   category: string
// ): Promise<ContentMetadata[]> {
//   const allContent = await getAllContentMetadata();
//   return allContent.filter(
//     (item: ContentMetadata) => item.category === category
//   );
// }

// // Dit is de functie die een specifieke content item ophaalt
// // gebruikt op de detailpagina's van artikelen, reviews en gidsen
// export async function getContentItem(
//   category: string,
//   slug: string
// ): Promise<{ metadata: ContentMetadata; content: string } | null> {
//   const filePath = path.join(contentDirectory, category, `${slug}.mdx`);
//   try {
//     if (!fs.existsSync(filePath)) {
//       console.warn(`Content item not found: ${filePath}`);
//       return null;
//     }
//     const fileContents = fs.readFileSync(filePath, "utf8");
//     const { data, content } = matter(fileContents);
//     return {
//       metadata: {
//         slug,
//         category,
//         title: typeof data.title === "string" ? data.title : "Geen titel",
//         date:
//           typeof data.date === "string"
//             ? data.date
//             : new Date().toISOString().split("T")[0],
//         layoutType:
//           typeof data.layoutType === "string" ? data.layoutType : "article",
//         ...(data as Omit<
//           Partial<ContentMetadata>,
//           "title" | "date" | "layoutType" | "slug" | "category"
//         >),
//       },
//       content,
//     };
//   } catch (error) {
//     console.error(`Error reading content item ${category}/${slug}:`, error);
//     return null;
//   }
// }

// // Dit is de functie die alle content paden ophaalt
// // gebruikt voor de sitemap en de statische generatie van pagina's
// export async function getAllContentPaths() {
//   const allContent = await getAllContentMetadata();
//   return allContent.map((item: ContentMetadata) => ({
//     category: item.category,
//     slug: item.slug,
//   }));
// }

// src/lib/content.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { glob } from "glob";
import {
  BaseContent,
  Content,
  ContentType,
  Reparatiegids,
  Review,
  TopXList,
  TechUitgelegd,
  HowToGids,
  NieuwsArtikel,
  CategorySlug,
  ContentListItem,
} from "./types";
// De content directory is de map waar al je markdown bestanden staan
const contentDirectory = path.join(process.cwd(), "content");

async function parseMarkdownBody(markdownContent: string): Promise<string> {
  const processedContent = await remark().use(html).process(markdownContent);
  return processedContent.toString();
}
//parseMarkdownBody is een functie die de markdown content omzet naar HTML
async function getContentItemsOfType<T extends BaseContent>(
  contentType: ContentType
): Promise<T[]> {
  const directory = path.join(contentDirectory, contentType);
  if (!fs.existsSync(directory)) {
    console.warn(
      `Directory not found for content type ${contentType}: ${directory}`
    );
    return [];
  }
  // getContentItemsOfType is een functie die alle content items ophaalt van een bepaalde type
  const filePaths = await glob("**/*.md?(x)", { cwd: directory });
  // De glob functie zoekt naar alle markdown bestanden in de directory

  //allContentData is een array van alle content items
  // De map functie leest elk bestand en haalt de frontmatter en content op
  //hiermee kan je bijvoorbeeld de slug, title, date, etc. ophalen van elk bestand
  const allContentData = await Promise.all(
    filePaths.map(async (filePath) => {
      const slug = filePath.replace(/\.mdx?$/, "");

      const fullPath = path.join(directory, filePath);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content: markdownContent } = matter(fileContents);
      const body = await parseMarkdownBody(markdownContent);

      return {
        ...(data as Omit<T, "slug" | "body" | "type">), // Giet de frontmatter naar het deel van T
        slug,
        body,
        type: contentType, // Zet het type expliciet op basis van de map
        date: data.date
          ? new Date(data.date).toISOString()
          : new Date().toISOString(), // Zorg voor ISO string
      } as unknown as T;
    })
  );

  return allContentData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export const getAllReparatiegidsen = () =>
  getContentItemsOfType<Reparatiegids>("reparatiegidsen");
export const getAllReviews = () => getContentItemsOfType<Review>("reviews");
export const getAllTopXLijsten = () =>
  getContentItemsOfType<TopXList>("top-lijsten");
export const getAllTechUitgelegd = () =>
  getContentItemsOfType<TechUitgelegd>("tech-uitgelegd");
export const getAllHowToGidsen = () =>
  getContentItemsOfType<HowToGids>("how-to");
export const getAllNieuwsArtikelen = async (): Promise<NieuwsArtikel[]> => {
  const manualNews = await getContentItemsOfType<NieuwsArtikel>("nieuws");
  // TODO: Voeg hier API nieuws toe en merge/sorteer
  return manualNews;
};

export async function getContentItemBySlugAndType<T extends Content>(
  contentType: ContentType,
  slug: string
): Promise<T | undefined> {
  const items = (await getContentItemsOfType<BaseContent>(contentType)) as T[];
  return items.find((item) => item.slug === slug);
}
// getContentItemBySlugAndType is een functie die een specifiek content item ophaalt op basis van de slug en het type

// getAllContentListItems is een functie die alle content items ophaalt en deze omzet naar een lijst van ContentListItem
// wanneer je een overzicht van alle content-items uit verschillende contenttypes wilt tonen, bijvoorbeeld op je homepage
export async function getAllContentListItems(): Promise<ContentListItem[]> {
  const allContentTypes: ContentType[] = [
    "reparatiegidsen",
    "reviews",
    "top-lijsten",
    "tech-uitgelegd",
    "how-to",
    "nieuws",
  ];

  const allItemsArrays = await Promise.all(
    allContentTypes.map((type) => getContentItemsOfType<BaseContent>(type))
  );

  const flatAllItems = allItemsArrays.flat();

  return flatAllItems
    .map(
      (item) =>
        ({
          slug: item.slug,
          title: item.title,
          date: item.date,
          summary: item.summary,
          image: item.image,
          type: item.type as ContentType, // item.type zou al ContentType moeten zijn
          productCategory: item.productCategory,
        } as ContentListItem)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

//Voor categoriepagina’s waar je alleen content van een bepaalde productgroep wilt tonen.
export async function getContentListItemsByProductCategory(
  productCategory: CategorySlug
): Promise<ContentListItem[]> {
  const allItems = await getAllContentListItems();
  return allItems.filter((item) => item.productCategory === productCategory);
}

// Voor generateStaticParams
export async function getAllSlugsForContentType(
  contentType: ContentType
): Promise<Array<{ slug: string }>> {
  const items = await getContentItemsOfType<BaseContent>(contentType);
  return items.map((item) => ({
    slug: item.slug,
  }));
}
