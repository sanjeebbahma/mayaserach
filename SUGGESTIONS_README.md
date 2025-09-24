# 🔍 Search Suggestions Integration

The MAYA Search Engine now includes real-time search suggestions powered by SearXNG!

## ✨ Features Implemented

### 🚀 Core Functionality
- **Real-time suggestions** - As you type, get instant search suggestions
- **Debounced API calls** - Optimized performance with 300ms debounce
- **Error handling** - Graceful fallbacks when API is unavailable

### 🎨 User Experience
- **Keyboard navigation** - Use arrow keys to navigate suggestions
- **Mouse interaction** - Click to select suggestions
- **Visual feedback** - Highlighted selection with dark maroon theme
- **Loading indicator** - Shows when fetching suggestions
- **Clear button** - Easy way to clear search input

### ⌨️ Keyboard Shortcuts
- `↑` / `↓` - Navigate through suggestions
- `Enter` - Select highlighted suggestion or search current query
- `Escape` - Close suggestions dropdown
- `Tab` - Close suggestions and move focus

### 🎯 Smart Behavior
- **Auto-show** - Suggestions appear when typing (minimum 2 characters)
- **Auto-hide** - Hide when clicking outside or losing focus
- **Autocomplete disabled** - Prevents browser autocomplete conflicts
- **Responsive design** - Works on all screen sizes

## 🔧 Technical Implementation

### Component Structure
```
SearchBar.tsx
├── State Management (useState)
│   ├── searchValue - Current input value
│   ├── suggestions - Array of suggestion strings
│   ├── showSuggestions - Boolean to show/hide dropdown
│   ├── selectedSuggestionIndex - Currently highlighted suggestion
│   └── isLoading - Loading state for API calls
├── Effects (useEffect)
│   ├── Debounced API calls
│   └── Click outside handler
├── Refs (useRef)
│   ├── inputRef - Input element reference
│   ├── suggestionsRef - Dropdown reference
│   └── debounceRef - Debounce timer reference
└── Event Handlers
    ├── handleInputChange - Input value changes
    ├── handleKeyDown - Keyboard navigation
    ├── selectSuggestion - Suggestion selection
    ├── handleSearch - Search execution
    └── clearSearch - Clear functionality
```

### API Integration
- Uses `getSuggestions()` from `@/lib/search.ts`
- Connects to `/api/suggest` endpoint
- Returns suggestions from SearXNG autocompleter

### Styling
- **Theme**: Dark maroon (#ba160a) consistent with MAYA branding
- **Animations**: Smooth slide-in animation for dropdown
- **Accessibility**: Proper focus management and ARIA attributes
- **Responsive**: Mobile-friendly design

## 🧪 Testing

### Manual Testing
1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Start SearXNG backend**:
   ```bash
   cd backend
   docker-compose up
   ```

3. **Test suggestions**:
   - Type in the search box (try "artificial" or "javascript")
   - Watch suggestions appear after 2+ characters
   - Test keyboard navigation with arrow keys
   - Test mouse selection by clicking suggestions
   - Test clear button functionality

### Automated Testing
Run the API test to ensure backend connectivity:
```bash
node test-api.js
```

Expected output:
```
✅ Search API working
✅ Suggestions API working  
✅ Engines API working
```

## 🔮 Future Enhancements

1. **Recent searches** - Store and show recent search history
2. **Search categories** - Show suggestions by category (images, videos, etc.)
3. **Trending searches** - Popular searches in suggestions
4. **Voice search** - Integrate with speech recognition
5. **Search analytics** - Track suggestion usage and performance

## 🐛 Troubleshooting

### Suggestions not appearing
1. Check if SearXNG is running: `http://localhost:8080`
2. Verify API connectivity: `node test-api.js`
3. Check browser console for errors
4. Ensure minimum 2 characters typed

### Slow suggestions
1. Check network connection
2. Verify SearXNG performance
3. Adjust debounce timing if needed (currently 300ms)

### Styling issues
1. Ensure Tailwind CSS is properly configured
2. Check for CSS conflicts
3. Verify z-index for dropdown positioning

## 📚 API Reference

### getSuggestions(query, language?)
```typescript
// Get search suggestions
const suggestions = await getSuggestions("artificial intelligence", "en");
// Returns: ["artificial intelligence", "artificial neural networks", ...]
```

### Endpoint: /api/suggest
```
GET /api/suggest?q=query&language=en
Response: {
  "suggestions": ["suggestion1", "suggestion2", ...]
}
```

---

🎉 **Search suggestions are now live and ready to enhance your MAYA Search experience!**
