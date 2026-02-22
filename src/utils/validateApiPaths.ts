/**
 * API Endpoint Validation Script
 * 
 * This script tests all frontend API endpoints against your Express.js backend
 * Run this in your browser console or as a Node.js script
 * 
 * Usage:
 * 1. In browser: Copy and paste into DevTools Console (F12)
 * 2. In Node.js: npx ts-node src/utils/validateApiPaths.ts
 */

export interface EndpointTest {
  name: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  requiresAuth: boolean;
  requiresId?: boolean;
  testData?: Record<string, unknown>;
  expectedStatus?: number[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.88.167.186/api';

// All endpoints that need to be tested
const ENDPOINTS_TO_TEST: EndpointTest[] = [
  // Authentication
  { name: 'Auth - Sign In', method: 'POST', path: '/auth/signin', requiresAuth: false, testData: { email: 'test@example.com', password: 'password' }, expectedStatus: [200, 400, 401] },
  { name: 'Auth - Get Session', method: 'GET', path: '/auth/me', requiresAuth: true },
  { name: 'Auth - Reset Password', method: 'POST', path: '/auth/reset-password', requiresAuth: false, testData: { email: 'test@example.com' }, expectedStatus: [200, 400, 404] },
  
  // Users
  { name: 'Users - Get (with ID)', method: 'GET', path: '/users/1', requiresAuth: true, requiresId: true },
  { name: 'Users - Search', method: 'GET', path: '/users?email_like=test', requiresAuth: true },
  
  // Pages
  { name: 'Pages - List', method: 'GET', path: '/pages?website_id=1', requiresAuth: true },
  { name: 'Pages - Create', method: 'POST', path: '/pages', requiresAuth: true, testData: { title: 'Test' }, expectedStatus: [200, 201, 400] },
  
  // Assets
  { name: 'Assets - List', method: 'GET', path: '/assets?website_id=1&page=1&page_size=10', requiresAuth: true },
  
  // Business Listings
  { name: 'Business - List', method: 'GET', path: '/business-listings?website_id=1', requiresAuth: true },
  
  // SEO
  { name: 'SEO - Get Metadata', method: 'GET', path: '/seo-metadata?page_id=1', requiresAuth: true },
  
  // Google Business
  { name: 'Google GMB - Posts', method: 'POST', path: '/gmb-posts', requiresAuth: true, testData: { content: 'test' }, expectedStatus: [200, 400, 401, 403] },
  { name: 'Google Tokens - Get', method: 'GET', path: '/google-tokens/1/client-123', requiresAuth: true },
];

interface TestResult {
  endpoint: EndpointTest;
  status: number | 'error';
  error?: string;
  duration: number;
  passed: boolean;
}

export async function validateApiPaths(token?: string): Promise<TestResult[]> {
  console.log(`🔍 Starting API Validation...`);
  console.log(`📍 Base URL: ${API_BASE_URL}`);
  console.log(`🔐 Auth Required: ${token ? 'Yes' : 'No'}`);
  console.log('-------------------------------------------\n');

  const results: TestResult[] = [];

  for (const endpoint of ENDPOINTS_TO_TEST) {
    const result = await testEndpoint(endpoint, token);
    results.push(result);
    
    // Print result with emoji
    const icon = result.passed ? '✅' : result.status === 'error' ? '❌' : '⚠️';
    console.log(`${icon} ${result.endpoint.name}`);
    console.log(`   ${result.endpoint.method} ${result.endpoint.path}`);
    console.log(`   Status: ${result.status} | Duration: ${result.duration}ms`);
    if (result.error) console.log(`   Error: ${result.error}`);
    console.log();
  }

  // Summary
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);
  
  console.log('-------------------------------------------');
  console.log(`📊 Summary: ${passed}/${total} endpoints passed (${percentage}%)`);
  
  if (percentage === 100) {
    console.log('🎉 All endpoints are working!');
  } else if (percentage >= 80) {
    console.log('⚠️  Most endpoints working, check failures above');
  } else {
    console.log('❌ Multiple endpoints failing, review backend configuration');
  }

  return results;
}

async function testEndpoint(endpoint: EndpointTest, token?: string): Promise<TestResult> {
  const startTime = performance.now();
  
  try {
    const url = `${API_BASE_URL}${endpoint.path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (endpoint.requiresAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method: endpoint.method,
      headers,
    };

    if (['POST', 'PATCH', 'PUT'].includes(endpoint.method) && endpoint.testData) {
      options.body = JSON.stringify(endpoint.testData);
    }

    const response = await fetch(url, options);
    const duration = Math.round(performance.now() - startTime);
    
    const expectedStatus = endpoint.expectedStatus || [200, 201];
    const passed = expectedStatus.includes(response.status) || response.ok;

    return {
      endpoint,
      status: response.status,
      duration,
      passed,
    };
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    return {
      endpoint,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
      passed: false,
    };
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).validateApiPaths = validateApiPaths;
  console.log('✨ API validation ready! Run: validateApiPaths(TOKEN)');
}
