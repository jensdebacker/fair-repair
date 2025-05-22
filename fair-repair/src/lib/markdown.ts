// lib/markdown.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { PostFrontMatter, ArticlePost, GuidePost } from "./types"; // Gebruik de nieuwe types

const contentDirectory = path.join(process.cwd(), "content");

// Helper: Recursief Markdown bestanden vinden in een directorystructuur
function getAllMarkdownFiles(
  dirPath: string,
  baseDir: string,
  arrayOfFiles: { filePath: string; pathSegments: string[] }[] = []
): { filePath: string; pathSegments: string[] }[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllMarkdownFiles(fullPath, baseDir, arrayOfFiles);
    } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
      // pathSegments zijn de mappen tussen baseDir en het bestand, bv. ["how-to"]
      const relativeToTypeDir = path.relative(baseDir, path.dirname(fullPath));
      const segments = relativeToTypeDir
        ? relativeToTypeDir.split(path.sep)
        : [];
      arrayOfFiles.push({ filePath: fullPath, pathSegments: segments });
    }
  });
  return arrayOfFiles;
}

// Artikelen ophalen (met submappen)
export function getSortedArticleMetadata(): ArticlePost[] {
  const articlesBaseDirectory = path.join(contentDirectory, "articles");
  const articleFilesInfo = getAllMarkdownFiles(
    articlesBaseDirectory,
    articlesBaseDirectory
  );

  const allArticleData = articleFilesInfo.map(({ filePath, pathSegments }) => {
    const fileNameWithExt = path.basename(filePath);
    const slugFromFile = fileNameWithExt.replace(/\.(md|mdx)$/, "");

    const slugSegments = [...pathSegments, slugFromFile]; // bv. ["how-to", "artikelnaam"]
    const fullSlug = slugSegments.join("/"); // bv. "how-to/artikelnaam"
    const categoryPath = pathSegments.join("/") || ""; // bv. "how-to" of "" als direct in articles/

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents); // content hier alvast parsen voor later

    // Zorg dat frontmatter.category overeenkomt met de mapstructuur of vul aan
    const frontmatterData = data as PostFrontMatter;
    if (!frontmatterData.category && pathSegments.length > 0) {
      frontmatterData.category = pathSegments[0]; // Neem eerste map als categorie indien niet gespecificeerd
    }
    frontmatterData.layoutType = "article"; // Zeker stellen

    return {
      ...frontmatterData,
      slugSegments,
      fullSlug,
      categoryPath,
      // contentHtml wordt hier nog niet gegenereerd om de lijst snel te houden
      // We voegen een placeholder toe of doen dit alleen in getArticleData
      contentHtml: "", // Of verwijder als je dit type strikt houdt voor metadata-only
    } as Omit<ArticlePost, "contentHtml"> & { contentHtml?: string }; // Tijdelijk Omit
  });

  // @ts-ignore
  return allArticleData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ) as ArticlePost[];
}

// Gidsen ophalen (structuur ongewijzigd)
export function getSortedGuideMetadata(): Omit<GuidePost, "contentHtml">[] {
  const guidesDirectory = path.join(contentDirectory, "guides");
  if (!fs.existsSync(guidesDirectory)) return [];

  const fileNames = fs
    .readdirSync(guidesDirectory)
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"));
  const allGuideData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.(md|mdx)$/, "");
    const fullPath = path.join(guidesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    (data as PostFrontMatter).layoutType = "guide";

    return {
      ...(data as PostFrontMatter),
      slug,
    };
  });
  // @ts-ignore
  return allGuideData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ) as Omit<GuidePost, "contentHtml">[];
}

// Specifiek artikel ophalen
export async function getArticleData(
  slugSegments: string[]
): Promise<ArticlePost> {
  const articleFilePath =
    path.join(contentDirectory, "articles", ...slugSegments) + ".md";
  // Voeg .mdx fallback toe indien nodig
  if (!fs.existsSync(articleFilePath)) {
    const mdxFilePath =
      path.join(contentDirectory, "articles", ...slugSegments) + ".mdx";
    if (!fs.existsSync(mdxFilePath))
      throw new Error(`Article not found: articles/${slugSegments.join("/")}`);
    // Logic for mdxFilePath
  }

  const fileContents = fs.readFileSync(articleFilePath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  const frontmatterData = data as PostFrontMatter;
  if (!frontmatterData.category && slugSegments.length > 1) {
    frontmatterData.category = slugSegments[0]; // Eerste segment als categorie
  }
  frontmatterData.layoutType = "article";

  return {
    ...frontmatterData,
    slugSegments,
    fullSlug: slugSegments.join("/"),
    categoryPath: slugSegments.slice(0, -1).join("/"),
    contentHtml,
  } as ArticlePost;
}

// Specifieke gids ophalen
export async function getGuideData(slug: string): Promise<GuidePost> {
  const guideFilePath = path.join(contentDirectory, "guides", `${slug}.md`);
  if (!fs.existsSync(guideFilePath)) {
    const mdxFilePath = path.join(contentDirectory, "guides", `${slug}.mdx`);
    if (!fs.existsSync(mdxFilePath))
      throw new Error(`Guide not found: guides/${slug}`);
    // Logic for mdxFilePath
  }
  const fileContents = fs.readFileSync(guideFilePath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();
  (data as PostFrontMatter).layoutType = "guide";

  return {
    ...(data as PostFrontMatter),
    slug,
    contentHtml,
  } as GuidePost;
}

// Alle content metadata (voor homepage lijsten etc.)
export function getAllContentMetadataForLists(): (
  | Omit<ArticlePost, "contentHtml">
  | Omit<GuidePost, "contentHtml">
)[] {
  const articles = getSortedArticleMetadata();
  const guides = getSortedGuideMetadata();
  // @ts-ignore
  return [...articles, ...guides].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Voor generateStaticParams in artikelpagina's
export function getAllArticleSlugsForStaticParams(): {
  params: { slug: string[] };
}[] {
  const articlesBaseDirectory = path.join(contentDirectory, "articles");
  const articleFilesInfo = getAllMarkdownFiles(
    articlesBaseDirectory,
    articlesBaseDirectory
  );

  return articleFilesInfo.map(({ filePath, pathSegments }) => {
    const fileNameWithExt = path.basename(filePath);
    const slugFromFile = fileNameWithExt.replace(/\.(md|mdx)$/, "");
    return {
      params: {
        slug: [...pathSegments, slugFromFile],
      },
    };
  });
}

// Voor generateStaticParams in gidspagina's (blijft hetzelfde)
export function getAllGuideSlugsForStaticParams(): {
  params: { slug: string };
}[] {
  const guidesDirectory = path.join(contentDirectory, "guides");
  if (!fs.existsSync(guidesDirectory)) return [];
  const fileNames = fs
    .readdirSync(guidesDirectory)
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"));
  return fileNames.map((fileName) => ({
    params: { slug: fileName.replace(/\.(md|mdx)$/, "") },
  }));
}
