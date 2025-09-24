# MAYA Search Engine - Project Requirements

## Project Overview

MAYA Search Engine is a modern web search application built with Next.js frontend that integrates with SearXNG's JSON API for search functionality.

## Project Structure

```
maya_search/
├── requirements.md (this file)
├── src/ (Next.js Frontend Application)
│   ├── app/
│   ├── components/
│   └── lib/
└── backend/ (Docker-based SearXNG Backend)
    └── Dockerfile
```

## Frontend Requirements (Next.js Application)

### Current Implementation ✅

- **Framework**: Next.js 15.5.4 with App Router
- **Styling**: Tailwind CSS 4 with custom animations
- **Theme**: Dark maroon (#ba160a) with white background
- **Components**: Header, MayaLogo, SearchBar, QuickAccess, Footer
- **Animations**: Floating particles, letter bounce, hover effects

### Search Integration Requirements

1. **SearXNG API Integration**

   - Connect to SearXNG JSON API endpoint
   - Handle search queries and responses
   - Implement proper error handling and loading states

2. **Search Functionality**

   - Process user search queries from SearchBar component
   - Display search results in organized format
   - Implement pagination for large result sets
   - Add search filters (images, videos, news, etc.)

3. **Search Results Page**
   - Create dedicated results page (`/search`)
   - Display results with titles, descriptions, URLs
   - Include result metadata (source, date, etc.)
   - Implement "Did you mean?" suggestions

### Quick Access Integration

1. **Application Links**
   - Make QuickAccess components functional
   - Integrate with respective services:
     - Scrolllink, Myotube, Images, NewsLiveNow
     - MayoAI, MayoPedia, MayoShopping
     - MayoMaps, MayoBooks, MayoForums

### Enhanced Features

1. **Search Suggestions**

   - Implement autocomplete functionality
   - Add popular searches
   - Recent search history

2. **Advanced Search Options**

   - Date range filters
   - File type filters
   - Safe search toggle
   - Region-specific results

3. **User Experience**
   - Loading states and skeletons
   - Error handling with user-friendly messages
   - Keyboard shortcuts support
   - Voice search integration (microphone button)

## Backend Requirements (SearXNG Docker)

### Docker Setup

1. **SearXNG Configuration**

   - Dockerfile in `/backend` folder
   - SearXNG instance with JSON API enabled
   - Proper port configuration (typically 8080)
   - Environment variables for customization

2. **Search Engines Configuration**

   - Configure multiple search engines
   - Enable/disable specific engines
   - Set up rate limiting and caching

3. **API Endpoints**
   - `/search` - Main search endpoint
   - `/suggest` - Search suggestions
   - `/engines` - Available search engines

## Development Phases

### Phase 1: Local Development ✅

- [x] Next.js application setup
- [x] Basic UI components and design
- [x] Theme implementation
- [x] Responsive design
- [ ] SearXNG Docker setup
- [ ] API integration
- [ ] Search functionality implementation

### Phase 2: Feature Development

- [ ] Search results page
- [ ] Quick access functionality
- [ ] Search filters and options
- [ ] Error handling and loading states
- [ ] Performance optimization

### Phase 3: Production Preparation

- [ ] Environment configuration
- [ ] Build optimization
- [ ] Security considerations
- [ ] Performance testing
- [ ] Deployment configuration

## Technical Specifications

### Frontend Stack

- **Framework**: Next.js 15.5.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: React hooks (consider Zustand for complex state)

### Backend Stack

- **Search Engine**: SearXNG (Docker containerized)
- **API**: JSON REST API
- **Port**: 8080 (configurable)

### Environment Variables

```
# Frontend (.env.local)
NEXT_PUBLIC_SEARXNG_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=MAYA Search

# Backend (Docker environment)
SEARXNG_HOST=0.0.0.0
SEARXNG_PORT=8080
```

## Performance Requirements

- **Loading Time**: < 2 seconds for initial page load
- **Search Response**: < 1 second for search queries
- **Mobile Performance**: Optimized for mobile devices
- **SEO**: Proper meta tags and structured data

## Security Considerations

- Input validation for search queries
- Rate limiting for API requests
- CORS configuration for API access
- Content Security Policy implementation

## Future Enhancements

- User accounts and search history
- Personalized search results
- Advanced search operators
- Multi-language support
- Dark/light theme toggle
- Progressive Web App (PWA) features

## Current Status

- ✅ Next.js application created and configured
- ✅ UI components implemented with dark maroon theme
- ✅ Responsive design with modern animations
- ✅ Component structure established
- ⏳ SearXNG backend setup pending
- ⏳ Search functionality integration pending
- ⏳ Results page implementation pending
