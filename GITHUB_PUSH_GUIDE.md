# GitHub Push and Deploy Guide

This guide will help you push your code to GitHub and deploy directly from there to Render.

## Step 1: Install Git (if not installed)

If Git is not installed on your system:

1. Download Git from: https://git-scm.com/download/win
2. Install it with default settings
3. Restart your terminal/command prompt

## Step 2: Initialize Git Repository (if not already done)

Open terminal/command prompt in your project root directory and run:

```bash
git init
```

## Step 3: Create .gitignore (if needed)

Make sure your `.gitignore` includes:

```
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local
.env.production

# Build outputs
Frontend/dist/
Backend/upload/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

## Step 4: Add All Files to Git

```bash
# Add all files
git add .

# Check what will be committed
git status
```

## Step 5: Commit Changes

```bash
git commit -m "Add deployment configuration for Render - Backend and Frontend setup with CORS, environment variables, and deployment files"
```

## Step 6: Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it: `e-learning-management-system` (or your preferred name)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 7: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add remote (replace YOUR_USERNAME and REPO_NAME with your actual values)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys

## Step 8: Deploy on Render

### Deploy Backend

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Click "Connect account" and connect your GitHub account
4. Select your repository
5. Configure:
   - **Name**: `e-learning-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `Backend` if Render requires it)
   - **Build Command**: `cd Backend && npm install`
   - **Start Command**: `cd Backend && npm start`
6. Click "Advanced" → "Add Environment Variable" and add all variables from `ENVIRONMENT_VARIABLES.md`
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. **Note the backend URL** (e.g., `https://e-learning-backend.onrender.com`)

### Deploy Frontend

1. In Render dashboard, click "New +" → "Static Site"
2. Select your repository
3. Configure:
   - **Name**: `e-learning-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `Frontend` if Render requires it)
   - **Build Command**: `cd Frontend && npm install && npm run build`
   - **Publish Directory**: `Frontend/dist`
4. Click "Add Environment Variable":
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL from step above (e.g., `https://e-learning-backend.onrender.com`)
5. Click "Create Static Site"
6. Wait for deployment (5-10 minutes)
7. **Note the frontend URL**

### Update Backend CORS

1. Go back to your backend service on Render
2. Click "Environment" tab
3. Update `FRONTEND_URL` with your frontend URL
4. Click "Save Changes" (this will trigger a redeploy)

## Step 9: Test Deployment

1. Visit your backend URL: `https://your-backend.onrender.com/`
   - Should see: `{"message":"E-learning Management System API is running","status":"success"}`

2. Visit your frontend URL
   - Should load your application

3. Open browser DevTools (F12) → Console
4. Try to login or make an API call
5. Check for any errors

## Troubleshooting

### Git Push Issues

**Authentication Error:**
- Use Personal Access Token instead of password
- Generate token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Use token as password when pushing

**Permission Denied:**
- Make sure you have write access to the repository
- Check repository is not private if using free tier

### Render Deployment Issues

**Build Fails:**
- Check Render logs for specific errors
- Verify all dependencies are in `package.json`
- Check Node version compatibility

**Service Won't Start:**
- Check environment variables are all set
- Verify MongoDB connection string is correct
- Check Render logs for errors

**CORS Errors:**
- Make sure `FRONTEND_URL` in backend matches frontend URL exactly
- Verify both services are deployed
- Check browser console for specific CORS error

## Quick Reference Commands

```bash
# Check git status
git status

# Add files
git add .

# Commit
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Check remote
git remote -v

# View logs
git log
```

## Environment Variables Quick Copy

### Backend (Set in Render)
```
PORT=10000
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
FRONTEND_URL=https://your-frontend.onrender.com
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### Frontend (Set in Render)
```
VITE_API_URL=https://your-backend.onrender.com
```

## Next Steps After Deployment

1. Test all functionality
2. Set up custom domains (optional)
3. Configure auto-deploy on git push (enabled by default on Render)
4. Monitor logs and errors
5. Set up error tracking (optional)
