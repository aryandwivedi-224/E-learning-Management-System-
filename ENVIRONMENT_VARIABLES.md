# Environment Variables Reference

## Backend Environment Variables (Set in Render Dashboard)

### Required Variables

```bash
# Server
PORT=10000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_secure_random_string_minimum_32_characters

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-app.onrender.com

# Stripe (Payment Processing)
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)

# Cloudinary (Media Storage)
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
```

## Frontend Environment Variables (Set in Render Dashboard)

### Required Variables

```bash
# Backend API URL
VITE_API_URL=https://your-backend-app.onrender.com
```

**Important**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client-side code.

## How to Set Environment Variables in Render

1. Go to your service dashboard on Render
2. Click on "Environment" in the left sidebar
3. Click "Add Environment Variable"
4. Enter the key and value
5. Click "Save Changes"
6. The service will automatically redeploy

## Security Notes

- Never commit `.env` files to Git
- Use strong, random values for `JWT_SECRET`
- Use test keys for Stripe during development
- Use production keys only when ready for live payments
- Keep your MongoDB credentials secure

## Testing Locally

Create `.env` files in both `Backend/` and `Frontend/` directories with the same variables (without `VITE_` prefix for backend).
