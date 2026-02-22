# API Paths Validation Checklist

This document lists all API endpoints used in your Next.js frontend after migration from Supabase to Express.js/Node.js + AWS RDS PostgreSQL.

**Base URL (Development):** `http://3.88.167.186/api`
**Base URL (Production):** `https://api.rctechbridge.com/api`

---

## Authentication Endpoints

| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/auth/signup` | POST | [src/lib/api-client.ts](src/lib/api-client.ts#L86) | ☐ |
| `/auth/signin` | POST | [src/lib/api-client.ts](src/lib/api-client.ts#L100) | ☐ |
| `/auth/signout` | POST | [src/lib/api-client.ts](src/lib/api-client.ts#L115) | ☐ |
| `/auth/me` | GET | [src/lib/api-client.ts](src/lib/api-client.ts#L130) | ☐ |
| `/auth/reset-password` | POST | [src/lib/api-client.ts](src/lib/api-client.ts#L148) | ☐ |
| `/auth/confirm-reset-password` | POST | [src/lib/api-client.ts](src/lib/api-client.ts#L158) | ☐ |

---

## User Endpoints

| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/users/{id}` | GET | [src/hooks/useUser.ts](src/hooks/useUser.ts#L6) | ☐ |
| `/users/{id}` | PATCH | [src/components/user-profile/UserInfoCard.tsx](src/components/user-profile/UserInfoCard.tsx#L30) | ☐ |
| `/users?email_like={search}` | GET | [src/hooks/useSearchUser.ts](src/hooks/useSearchUser.ts#L19) | ☐ |

---

## Page Management Endpoints

| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/pages?website_id={id}` | GET | [src/hooks/usePages.ts](src/hooks/usePages.ts#L14) | ☐ |
| `/pages` | POST | [src/hooks/usePageManager.ts](src/hooks/usePageManager.ts#L85) | ☐ |
| `/pages/{id}` | PATCH | [src/hooks/usePageManager.ts](src/hooks/usePageManager.ts#L115) | ☐ |
| `/pages/{id}` | DELETE | [src/hooks/usePageManager.ts](src/hooks/usePageManager.ts#L132) | ☐ |

---

## Asset/Image Endpoints

| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/assets?website_id={id}&page={page}&page_size={size}` | GET | [src/hooks/useImage.ts](src/hooks/useImage.ts#L20) | ☐ |

---

## Business Listing Endpoints

| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/business-listings?website_id={id}` | GET | [src/hooks/useBusinessListing.ts](src/hooks/useBusinessListing.ts#L7) | ☐ |
| `/business-listings?website_id={id}` | GET | [src/hooks/useBusinessByWebsiteId.ts](src/hooks/useBusinessByWebsiteId.ts#L16) | ☐ |

---

## Google Business & OAuth Endpoints

| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/gmb-posts` | POST | [src/utils/googleApi.ts](src/utils/googleApi.ts#L71) | ☐ |
| `/google-tokens/{userId}/{clientId}` | GET | [src/lib/google-token-manager.ts](src/lib/google-token-manager.ts#L13) | ☐ |
| `/google-tokens/{userId}/{clientId}` | PUT | [src/lib/google-token-manager.ts](src/lib/google-token-manager.ts#L29) | ☐ |
| `/google-tokens/{userId}/{clientId}` | DELETE | [src/lib/google-token-manager.ts](src/lib/google-token-manager.ts#L53) | ☐ |
| `/business/{clientId}` | PUT | [src/lib/google-token-manager.ts](src/lib/google-token-manager.ts#L56) | ☐ |

---

## SEO Metadata Endpoints

| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/seo-metadata?page_id={id}` | GET | [src/hooks/useSeo.ts](src/hooks/useSeo.ts#L14) | ☐ |

---

## Frontend Next.js API Routes

| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/api/content-agent` | POST | [src/hooks/useContentAgent.ts](src/hooks/useContentAgent.ts#L28) | ☐ |
| `/api/auth/google/refresh` | POST | [src/utils/googleApi.ts](src/utils/googleApi.ts#L229) | ☐ |

---

## Testing with Postman/cURL

### Quick Test Template

```bash
# Test GET endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.rctechbridge.com/api/auth/me

# Test POST endpoints  
curl -X POST https://api.rctechbridge.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test PATCH endpoints
curl -X PATCH https://api.rctechbridge.com/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

---

## Validation Steps

1. **Check Backend Routes**: Verify your Express.js backend has all these routes defined
2. **Check Database Migrations**: Verify AWS RDS PostgreSQL has all required tables
3. **Test Authentication Flow**: 
   - Sign up (POST `/auth/signup`)
   - Sign in (POST `/auth/signin`)
   - Get session (GET `/auth/me`)
4. **Test User Operations**:
   - Get user (GET `/users/{id}`)
   - Update user (PATCH `/users/{id}`)
   - Search users (GET `/users?email_like=...`)
5. **Test Page Management** (full CRUD)
6. **Test Google Business Integration** (if enabled)
7. **Load Test**: Monitor network tab in browser DevTools for:
   - 200/201 responses for successful requests
   - Proper error handling (4xx, 5xx status codes)
   - Response times

---

## Common Issues & Solutions

### Issue: "Path is required" error
- **Cause**: Path parameter is `null` or empty
- **Solution**: Check that required IDs are available before making the request

### Issue: 404 responses
- **Cause**: Backend endpoint doesn't exist or URL format is incorrect
- **Solution**: Compare with backend route definitions

### Issue: 401/403 responses
- **Cause**: JWT token missing, expired, or invalid
- **Solution**: Check `Authorization` header and token validity

### Issue: CORS errors
- **Cause**: Frontend domain not whitelisted on backend
- **Solution**: Update Express CORS configuration with Vercel deployment URL

---

## Next Steps

1. Check each endpoint marked with ☐ against your Express.js backend
2. Enable browser DevTools Network tab to monitor all requests
3. Create backend routes for any missing endpoints
4. Test each endpoint systematically before deploying to production

