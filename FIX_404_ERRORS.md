# 🔧 Fix 404 API Errors - Environment Variable Configuration

## Problem
You're seeing 404 errors like:
```
e-learning-management-system-l5yo.onrender.com//api/v1/user/profile:1  Failed to load resource: the server responded with a status of 404
```

Notice the **double slash** (`//`) in the URL - this indicates the `VITE_API_URL` environment variable is either:
1. Not set correctly
2. Has a trailing slash
3. Missing the `https://` protocol

## ✅ Solution: Set Environment Variable Correctly

### Step 1: Go to Render Dashboard
1. Open your Render dashboard: https://dashboard.render.com
2. Click on your **Frontend service** (the static site)

### Step 2: Set Environment Variable
1. Click on the **"Environment"** tab
2. Look for `VITE_API_URL` in the list
3. If it exists, click **"Edit"**
4. If it doesn't exist, click **"Add Environment Variable"**

### Step 3: Enter Correct Value
**Key:** `VITE_API_URL`

**Value:** Your backend URL **WITHOUT trailing slash** and **WITH https://**

✅ **CORRECT Examples:**
```
https://e-learning-management-system-l5yo.onrender.com
```

❌ **WRONG Examples:**
```
https://e-learning-management-system-l5yo.onrender.com/          (has trailing slash)
e-learning-management-system-l5yo.onrender.com                  (missing https://)
https://e-learning-management-system-l5yo.onrender.com/api      (includes /api path)
```

### Step 4: Save and Redeploy
1. Click **"Save Changes"**
2. Render will automatically redeploy your frontend (wait 5-10 minutes)
3. Or manually trigger a redeploy by clicking **"Manual Deploy"** → **"Deploy latest commit"**

## 🔍 How to Verify

### Check Environment Variable in Render
1. Go to your Frontend service → Environment tab
2. Verify `VITE_API_URL` is set exactly as shown above

### Check After Redeploy
1. Open your frontend URL in browser
2. Open **DevTools** (F12) → **Console** tab
3. Look for API errors - they should now show the correct URL without double slashes
4. Check **Network** tab → API requests should go to:
   ```
   https://e-learning-management-system-l5yo.onrender.com/api/v1/...
   ```
   (NOT `//api/v1/...`)

## 🐛 Troubleshooting

### Still Getting 404 Errors?
1. **Verify backend is running:**
   - Visit: `https://e-learning-management-system-l5yo.onrender.com/`
   - Should show: `{"message":"E-learning Management System API is running","status":"success"}`

2. **Check environment variable format:**
   - Must start with `https://`
   - Must NOT end with `/`
   - Must be the backend URL, not frontend URL

3. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in Incognito/Private window

4. **Check Render build logs:**
   - Go to your Frontend service → **Logs** tab
   - Look for any build errors
   - Verify the build completed successfully

### Double Slash Still Appearing?
The code now automatically removes trailing slashes, but if you still see double slashes:
1. Make sure you've redeployed after setting the environment variable
2. Check that the environment variable doesn't have extra spaces
3. Try removing and re-adding the environment variable

## 📝 Quick Checklist

- [ ] `VITE_API_URL` is set in Render frontend environment variables
- [ ] Value starts with `https://`
- [ ] Value does NOT end with `/`
- [ ] Value is your backend URL (not frontend)
- [ ] Frontend has been redeployed after setting the variable
- [ ] Backend is running and accessible
- [ ] Browser cache cleared

## 🎯 Expected Result

After fixing, API calls should work correctly:
- ✅ `/api/v1/user/profile` → `https://backend.onrender.com/api/v1/user/profile`
- ✅ `/api/v1/course/published-courses` → `https://backend.onrender.com/api/v1/course/published-courses`

No more double slashes or 404 errors!
