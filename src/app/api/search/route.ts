import { NextRequest, NextResponse } from "next/server";

// SearXNG API endpoint configuration
const SEARXNG_URL =
  process.env.NEXT_PUBLIC_SEARXNG_URL || "http://localhost:8080";
const SEARXNG_API_ENDPOINT = `${SEARXNG_URL}/search`;

// Interface for search parameters
interface SearchParams {
  q: string;
  format?: "json";
  pageno?: number;
  categories?: string;
  engines?: string;
  language?: string;
  time_range?: string;
  safesearch?: number;
}

// Interface for search results
interface SearchResult {
  title: string;
  url: string;
  content: string;
  engine: string;
  parsed_url: string[];
  template: string;
  engines: string[];
  positions: number[];
  score: number;
  category: string;
  pretty_url: string;
  open_group: boolean;
  close_group: boolean;
}

interface SearchResponse {
  query: string;
  number_of_results: number;
  results: SearchResult[];
  answers: string[];
  corrections: string[];
  infoboxes: any[];
  suggestions: string[];
  unresponsive_engines: string[];
  answers_raw: any[];
  web_search_url: string;
  results_time: number;
  engines_time: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract search parameters
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("pageno") || "1");
    const categories = searchParams.get("categories") || "general";
    const engines = searchParams.get("engines");
    const language = searchParams.get("language") || "en";
    const timeRange = searchParams.get("time_range");
    const safeSearch = parseInt(searchParams.get("safesearch") || "0");

    // Validate required parameters
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Build SearXNG API parameters
    const searxngParams: SearchParams = {
      q: query.trim(),
      format: "json",
      pageno: page,
      categories,
      language,
      safesearch: safeSearch,
    };

    // Add optional parameters
    if (engines) {
      searxngParams.engines = engines;
    }
    if (timeRange) {
      searxngParams.time_range = timeRange;
    }

    // Create URL with parameters
    const apiUrl = new URL(SEARXNG_API_ENDPOINT);
    Object.entries(searxngParams).forEach(([key, value]) => {
      if (value !== undefined) {
        apiUrl.searchParams.append(key, value.toString());
      }
    });

    console.log("Searching with URL:", apiUrl.toString());

    // Make request to SearXNG
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "MAYA Search Engine/2.0.0",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      console.error("SearXNG API error:", response.status, response.statusText);
      return NextResponse.json(
        {
          error: "Search service temporarily unavailable",
          details: `HTTP ${response.status}: ${response.statusText}`,
        },
        { status: 503 }
      );
    }

    const data: SearchResponse = await response.json();

    // Filter results to include Google, Wikipedia, and Wikidata engines, and exclude specific Quora links
    const filteredResults = data.results.filter((result) => {
      // Include Google, Wikipedia, and Wikidata engine results
      if (!["google", "wikipedia", "wikidata"].includes(result.engine)) {
        return false;
      }

      const url = result.url.toLowerCase();

      // Exclude specific Quora links only
      if (
        url.includes("quora.com") &&
        (url.includes("kaulantak-peeth") ||
          url.includes("ishaputra") ||
          url.includes("kaulantak_peeth"))
      ) {
        return false;
      }

      return true;
    });

    // Transform the response for our frontend
    const transformedResults = {
      query: data.query,
      totalResults: data.number_of_results, // Use original total results count
      results: filteredResults.map((result) => ({
        title: result.title,
        url: result.url,
        content: result.content,
        engine: result.engine,
        category: result.category,
        prettyUrl: result.pretty_url,
        score: result.score,
      })),
      answers: data.answers,
      corrections: data.corrections,
      suggestions: data.suggestions,
      searchTime: data.results_time,
      enginesTime: data.engines_time,
      unresponsiveEngines: data.unresponsive_engines,
      webSearchUrl: data.web_search_url,
    };

    // Add CORS headers
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Cache-Control", "public, max-age=300"); // Cache for 5 minutes

    return NextResponse.json(transformedResults, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Search API error:", error);

    // Handle different types of errors
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json(
          { error: "Search request timed out" },
          { status: 408 }
        );
      }

      if (error.message.includes("fetch")) {
        return NextResponse.json(
          { error: "Unable to connect to search service" },
          { status: 503 }
        );
      }
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
