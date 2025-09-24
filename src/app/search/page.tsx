"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { search, SearchResult, SearchResponse, SEARCH_CATEGORIES } from "@/lib/search";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import { Clock, Globe, ExternalLink, ChevronLeft, ChevronRight, Filter, Grid, List, Zap, Search, Image, Play, Newspaper, Users, Youtube, Instagram, Facebook } from "lucide-react";
import StreamingText, { StreamingNumber } from "@/components/StreamingText";

// Image result component for Images category
function ImageResultItem({ result, index, isLoading }: { result: SearchResult; index: number; isLoading: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className={`group transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="relative">
        {/* Image container */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-lg">
          {result.url && (
            <img
              src={result.url}
              alt={result.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
          )}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-green-700 font-medium truncate">
              {getDomainFromUrl(result.url)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-700 transition-colors duration-300">
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              <StreamingText 
                text={result.title} 
                speed={20} 
                streamType="typewriter"
                showCursor={false}
              />
            </a>
          </h3>

          {result.content && (
            <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
              <StreamingText 
                text={result.content} 
                speed={8} 
                delay={300}
                streamType="typewriter"
                showCursor={false}
              />
            </p>
          )}

          <a 
            href={result.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform duration-300"
          >
            <span>View image</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

// Google-style expandable result component
function GoogleStyleResultItem({ result, index, isLoading }: { result: SearchResult; index: number; isLoading: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setShowContent(true), 200);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getSocialMediaInfo = (url: string) => {
    if (url.includes('facebook.com')) {
      return { platform: 'Facebook', icon: Facebook, followers: '1.1L+ followers', color: 'text-blue-600' };
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return { platform: 'YouTube', icon: Youtube, followers: '5.8L+ followers', color: 'text-red-600' };
    } else if (url.includes('instagram.com')) {
      return { platform: 'Instagram', icon: Instagram, followers: '2.1L+ followers', color: 'text-pink-600' };
    }
    return null;
  };

  const socialInfo = getSocialMediaInfo(result.url);
  const isMainResult = index === 0;

  return (
    <div className={`group transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="relative">
        <div>
          {/* URL and domain */}
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-green-700 font-medium truncate">
              {showContent ? getDomainFromUrl(result.url) : ""}
            </span>
            {/* Show engine badge */}
            <div className="flex items-center space-x-1 ml-2">
              {result.engine === 'wikipedia' && (
                <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Wikipedia</div>
              )}
              {result.engine === 'wikidata' && (
                <div className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Wikidata</div>
              )}
              {!['wikipedia', 'wikidata', 'google'].includes(result.engine) && (
                <div className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">{result.engine}</div>
              )}
            </div>
            {socialInfo && (
              <div className="flex items-center space-x-1 ml-2">
                <socialInfo.icon className={`w-4 h-4 ${socialInfo.color}`} />
                <span className="text-xs text-gray-500">{socialInfo.followers}</span>
              </div>
            )}
          </div>

          {/* Title with streaming effect */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-700 transition-colors duration-300">
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {showContent ? (
                <StreamingText 
                  text={result.title} 
                  speed={20} 
                  streamType="typewriter"
                  showCursor={false}
                />
              ) : (
                <span className="opacity-0">.</span>
              )}
            </a>
          </h3>

          {/* Content with streaming effect */}
          {showContent && (
            <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
              <StreamingText 
                text={result.content} 
                speed={8} 
                delay={300}
                streamType="typewriter"
                showCursor={false}
              />
            </p>
          )}


          {/* More results link for main domain */}
          {isMainResult && (
            <div className="mb-4">
              <a 
                href={`https://${getDomainFromUrl(result.url)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>More results from {getDomainFromUrl(result.url)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Bottom row with actions */}
          <div className="flex items-center justify-start">
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform duration-300"
            >
              <span>Visit site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual search result component with animations
function SearchResultItem({ result, index, isLoading }: { result: SearchResult; index: number; isLoading: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setShowContent(true), 200);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className={`group transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="relative">
        <div>
          {/* URL and domain */}
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-green-700 font-medium truncate">
              {showContent ? getDomainFromUrl(result.url) : ""}
            </span>
          </div>

          {/* Title with streaming effect */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-700 transition-colors duration-300">
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {showContent ? (
                <StreamingText 
                  text={result.title} 
                  speed={20} 
                  streamType="typewriter"
                  showCursor={false}
                />
              ) : (
                <span className="opacity-0">.</span>
              )}
            </a>
          </h3>

          {/* Content with streaming effect */}
          {showContent && (
            <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
              <StreamingText 
                text={result.content} 
                speed={8} 
                delay={300}
                streamType="typewriter"
                showCursor={false}
              />
            </p>
          )}

          {/* Bottom row with actions */}
          <div className="flex items-center justify-start">
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform duration-300"
            >
              <span>Visit site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Google-style category navigation component
function CategoryNavigation({ currentCategory, onCategoryChange }: { currentCategory: string; onCategoryChange: (category: string) => void }) {
  const categories = [
    { key: SEARCH_CATEGORIES.GENERAL, label: "General", icon: Search },
    { key: SEARCH_CATEGORIES.IMAGES, label: "Images", icon: Image },
    { key: SEARCH_CATEGORIES.VIDEOS, label: "Videos", icon: Play },
    { key: SEARCH_CATEGORIES.NEWS, label: "News", icon: Newspaper },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1 overflow-x-auto py-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = currentCategory === category.key;
            
            return (
              <button
                key={category.key}
                onClick={() => onCategoryChange(category.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-red-50 text-red-700 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                <span className="font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function SearchResultSkeleton({ index, isImage = false }: { index: number; isImage?: boolean }) {
  if (isImage) {
    return (
      <div className={`animate-pulse transition-all duration-500 opacity-0 animate-fade-in`} 
           style={{ animationDelay: `${index * 100}ms` }}>
        <div className="relative">
          <div className="aspect-video bg-gray-200 rounded-lg"></div>
          <div className="mt-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-red-200 rounded-full"></div>
              <div className="h-3 bg-red-200 rounded w-32"></div>
            </div>
            <div className="h-5 bg-gray-300 rounded w-4/5 mb-2"></div>
            <div className="space-y-1 mb-3">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="h-4 bg-red-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse transition-all duration-500 opacity-0 animate-fade-in`} 
         style={{ animationDelay: `${index * 100}ms` }}>
      <div className="relative">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-4 h-4 bg-red-200 rounded-full"></div>
          <div className="h-3 bg-red-200 rounded w-32"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-4/5 mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-red-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || SEARCH_CATEGORIES.GENERAL;
  const pageParam = searchParams.get('page');
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;

  const performSearch = useCallback(async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await search({
        q: searchQuery.trim(),
        pageno: page,
        categories: category,
        engines: 'google,wikipedia,wikidata', // Include Wikipedia and Wikidata
        language: 'en',
        safesearch: 1
      });

      // Use results as-is, filtering will be handled in API route
      const filteredResults = {
        ...results,
        results: results.results.slice(0, 15), // Limit to 15 results per page
        totalResults: results.totalResults // Use actual total results count from API
      };

      setSearchResults(filteredResults);
      setCurrentPage(page);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  // Update currentPage state when initialPage changes
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (query) {
      performSearch(query, initialPage);
    }
  }, [query, initialPage, performSearch]);

  const handlePageChange = (page: number) => {
    // Update URL with page number
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('page', page.toString());
    router.push(newUrl.pathname + newUrl.search);
    
    performSearch(query, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (newCategory: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('category', newCategory);
    router.push(newUrl.pathname + newUrl.search);
  };

  const formatSearchTime = (time: number) => {
    return time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Enhanced floating particles for search page */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="floating-particle" style={{ width: '16px', height: '16px', left: '5%', animationDelay: '0s', animationDuration: '30s' }}></div>
        <div className="floating-particle" style={{ width: '12px', height: '12px', left: '15%', animationDelay: '3s', animationDuration: '35s' }}></div>
        <div className="floating-particle" style={{ width: '20px', height: '20px', left: '30%', animationDelay: '6s', animationDuration: '25s' }}></div>
        <div className="floating-particle" style={{ width: '14px', height: '14px', left: '50%', animationDelay: '9s', animationDuration: '40s' }}></div>
        <div className="floating-particle" style={{ width: '18px', height: '18px', left: '70%', animationDelay: '12s', animationDuration: '28s' }}></div>
        <div className="floating-particle" style={{ width: '22px', height: '22px', left: '85%', animationDelay: '15s', animationDuration: '32s' }}></div>
        <div className="floating-particle" style={{ width: '13px', height: '13px', left: '95%', animationDelay: '18s', animationDuration: '38s' }}></div>
      </div>

      <Header />

      {/* Search header with compact SearchBar */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-red-100 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <button 
                onClick={() => router.push('/')}
                className="text-red-600 hover:text-red-700 flex items-center space-x-2 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-semibold">Home</span>
              </button>
              
              <div className="flex-1 max-w-2xl">
                <SearchBar />
              </div>
            </div>

            {/* Search controls */}
            <div className="flex items-center space-x-2 ml-4">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors duration-200 ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors duration-200 ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Google-style category navigation */}
      <CategoryNavigation 
        currentCategory={category} 
        onCategoryChange={handleCategoryChange} 
      />

      {/* Main search results */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 animate-in fade-in duration-500">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Search Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className={`w-full lg:w-3/5 ${
            category === SEARCH_CATEGORIES.IMAGES 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                : 'space-y-6'
          }`}>
            {Array.from({ length: 15 }).map((_, index) => (
              <SearchResultSkeleton 
                key={index} 
                index={index} 
                isImage={category === SEARCH_CATEGORIES.IMAGES}
              />
            ))}
          </div>
        )}

        {/* Search results */}
        {searchResults && !isLoading && searchResults.results.length > 0 && (
          <div className={`w-full lg:w-3/5 ${
            category === SEARCH_CATEGORIES.IMAGES 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : viewMode === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
                : 'space-y-6'
          }`}>
            {searchResults.results.map((result, index) => (
              category === SEARCH_CATEGORIES.IMAGES ? (
                <ImageResultItem 
                  key={`${result.url}-${index}`} 
                  result={result} 
                  index={index}
                  isLoading={isLoading}
                />
              ) : category === SEARCH_CATEGORIES.GENERAL ? (
                <GoogleStyleResultItem 
                  key={`${result.url}-${index}`} 
                  result={result} 
                  index={index}
                  isLoading={isLoading}
                />
              ) : (
                <SearchResultItem 
                  key={`${result.url}-${index}`} 
                  result={result} 
                  index={index}
                  isLoading={isLoading}
                />
              )
            ))}
          </div>
        )}

        {/* No results */}
        {searchResults && !isLoading && searchResults.results.length === 0 && (
          <div className="text-center py-16 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or check the spelling. You can also try different search categories.
            </p>
          </div>
        )}

        {/* Pagination - Always show at least 5 pages for testing */}
        {searchResults && !isLoading && searchResults.results.length > 0 && (
          <div className="flex flex-col items-center mt-12">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-red-100">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 text-red-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Always show at least 5 pages */}
              {Array.from({ length: 5 }, (_, i) => {
                const page = Math.max(1, currentPage - 2) + i;
                // Ensure we always show at least 5 pages
                const maxPages = Math.max(5, Math.ceil(searchResults.totalResults / 15));
                if (page > maxPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      page === currentPage
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                        : 'text-gray-700 hover:bg-red-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.max(5, Math.ceil(searchResults.totalResults / 15))}
                className="p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 text-red-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
