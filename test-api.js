// Simple test script for MAYA Search Engine API
// Run with: node test-api.js

const API_BASE = 'http://localhost:3000';

async function testSearchAPI() {
  console.log('🔍 Testing MAYA Search Engine API...\n');
  
  try {
    // Test search endpoint
    console.log('1. Testing search endpoint...');
    const searchResponse = await fetch(`${API_BASE}/api/search?q=artificial intelligence&pageno=1`);
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log('✅ Search API working');
      console.log(`   Query: ${searchData.query}`);
      console.log(`   Results: ${searchData.totalResults}`);
      console.log(`   Search time: ${searchData.searchTime}ms`);
    } else {
      console.log('❌ Search API failed:', searchResponse.status, searchResponse.statusText);
    }
    
    // Test suggestions endpoint
    console.log('\n2. Testing suggestions endpoint...');
    const suggestResponse = await fetch(`${API_BASE}/api/suggest?q=artificial`);
    
    if (suggestResponse.ok) {
      const suggestData = await suggestResponse.json();
      console.log('✅ Suggestions API working');
      console.log(`   Suggestions: ${suggestData.suggestions.slice(0, 3).join(', ')}...`);
    } else {
      console.log('❌ Suggestions API failed:', suggestResponse.status, suggestResponse.statusText);
    }
    
    // Test engines endpoint
    console.log('\n3. Testing engines endpoint...');
    const enginesResponse = await fetch(`${API_BASE}/api/engines`);
    
    if (enginesResponse.ok) {
      const enginesData = await enginesResponse.json();
      console.log('✅ Engines API working');
      console.log(`   Available engines: ${enginesData.engines.length}`);
    } else {
      console.log('❌ Engines API failed:', enginesResponse.status, enginesResponse.statusText);
    }
    
    console.log('\n🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Next.js dev server is running (npm run dev)');
    console.log('   2. SearXNG backend is running (docker-compose up)');
    console.log('   3. SearXNG is accessible at http://localhost:8080');
  }
}

// Run the test
testSearchAPI();
