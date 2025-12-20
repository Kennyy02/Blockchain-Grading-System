# Fix for Session/Login Issues After Deployment

## Problem
After every Railway redeploy:
1. Admin account fails to load data
2. Refreshing the page logs the user out
3. After logging back in, everything works fine

## Root Causes

### 1. **Asset Cache Conflicts**
- Old cached JavaScript/CSS assets conflict with new session data
- Inertia.js wasn't detecting asset changes, so browsers used stale assets
- This caused authentication state mismatches

### 2. **Session Invalidation During Deployment**
- During deployment, there's a brief window where sessions might be invalidated
- If `APP_KEY` changes, all encrypted sessions become invalid
- Database connection might be briefly unavailable

### 3. **Missing Error Handling**
- No graceful handling of session failures during deployment transitions
- Errors in middleware caused cascading failures

## Solutions Implemented

### 1. Asset Versioning (Fixed)
**File:** `app/Http/Middleware/HandleInertiaRequests.php`

Added proper asset versioning that:
- Uses the build manifest file's hash as version
- Automatically changes when assets are rebuilt
- Forces Inertia to reload assets after deployment
- Prevents stale asset cache issues

```php
public function version(Request $request): ?string
{
    $manifestPath = public_path('build/manifest.json');
    
    if (file_exists($manifestPath)) {
        return md5_file($manifestPath);
    }
    
    return md5(config('app.version', app()->version()) . config('app.key', ''));
}
```

### 2. Session Error Handling (Fixed)
**File:** `app/Http/Middleware/HandleInertiaRequests.php`

Added try-catch around user authentication:
- Gracefully handles session failures
- Prevents middleware errors during deployment
- Logs warnings instead of crashing

### 3. Important Railway Configuration

**Ensure these environment variables are set in Railway:**

1. **APP_KEY** - Must be stable and NOT change between deployments
   ```
   APP_KEY=base64:YOUR_STABLE_KEY_HERE
   ```
   ⚠️ **CRITICAL:** If `APP_KEY` changes, all sessions become invalid!

2. **SESSION_DRIVER** - Use database for persistence
   ```
   SESSION_DRIVER=database
   ```

3. **SESSION_LIFETIME** - Set appropriate lifetime
   ```
   SESSION_LIFETIME=120
   ```

4. **SESSION_SECURE_COOKIE** - Enable for HTTPS
   ```
   SESSION_SECURE_COOKIE=true
   ```

## How It Works Now

1. **Before Deployment:**
   - User is logged in with valid session
   - Assets are cached in browser

2. **During Deployment:**
   - New assets are built with new manifest hash
   - Asset version changes
   - Session remains valid (if APP_KEY is stable)

3. **After Deployment:**
   - Inertia detects asset version change
   - Automatically reloads page with new assets
   - Session is preserved (if APP_KEY didn't change)
   - User stays logged in

4. **If Session Fails:**
   - Error is caught gracefully
   - User is shown as logged out
   - Can log back in normally

## Verification

After deployment, check:
1. ✅ User stays logged in (no forced logout)
2. ✅ Data loads correctly without refresh
3. ✅ No console errors about session/auth
4. ✅ Assets load from new build (check Network tab)

## Troubleshooting

### Still Getting Logged Out?

1. **Check APP_KEY:**
   ```bash
   # In Railway, verify APP_KEY is set and stable
   # If it changed, all sessions are invalid
   ```

2. **Check Session Table:**
   ```sql
   SELECT * FROM sessions ORDER BY last_activity DESC LIMIT 10;
   ```

3. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear site data in browser settings

4. **Check Railway Logs:**
   - Look for session-related errors
   - Check for database connection issues during deployment

### Session Expiring Too Quickly?

Increase `SESSION_LIFETIME` in Railway:
```
SESSION_LIFETIME=1440  # 24 hours
```

### Assets Not Updating?

1. Verify `public/build/manifest.json` exists after build
2. Check that build process completes successfully
3. Verify asset versioning is working (check Inertia response headers)

## Best Practices

1. **Never change APP_KEY** after initial setup
2. **Use database sessions** for persistence across deployments
3. **Monitor deployment logs** for session errors
4. **Test after each deployment** to verify session persistence
5. **Keep SESSION_LIFETIME** reasonable (not too short, not too long)

## Additional Notes

- The asset versioning uses the manifest file hash, which changes on every build
- This ensures browsers always get fresh assets after deployment
- Session errors are now handled gracefully instead of crashing
- Users will only be logged out if their session actually expires or APP_KEY changes

