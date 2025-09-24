import { NextRequest, NextResponse } from "next/server";

// SearXNG API endpoint configuration
const SEARXNG_URL =
  process.env.NEXT_PUBLIC_SEARXNG_URL || "http://localhost:8080";
const SEARXNG_ENGINES_ENDPOINT = `${SEARXNG_URL}/engines`;

export async function GET(request: NextRequest) {
  try {
    console.log("Getting engines from static configuration");

    // Since SearXNG doesn't have a /engines endpoint, we'll return static engines
    // based on the configuration in settings.yml
    const engines = [
      { name: "bing", categories: ["general"], disabled: false },
      { name: "brave", categories: ["general"], disabled: false },
      { name: "duckduckgo", categories: ["general"], disabled: false },
      { name: "google", categories: ["general"], disabled: false },
      { name: "mojeek", categories: ["general"], disabled: false },
      { name: "startpage", categories: ["general"], disabled: false },
      { name: "wikipedia", categories: ["general"], disabled: false },
      { name: "wikidata", categories: ["general"], disabled: false },
      { name: "stackoverflow", categories: ["it"], disabled: false },
      { name: "github", categories: ["it"], disabled: false },
      { name: "reddit", categories: ["social media"], disabled: false },
      { name: "bing images", categories: ["images"], disabled: false },
      { name: "duckduckgo images", categories: ["images"], disabled: false },
      { name: "google images", categories: ["images"], disabled: false },
    ];

    // Add CORS headers
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour

    return NextResponse.json(
      { engines },
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Engines API error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Engines request timed out" },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
