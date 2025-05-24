import Hero from "@/components/sections/Hero";
import PopularCategories from "@/components/sections/PopularCategories";
import RecentArticles from "@/components/sections/RecentArticles";
import FeaturedGuides from "@/components/sections/FeaturedGuides";
import { Metadata } from "next";

// Specifieke metadata voor de homepage
export const metadata: Metadata = {
  title: "Fair Repair | Sustainable Electronics & Repair Guides Benelux",
  description: "Your guide to sustainable and repairable consumer electronics in the Benelux. Find DIY repair guides, articles, and resources for smartphones, laptops, and more.",
  openGraph: { // Override globale OG tags indien nodig
    title: "Fair Repair | Sustainable Electronics & Repair Guides Benelux",
    description: "Empowering you to repair and maintain your devices.",
    // url: "https://www.jouwwebsite.nl/", // Specifieke URL voor homepage
  },
};

export default async function HomePage() {
  // De data fetching is verplaatst naar de individuele sectie-componenten (Server Components)
  // Dit houdt de homepage component schoon en bevordert parallelle data fetching.

  return (
    <>
      {/* Hero Section - Komt overeen met Desktop design */}
      {/* Op mobiel zal deze sectie gewoon boven de andere content staan. */}
      <Hero />
      <PopularCategories />
      {/* Volgorde zoals in de nieuwe designs (mobiel prominent, desktop logisch) */}
      <RecentArticles />



      <FeaturedGuides />

      {/* Toekomstige Nieuws API Sectie:
        <NewsApiSection /> 
      */}
    </>
  );
}