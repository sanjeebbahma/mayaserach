// Search utility functions and types for MAYA Search Engine

export interface SearchParams {
  q: string;
  pageno?: number;
  categories?: string;
  engines?: string;
  language?: string;
  time_range?: string;
  safesearch?: number;
}

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  engine: string;
  category: string;
  prettyUrl: string;
  score: number;
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  results: SearchResult[];
  answers: string[];
  corrections: string[];
  suggestions: string[];
  searchTime: number;
  enginesTime: number;
  unresponsiveEngines: string[];
  webSearchUrl: string;
}

export interface SuggestResponse {
  suggestions: string[] | [string, string[]];
}

export interface EnginesResponse {
  engines: any[];
}

// Search categories
export const SEARCH_CATEGORIES = {
  GENERAL: "general",
  IMAGES: "images",
  VIDEOS: "videos",
  NEWS: "news",
  MAPS: "map",
  MUSIC: "music",
  IT: "it",
  SCIENCE: "science",
  FILES: "files",
  SOCIAL_MEDIA: "social media",
} as const;

// Time ranges for search
export const TIME_RANGES = {
  ANY: "",
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
} as const;

// Safe search levels
export const SAFE_SEARCH_LEVELS = {
  OFF: 0,
  MODERATE: 1,
  STRICT: 2,
} as const;

// Available search engines
export const SEARCH_ENGINES = {
  BING: "bing",
  BRAVE: "brave",
  DUCKDUCKGO: "duckduckgo",
  GOOGLE: "google",
  MOJEEK: "mojeek",
  STARTPAGE: "startpage",
  WIKIPEDIA: "wikipedia",
  WIKIDATA: "wikidata",
  STACKOVERFLOW: "stackoverflow",
  GITHUB: "github",
  REDDIT: "reddit",
  BING_IMAGES: "bing images",
  DUCKDUCKGO_IMAGES: "duckduckgo images",
  GOOGLE_IMAGES: "google images",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  SEARCH: "/api/search",
  SUGGEST: "/api/suggest",
  ENGINES: "/api/engines",
} as const;

/**
 * Perform a search query
 */
export async function search(params: SearchParams): Promise<SearchResponse> {
  const searchUrl = new URL(API_ENDPOINTS.SEARCH, window.location.origin);

  // Add search parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchUrl.searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(searchUrl.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Search failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Get search suggestions
 */
export async function getSuggestions(
  query: string,
  language: string = "en"
): Promise<string[]> {
  const suggestUrl = new URL(API_ENDPOINTS.SUGGEST, window.location.origin);
  suggestUrl.searchParams.append("q", query);
  suggestUrl.searchParams.append("language", language);

  const response = await fetch(suggestUrl.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Suggestions failed: ${response.status}`
    );
  }

  const data: SuggestResponse = await response.json();

  // Debug: Log the raw data to understand the structure
  console.log("Raw suggestions data:", data);
  console.log("Raw suggestions type:", typeof data.suggestions);
  console.log("Raw suggestions value:", data.suggestions);

  // Parse and clean suggestions data
  let suggestions: any[] = Array.isArray(data.suggestions)
    ? data.suggestions
    : [];

  // Handle different response formats
  if (Array.isArray(suggestions) && suggestions.length > 1) {
    // If it's an array with multiple elements, take the second element (actual suggestions)
    if (Array.isArray(suggestions[1])) {
      suggestions = suggestions[1];
      console.log("Extracted suggestions from nested array:", suggestions);
    }
  } else if (typeof data.suggestions === "string") {
    console.log("Splitting string suggestions:", data.suggestions);
    // Split by comma and clean each suggestion
    suggestions = (data.suggestions as string)
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    console.log("Split suggestions:", suggestions);
  }

  // Ensure all suggestions are strings and filter out empty ones
  suggestions = suggestions
    .map((suggestion, index) => {
      try {
        // Convert to string if it's not already
        if (typeof suggestion === "string") {
          return suggestion.trim();
        } else if (typeof suggestion === "number") {
          return String(suggestion).trim();
        } else if (suggestion && typeof suggestion === "object") {
          // Handle object suggestions (extract text property if available)
          return (
            suggestion.text || suggestion.title || String(suggestion).trim()
          );
        } else {
          return String(suggestion || "").trim();
        }
      } catch (error) {
        console.warn(
          `Error processing suggestion at index ${index}:`,
          suggestion,
          error
        );
        return "";
      }
    })
    .filter((suggestion) => suggestion && suggestion.length > 0)
    .map((suggestion) => suggestion.trim()) // Ensure no extra whitespace
    .slice(0, 8);

  console.log("Processed suggestions:", suggestions);

  return suggestions;
}

/**
 * Get available search engines
 */
export async function getEngines(): Promise<any[]> {
  const enginesUrl = new URL(API_ENDPOINTS.ENGINES, window.location.origin);

  const response = await fetch(enginesUrl.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Engines failed: ${response.status}`);
  }

  const data: EnginesResponse = await response.json();
  return data.engines;
}

/**
 * Build search URL for external sharing
 */
export function buildSearchUrl(
  query: string,
  params: Partial<SearchParams> = {}
): string {
  const searchUrl = new URL(API_ENDPOINTS.SEARCH, window.location.origin);
  searchUrl.searchParams.append("q", query);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchUrl.searchParams.append(key, value.toString());
    }
  });

  return searchUrl.toString();
}

/**
 * Format search time for display
 */
export function formatSearchTime(time: number): string {
  if (time < 1000) {
    return `${time}ms`;
  }
  return `${(time / 1000).toFixed(2)}s`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

/**
 * Validate search query
 */
export function validateQuery(query: string): {
  isValid: boolean;
  error?: string;
} {
  if (!query || query.trim().length === 0) {
    return { isValid: false, error: "Search query cannot be empty" };
  }

  if (query.trim().length < 2) {
    return {
      isValid: false,
      error: "Search query must be at least 2 characters",
    };
  }

  if (query.length > 500) {
    return {
      isValid: false,
      error: "Search query is too long (max 500 characters)",
    };
  }

  return { isValid: true };
}
