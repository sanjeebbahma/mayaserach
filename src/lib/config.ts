// Configuration for MAYA Search Engine

export const config = {
  // SearXNG Configuration
  searxng: {
    url: process.env.NEXT_PUBLIC_SEARXNG_URL || "http://localhost:8080",
    timeout: 30000, // 30 seconds
    retries: 3,
  },

  // Application Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "MAYA Search",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "2.0.0",
    description: "Modern search engine powered by SearXNG",
  },

  // Search Configuration
  search: {
    defaultCategory: "general",
    defaultLanguage: "en",
    defaultSafeSearch: 0,
    maxQueryLength: 500,
    minQueryLength: 2,
    resultsPerPage: 10,
    maxPages: 10,
  },

  // Cache Configuration
  cache: {
    search: 300, // 5 minutes
    suggestions: 600, // 10 minutes
    engines: 3600, // 1 hour
  },

  // UI Configuration
  ui: {
    theme: {
      primary: "#ba160a", // Dark maroon
      background: "#ffffff", // White
      text: "#1a1a1a", // Dark text
    },
    animations: {
      duration: 300,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // Feature Flags
  features: {
    suggestions: true,
    engines: true,
    filters: true,
    voiceSearch: false, // Future feature
    darkMode: false, // Future feature
  },
} as const;

export type Config = typeof config;
