// lib/types.ts
export interface PostFrontMatter {
  title: string;
  date: string;
  category: string; // De naam van de submap (bv. "how-to", "reviews")
  excerpt: string;
  featuredImage?: string;
  tags?: string[];
  layoutType: "article" | "guide" | "news";
  reparabilityScore?: number;
  author?: string;
}

// Voor artikelen met submappen
export interface ArticlePost extends PostFrontMatter {
  slugSegments: string[]; // bv. ["how-to", "artikel-over-onderhoud"]
  categoryPath: string; // bv. "how-to"
  contentHtml: string;
  fullSlug: string; // bv. "how-to/artikel-over-onderhoud"
}

// Voor gidsen (zonder submappen in /content/guides/)
export interface GuidePost extends PostFrontMatter {
  slug: string; // bv. "smartphone-screen-replacement"
  contentHtml: string;
}

// Een gecombineerd type als je ze samen verwerkt, of gebruik een union type
export type ContentPost = ArticlePost | GuidePost;

// ... (NewsArticle en Category blijven hetzelfde) ...
export interface Category {
  slug: string; // Kan nu zijn "articles/how-to" of "guides"
  name: string;
  imageUrl: string;
  imageAlt: string;
}
