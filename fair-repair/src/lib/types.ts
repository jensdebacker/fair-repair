// lib/types.ts
// export interface PostFrontMatter {
//   title: string;
//   date: string;
//   category: string; // De naam van de submap (bv. "how-to", "reviews")
//   excerpt: string;
//   featuredImage?: string;
//   tags?: string[];
//   layoutType: "article" | "guide" | "news";
//   reparabilityScore?: number;
//   author?: string;
// }

// // Voor artikelen met submappen
// export interface ArticlePost extends PostFrontMatter {
//   slugSegments: string[]; // bv. ["how-to", "artikel-over-onderhoud"]
//   categoryPath: string; // bv. "how-to"
//   contentHtml: string;
//   fullSlug: string; // bv. "how-to/artikel-over-onderhoud"
// }

// // Voor gidsen (zonder submappen in /content/guides/)
// export interface GuidePost extends PostFrontMatter {
//   slug: string; // bv. "smartphone-screen-replacement"
//   contentHtml: string;
// }

// // Een gecombineerd type als je ze samen verwerkt, of gebruik een union type
// export type ContentPost = ArticlePost | GuidePost;

// // ... (NewsArticle en Category blijven hetzelfde) ...
// export interface Category {
//   slug: string; // Kan nu zijn "articles/how-to" of "guides"
//   name: string;
//   imageUrl: string;
//   imageAlt: string;
// }

export type Category =
  | "smartphones"
  | "tablets"
  | "smartwatches"
  | "gameconsoles"
  | "algemeen";

// Basisinterface voor alle content
export interface BaseContent {
  slug: string;
  title: string;
  date: string;
  summary: string;
  image?: string;
  type: ContentType;
  body: string; // Voor de geparste Markdown body
  productCategory?: Category; // Niet alle content heeft een specifieke productcategorie
}

// Specifieke content types
export interface Review extends BaseContent {
  type: "reviews"; // Gebruik mapnaam als type voor consistentie
  productName: string;
  brand: string;
  reparabilityScore: number;
  // ... andere review-specifieke velden
}

export interface Reparatiegids extends BaseContent {
  type: "reparatiegidsen"; // Gebruik mapnaam als type
  difficulty: "makkelijk" | "gemiddeld" | "moeilijk";
  tools: string[];
  costBenefitAnalysis: string;
  // ... andere gids-specifieke velden
}

export interface NieuwsArtikel extends BaseContent {
  type: "nieuws"; // Gebruik mapnaam als type
  // ... andere nieuws-specifieke velden
}

export interface TopXList extends BaseContent {
  type: "top-lijsten"; // Gebruik mapnaam als type
  products: Array<{
    name: string;
    brand?: string; // Optioneel, kan al in product aanwezig zijn
    image?: string; // Optioneel
    link: string; // Affiliate link
    reparabilityScore?: number;
    pros?: string[];
    cons?: string[];
    // ... andere producteigenschappen
  }>;
}

export interface TechUitgelegd extends BaseContent {
  type: "tech-uitgelegd"; // Gebruik mapnaam als type
}

export interface HowToGids extends BaseContent {
  type: "how-to"; // Gebruik mapnaam als type
}

// Union type voor alle mogelijke content items
export type Content =
  | Review
  | Reparatiegids
  | NieuwsArtikel
  | TopXList
  | TechUitgelegd
  | HowToGids;

// De 'type' property van de Content union, komt overeen met de mapnamen
export type ContentType = Content["type"];

// Voor items in lijsten (bijv. op homepage of categoriepagina's)
export interface ContentListItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
  image?: string;
  type: ContentType;
  productCategory?: Category;
}

// Behoud Product type als je het los gebruikt, anders integreer in TopXList.
// Deze is al aanwezig en wordt gebruikt door TopXListLayout.
export interface Product {
  name: string;
  brand: string;
  image: string;
  affiliateLink: string;
  pros: string[];
  cons: string[];
  reparabilityScore?: number;
}
