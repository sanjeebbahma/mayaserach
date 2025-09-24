import { NextRequest, NextResponse } from "next/server";

// SearXNG API endpoint configuration
const SEARXNG_URL =
  process.env.NEXT_PUBLIC_SEARXNG_URL || "http://localhost:8080";
const SEARXNG_SUGGEST_ENDPOINT = `${SEARXNG_URL}/autocompleter`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const language = searchParams.get("language") || "en";

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Build SearXNG suggest API parameters
    const suggestUrl = new URL(SEARXNG_SUGGEST_ENDPOINT);
    suggestUrl.searchParams.append("q", query.trim());
    suggestUrl.searchParams.append("language", language);

    console.log("Getting suggestions from:", suggestUrl.toString());

    // Make request to SearXNG
    const response = await fetch(suggestUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "MAYA Search Engine/2.0.0",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.error(
        "SearXNG suggest API error:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: "Suggestion service temporarily unavailable" },
        { status: 503 }
      );
    }

    const suggestions = await response.json();

    // Add CORS headers
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Cache-Control", "public, max-age=600"); // Cache for 10 minutes

    return NextResponse.json(
      { suggestions },
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Suggest API error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Suggestion request timed out" },
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
