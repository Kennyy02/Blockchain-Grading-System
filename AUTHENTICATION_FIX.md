# Authentication Fix - Automatic Logout Issue

## Problem
After logging in, users are automatically logged out with 401 Unauthorized errors on all API requests.

## Root Causes Identified

1. **Sanctum Stateful Domains**: Sanctum wasn't recognizing `localhost:5173` and other common frontend origins as stateful domains
2. **CORS Configuration**: Missing CORS configuration to allow credentials from frontend origins
3. **Service Credentials**: Some services were using `credentials: 'same-origin'` instead of `credentials: 'include'` for cross-origin requests
4. **401 Error Handling**: Services were immediately redirecting on 401 errors, causing logout loops

## Fixes Applied

### 1. Updated Sanctum Configuration (`config/sanctum.php`)
- Added `localhost:5173`, `localhost:5174` to stateful domains
- Added `*.onrender.com` and `smmsiblockchain.onrender.com` for production

### 2. Created CORS Configuration (`config/cors.php`)
- Allows credentials from frontend origins
- Includes common localhost ports (5173, 5174, 3000)
- Supports both development and production environments

### 3. Fixed Service Credentials
Updated all critical services to use `credentials: 'include'`:
- `AdminGradeService`
- `AdminParentService`
- `AdminAcademicYearService`
- `AdminSemesterService`
- `AdminClassSubjectService`
- `AdminAnnouncementService`
- `AdminTeacherService`
- `AdminStudentService`

### 4. Improved 401 Error Handling
- Services now throw errors instead of immediately redirecting
- Prevents automatic logout loops
- Allows components to handle errors gracefully

### 5. Made URLs Absolute
- All services now convert relative URLs to absolute URLs
- Ensures proper cross-origin request handling

## Environment Variables Needed

Make sure these are set in your `.env` file:

```env
# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Sanctum Stateful Domains (optional, defaults are set)
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,localhost:5173,localhost:5174,127.0.0.1,127.0.0.1:8000,smmsiblockchain.onrender.com

# Session Configuration
SESSION_SAME_SITE=lax
SESSION_SECURE_COOKIE=false  # Set to true in production with HTTPS
```

## Testing

1. **Clear browser cookies** for the site
2. **Log in** again
3. **Check browser console** - should see successful API requests
4. **Verify dashboard loads** without 401 errors

## If Still Having Issues

### Check Session Cookie Settings
If accessing from `localhost:5173` to `smmsiblockchain.onrender.com` (cross-origin):
- Set `SESSION_SAME_SITE=none` in production
- Set `SESSION_SECURE_COOKIE=true` in production (requires HTTPS)

### Verify CORS Headers
Check browser Network tab:
- Response should include `Access-Control-Allow-Credentials: true`
- Response should include `Access-Control-Allow-Origin: http://localhost:5173` (or your frontend URL)

### Check Sanctum Stateful Domains
Verify in `config/sanctum.php` that your frontend origin is in the `stateful` array.

## Notes

- If using Vite proxy, make sure it's configured to forward requests to the backend
- For production, ensure HTTPS is enabled and `SESSION_SECURE_COOKIE=true`
- Cross-origin cookies require `SameSite=None` and `Secure=true` in modern browsers

