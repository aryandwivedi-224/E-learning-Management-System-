# Render Deployment Guide for E-learning Management System

This guide will help you deploy both the frontend and backend on Render and connect them properly.

## Prerequisites

1. GitHub account with your code pushed to a repository
2. Render account (sign up at https://render.com)
3. MongoDB Atlas account (or your MongoDB connection string)
4. Stripe account (for payments)
5. Cloudinary account (for media uploads)

## Step 1: Deploy Backend

### 1.1 Create Backend Service on Render

1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `e-learning-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd Backend && npm install`
   - **Start Command**: `cd Backend && npm start`
   - **Root Directory**: Leave empty (or set to `Backend` if needed)

### 1.2 Set Environment Variables

In the Render dashboard, go to "Environment" tab and add:

```
PORT=10000
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string_here
FRONTEND_URL=https://your-frontend-app.onrender.com
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

**Important Notes:**
- `FRONTEND_URL` should be your frontend Render URL (you'll update this after deploying frontend)
- `JWT_SECRET` should be a long, random string (you can generate one online)
- `MONGO_URI` format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### 1.3 Deploy

Click "Create Web Service" and wait for deployment. Note the URL (e.g., `https://e-learning-backend.onrender.com`)

## Step 2: Deploy Frontend

### 2.1 Create Frontend Service on Render

1. Go to your Render dashboard
2. Click "New +" → "Static Site" (or "Web Service" if using preview)
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `e-learning-frontend`
   - **Build Command**: `cd Frontend && npm install && npm run build`
   - **Publish Directory**: `Frontend/dist`
   - **Root Directory**: Leave empty (or set to `Frontend` if needed)

### 2.2 Set Environment Variables

In the Render dashboard, go to "Environment" tab and add:

```
VITE_API_URL=https://your-backend-app.onrender.com
```

Replace `your-backend-app.onrender.com` with your actual backend URL from Step 1.3

### 2.3 Deploy

Click "Create Static Site" and wait for deployment.

## Step 3: Update CORS and URLs

### 3.1 Update Backend CORS

After deploying frontend, update the backend environment variable:
- Go to your backend service on Render
- Update `FRONTEND_URL` to your frontend URL
- Redeploy the backend

### 3.2 Verify Connection

1. Open your frontend URL
2. Open browser DevTools (F12) → Network tab
3. Try to make an API call (login, etc.)
4. Check if requests are going to the correct backend URL
5. Check for CORS errors in the console

## Step 4: Common Issues and Solutions

### Issue: CORS Errors

**Solution**: 
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check that `withCredentials: true` is set in axios.js
- Verify CORS middleware in `Backend/index.js` includes your frontend URL

### Issue: Cookies Not Working

**Solution**:
- Ensure `secure: true` and `sameSite: "none"` in cookie settings (already configured in `generateToken.js`)
- Verify `withCredentials: true` in axios.js
- Check that both frontend and backend are using HTTPS (Render provides this automatically)

### Issue: Environment Variables Not Working

**Solution**:
- For frontend: Vite requires `VITE_` prefix for environment variables
- Restart the service after adding environment variables
- Check that variables are set in Render dashboard, not just in code

### Issue: Backend Not Starting

**Solution**:
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all required environment variables are set
- Check that `package.json` has correct start script

### Issue: Frontend Build Fails

**Solution**:
- Check that all dependencies are in `package.json`
- Verify Node version compatibility
- Check build logs in Render dashboard

## Step 5: Testing the Deployment

1. **Test Backend Health**: Visit `https://your-backend.onrender.com/` - should return JSON with status message
2. **Test Frontend**: Visit your frontend URL - should load the app
3. **Test API Connection**: Try logging in or making any API call
4. **Check Network Tab**: Verify requests are going to correct backend URL

## Additional Configuration

### MongoDB Atlas Setup

1. Create a cluster on MongoDB Atlas
2. Create a database user
3. Whitelist Render IPs (or use 0.0.0.0/0 for all IPs)
4. Get connection string and use it as `MONGO_URI`

### Stripe Setup

1. Get API keys from Stripe Dashboard
2. Use test keys for development
3. Use live keys for production

### Cloudinary Setup

1. Create account on Cloudinary
2. Get credentials from dashboard
3. Add to backend environment variables

## Render Service URLs

After deployment, you'll have:
- **Backend**: `https://your-backend-name.onrender.com`
- **Frontend**: `https://your-frontend-name.onrender.com`

Make sure to update:
- Frontend `VITE_API_URL` → Backend URL
- Backend `FRONTEND_URL` → Frontend URL

## Support

If you encounter issues:
1. Check Render service logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Ensure both services are deployed and running
