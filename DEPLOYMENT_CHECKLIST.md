# Render Deployment Checklist

Use this checklist to ensure everything is set up correctly for deployment.

## Pre-Deployment

- [ ] Code is pushed to GitHub repository
- [ ] All controller files exist (check `Backend/controllers/` directory)
- [ ] MongoDB Atlas cluster is created and accessible
- [ ] Stripe account is set up with API keys
- [ ] Cloudinary account is set up with credentials

## Backend Deployment

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set build command: `cd Backend && npm install`
- [ ] Set start command: `cd Backend && npm start`
- [ ] Set all environment variables:
  - [ ] `PORT=10000`
  - [ ] `NODE_ENV=production`
  - [ ] `MONGO_URI` (MongoDB connection string)
  - [ ] `JWT_SECRET` (secure random string)
  - [ ] `FRONTEND_URL` (will update after frontend deployment)
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_PUBLISHABLE_KEY`
  - [ ] `CLOUD_NAME`
  - [ ] `API_KEY` (Cloudinary)
  - [ ] `API_SECRET` (Cloudinary)
- [ ] Deploy backend service
- [ ] Test backend health endpoint: `https://your-backend.onrender.com/`
- [ ] Note the backend URL

## Frontend Deployment

- [ ] Create new Static Site on Render
- [ ] Connect GitHub repository
- [ ] Set build command: `cd Frontend && npm install && npm run build`
- [ ] Set publish directory: `Frontend/dist`
- [ ] Set environment variable:
  - [ ] `VITE_API_URL` (your backend URL from above)
- [ ] Deploy frontend service
- [ ] Note the frontend URL

## Post-Deployment

- [ ] Update backend `FRONTEND_URL` environment variable with frontend URL
- [ ] Redeploy backend (to apply CORS changes)
- [ ] Test frontend loads correctly
- [ ] Test API connection from frontend (check browser console)
- [ ] Test login/signup functionality
- [ ] Verify cookies are being set (check browser DevTools → Application → Cookies)
- [ ] Test file uploads (if applicable)
- [ ] Test payment flow (if applicable)

## Troubleshooting

If something doesn't work:

1. **Check Render Logs**
   - Backend: Service → Logs
   - Frontend: Service → Logs

2. **Check Browser Console**
   - Open DevTools (F12)
   - Check Console for errors
   - Check Network tab for failed requests

3. **Verify Environment Variables**
   - All variables are set correctly
   - No typos in variable names
   - Values are correct (especially URLs)

4. **Test Backend Directly**
   - Visit backend URL in browser
   - Should see JSON response with status message

5. **Check CORS**
   - Verify `FRONTEND_URL` in backend matches frontend URL exactly
   - Check browser console for CORS errors

## Quick Test Commands

After deployment, test these endpoints:

```bash
# Backend health check
curl https://your-backend.onrender.com/

# Should return: {"message":"E-learning Management System API is running","status":"success"}
```

## Important URLs to Save

- Backend URL: `https://____________________.onrender.com`
- Frontend URL: `https://____________________.onrender.com`
