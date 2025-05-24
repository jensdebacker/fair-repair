// app/api/search-data/route.ts
import { NextResponse } from "next/server";
import { getAllContentListItems } from "@/lib/content";

export async function GET() {
  try {
    console.log("[API] search-data: Starting to fetch content items...");

    const articles = await getAllContentListItems();
    console.log(
      "[API] search-data: Successfully fetched articles:",
      articles.length
    );

    return NextResponse.json({
      articles,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] search-data: Error fetching articles:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch search data",
        success: false,
        articles: [],
      },
      { status: 500 }
    );
  }
}

// Optioneel: voeg caching toe
export const revalidate = 3600; // Cache voor 1 uur
