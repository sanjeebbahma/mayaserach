"use client";

import { Search, Mic, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSuggestions } from "@/lib/search";

export default function SearchBar() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced function to fetch suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const newSuggestions = await getSuggestions(query.trim());
      
      // Filter out the exact query match and duplicates
      const filteredSuggestions = newSuggestions
        .filter(suggestion => 
          suggestion.toLowerCase() !== query.toLowerCase() && 
          suggestion.trim().length > 0
        )
        .slice(0, 6); // Limit to 6 suggestions for better UX
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
      setSelectedSuggestionIndex(-1);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce suggestions API calls
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchValue);
    }, 300); // 300ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [searchValue, fetchSuggestions]);

  // Scroll to selected suggestion when selection changes
  useEffect(() => {
    if (selectedSuggestionIndex >= 0) {
      scrollToSuggestion(selectedSuggestionIndex);
    }
  }, [selectedSuggestionIndex]);

  // Scroll to selected suggestion
  const scrollToSuggestion = (index: number) => {
    if (suggestionsRef.current) {
      const suggestionItems = suggestionsRef.current.querySelectorAll('li');
      const selectedItem = suggestionItems[index];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => {
          const newIndex = prev < suggestions.length - 1 ? prev + 1 : 0; // Loop to start
          scrollToSuggestion(newIndex);
          return newIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : suggestions.length - 1; // Loop to end
          scrollToSuggestion(newIndex);
          return newIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setSelectedSuggestionIndex(-1);
  };

  // Select a suggestion
  const selectSuggestion = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    // Trigger search with selected suggestion
    handleSearch(suggestion);
  };

  // Handle search
  const handleSearch = (query?: string) => {
    const searchQuery = query || searchValue;
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchValue("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  // Highlight matching text in suggestions
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-red-100 text-red-700 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full min-w-0">
      <div className="relative">
        <div className="flex items-center border-3 rounded-full px-2 sm:px-4 py-1.5 sm:py-2.5 bg-white shadow-lg hover:shadow-xl transition-all duration-300" style={{ borderColor: '#ba160a' }}>
          <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-4 flex-shrink-0" style={{ color: '#ba160a' }} />
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search the web, images, videos, news and more..."
            className="flex-1 min-w-0 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-base sm:text-lg"
            autoComplete="off"
          />
          {searchValue && (
            <button 
              onClick={clearSearch}
              className="ml-1 sm:ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </button>
          )}
          <button 
            onClick={() => handleSearch()}
            className="ml-2 sm:ml-4 p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 cursor-pointer"
            title="Voice search"
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#ba160a' }} />
          </button>
          <button 
            onClick={() => handleSearch()}
            className="ml-1 sm:ml-2 text-white p-1 sm:p-2 rounded-full transition-all duration-300 flex-shrink-0 hover:scale-110 cursor-pointer" 
            style={{ backgroundColor: '#ba160a' }}
            title="Search"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Enhanced Suggestions List with Unique Design */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-3xl border border-red-200/40 overflow-hidden z-[9999] animate-in slide-in-from-top-2 duration-300"
            style={{ 
              boxShadow: `
                0 32px 64px -12px rgba(0, 0, 0, 0.35),
                0 0 0 1px rgba(239, 68, 68, 0.1),
                0 8px 32px -8px rgba(239, 68, 68, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.8)
              `,
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Enhanced Header Section - Hidden on mobile */}
            <div className="hidden sm:block px-5 py-3 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-red-500/10 border-b border-red-200/50 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 mr-3 animate-pulse shadow-lg shadow-red-500/30"></div>
                  <h3 className="text-sm font-bold text-gray-800">Search Suggestions</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-red-600 bg-white/80 px-3 py-1.5 rounded-full border border-red-200/50 shadow-sm">
                    {suggestions.length} suggestions
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Suggestions List Container */}
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-red-100/50">
              <ul className="divide-y divide-red-100/60">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className={`group relative px-5 py-3 cursor-pointer transition-all duration-300 ${
                      index === selectedSuggestionIndex
                        ? "bg-gradient-to-r from-red-50/90 to-pink-50/90 border-l-4 border-red-500 shadow-lg shadow-red-500/10"
                        : "hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 hover:shadow-md hover:shadow-red-500/5"
                    }`}
                    style={{
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Enhanced Number Badge */}
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-md ${
                        index === selectedSuggestionIndex
                          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30"
                          : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 group-hover:from-red-200 group-hover:to-pink-200 group-hover:text-red-800 group-hover:shadow-lg group-hover:shadow-red-500/20"
                      }`}>
                        {index + 1}
                      </div>
                      
                      {/* Enhanced Content Area */}
                      <div className="flex-1 min-w-0">
                        {/* Main Suggestion Text */}
                        <div className="text-gray-900 font-semibold text-sm leading-tight mb-1">
                          {suggestion}
                        </div>
                        
                        {/* Enhanced Suggestion Type/Category */}
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100/80 text-red-700 font-medium border border-red-200/50 shadow-sm">
                            <Search className="w-3 h-3 mr-1.5" />
                            Search suggestion
                          </span>
                          <span className="hidden sm:inline text-gray-400">•</span>
                          <span className="hidden sm:inline text-gray-600 font-medium">Press Enter to search</span>
                        </div>
                      </div>
                      
                      {/* Enhanced Action Indicators */}
                      <div className="flex-shrink-0 flex items-center space-x-3">
                        {/* Enhanced Selection Checkmark */}
                        {index === selectedSuggestionIndex && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Enhanced Hover Arrow */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                          index === selectedSuggestionIndex 
                            ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-600 shadow-lg shadow-red-500/20" 
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 group-hover:from-red-100 group-hover:to-pink-100 group-hover:text-red-600 group-hover:shadow-lg group-hover:shadow-red-500/20 opacity-0 group-hover:opacity-100"
                        }`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Enhanced Footer Section - Hidden on mobile */}
            <div className="hidden sm:block px-5 py-3 bg-gradient-to-r from-red-50/60 via-pink-50/60 to-red-50/60 border-t border-red-200/50 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-gray-800">Powered by Maya Search</span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <span className="flex items-center">
                    <kbd className="px-2 py-1 text-xs bg-white/80 border border-red-200/50 rounded-md shadow-sm font-mono">↑↓</kbd>
                    <span className="ml-2 font-medium">Navigate</span>
                  </span>
                  <span className="flex items-center">
                    <kbd className="px-2 py-1 text-xs bg-white/80 border border-red-200/50 rounded-md shadow-sm font-mono">Enter</kbd>
                    <span className="ml-2 font-medium">Select</span>
                  </span>
                  <span className="flex items-center">
                    <kbd className="px-2 py-1 text-xs bg-white/80 border border-red-200/50 rounded-md shadow-sm font-mono">Esc</kbd>
                    <span className="ml-2 font-medium">Close</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Loading State */}
            {isLoading && (
              <div className="px-5 py-3 text-center bg-gradient-to-r from-red-50/60 to-pink-50/60 border-t border-red-200/50 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
                <div className="relative flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent mr-3 shadow-lg shadow-red-500/20"></div>
                  <span className="text-sm text-gray-700 font-semibold">Loading suggestions...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
