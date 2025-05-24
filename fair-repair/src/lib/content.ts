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
  console.log(
    `[content.ts] getContentItemsOfType: Starting for contentType - ${contentType}`
  );
  const directory = path.join(contentDirectory, contentType);
  console.log(
    `[content.ts] getContentItemsOfType: Constructed directory path for ${contentType}: ${directory}`
  );
  if (!fs.existsSync(directory)) {
    console.warn(
      `Directory not found for content type ${contentType}: ${directory}`
    );
    return [];
  }
  // getContentItemsOfType is een functie die alle content items ophaalt van een bepaalde type
  let filePaths = [];
  try {
    filePaths = await glob("**/*.md?(x)", { cwd: directory });
    console.log(
      `[content.ts] getContentItemsOfType: Files found by glob for ${contentType} (${directory}):`,
      filePaths
    );
  } catch (globError) {
    console.error(
      `[content.ts] getContentItemsOfType: Error during glob execution for ${contentType} (${directory}):`,
      globError
    );
    return []; // Return empty if glob fails
  }
  // De glob functie zoekt naar alle markdown bestanden in de directory

  //allContentData is een array van alle content items
  // De map functie leest elk bestand en haalt de frontmatter en content op
  //hiermee kan je bijvoorbeeld de slug, title, date, etc. ophalen van elk bestand
  const allContentData = await Promise.all(
    filePaths.map(async (filePath) => {
      console.log(
        `[content.ts] getContentItemsOfType: Processing file for ${contentType}: ${filePath}. Full path: ${path.join(
          directory,
          filePath
        )}`
      );
      try {
        const slug = filePath
          .replace(/\.mdx?$/, "")
          .toLowerCase()
          .replace(/\s+/g, "-");

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
      } catch (error) {
        console.error(
          `[content.ts] getContentItemsOfType: Error processing file ${filePath} for ${contentType}:`,
          error
        );
        return null; // or some indicator of failure
      }
    })
  );
  console.log(
    `[content.ts] getContentItemsOfType: Raw allContentData for ${contentType} (before filtering nulls):`,
    allContentData
  );
  const validContentData = allContentData.filter(
    (item) => item !== null
  ) as T[];
  console.log(
    `[content.ts] getContentItemsOfType: Processed allContentData for ${contentType} before sorting. Count:`,
    validContentData.length
  );

  return validContentData.sort(
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
  console.log("[content.ts] getAllContentListItems: Starting execution.");
  try {
    const allContentTypes: ContentType[] = [
      "reparatiegidsen",
      "reviews",
      "top-lijsten",
      "tech-uitgelegd",
      "how-to",
      "nieuws",
    ];

    const allItemsArrays = await Promise.all(
      allContentTypes.map(async (type) => {
        console.log(
          "[content.ts] getAllContentListItems: Processing type -",
          type
        );
        console.log(
          "[content.ts] getAllContentListItems: Calling getContentItemsOfType for type -",
          type
        );
        try {
          const items = await getContentItemsOfType<BaseContent>(type);
          console.log(
            "[content.ts] getAllContentListItems: Successfully fetched items for type -",
            type,
            "Count:",
            items.length
          );
          return items;
        } catch (e) {
          console.error(
            "[content.ts] getAllContentListItems: Error fetching items for type -",
            type,
            e
          );
          return []; // Return empty array for this type to allow others to proceed
        }
      })
    );
    console.log(
      "[content.ts] getAllContentListItems: allItemsArrays (results from getContentItemsOfType for each type):",
      JSON.stringify(allItemsArrays, null, 2)
    );

    const flatAllItems = allItemsArrays.flat();
    console.log(
      "[content.ts] getAllContentListItems: flatAllItems (after flattening):",
      JSON.stringify(flatAllItems, null, 2)
    );

    console.log(
      "[content.ts] getAllContentListItems: Preparing to map and sort flatAllItems. Count:",
      flatAllItems.length
    );
    const result = flatAllItems
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
    console.log(
      "[content.ts] getAllContentListItems: Final list before return:",
      JSON.stringify(result, null, 2)
    );
    return result;
  } catch (error) {
    console.error(
      "[content.ts] getAllContentListItems: Error during execution:",
      error
    );
    throw error; // Re-throw the error to see if it's caught elsewhere
  }
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
