# MAYA Search Engine API Routes

This directory contains the API routes for the MAYA Search Engine, which provide a bridge between the Next.js frontend and the SearXNG backend.

## API Endpoints

### `/api/search`

Main search endpoint that connects to SearXNG's search API.

**Method:** GET

**Parameters:**

- `q` (required): Search query
- `pageno` (optional): Page number (default: 1)
- `categories` (optional): Search category (default: 'general')
- `engines` (optional): Specific search engines to use
- `language` (optional): Language code (default: 'en')
- `time_range` (optional): Time range filter (day, week, month, year)
- `safesearch` (optional): Safe search level (0-2, default: 0)

**Example:**

```
GET /api/search?q=artificial intelligence&pageno=1&categories=general&language=en
```

**Response:**

```json
{
  "query": "artificial intelligence",
  "totalResults": 1000,
  "results": [...],
  "answers": [...],
  "corrections": [...],
  "suggestions": [...],
  "searchTime": 1.2,
  "enginesTime": 0.8,
  "unresponsiveEngines": [],
  "webSearchUrl": "..."
}
```

### `/api/suggest`

Get search suggestions/autocomplete from SearXNG.

**Method:** GET

**Parameters:**

- `q` (required): Partial search query
- `language` (optional): Language code (default: 'en')

**Example:**

```
GET /api/suggest?q=artificial&language=en
```

**Response:**

```json
{
  "suggestions": [
    "artificial intelligence",
    "artificial neural networks",
    "artificial general intelligence"
  ]
}
```

### `/api/engines`

Get available search engines from SearXNG.

**Method:** GET

**Response:**

```json
{
  "engines": [
    {
      "name": "google",
      "categories": ["general"],
      "disabled": false
    },
    ...
  ]
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (missing or invalid parameters)
- `408`: Request Timeout
- `503`: Service Unavailable (SearXNG not responding)
- `500`: Internal Server Error

Error responses include a descriptive error message:

```json
{
  "error": "Search query is required"
}
```

## CORS Configuration

All endpoints include CORS headers to allow cross-origin requests:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Caching

Responses are cached with appropriate headers:

- Search results: 5 minutes
- Suggestions: 10 minutes
- Engines: 1 hour

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SEARXNG_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=MAYA Search
NEXT_PUBLIC_APP_VERSION=2.0.0
```

## Usage in Frontend

```typescript
import { search, getSuggestions, getEngines } from "@/lib/search";

// Perform a search
const results = await search({
  q: "artificial intelligence",
  pageno: 1,
  categories: "general",
});

// Get suggestions
const suggestions = await getSuggestions("artificial");

// Get available engines
const engines = await getEngines();
```
