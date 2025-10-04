# Deployment Guide

This guide explains how to deploy the Trendyx e-commerce application to Netlify (frontend) and Render (backend).

## Prerequisites

Before deploying, make sure you have accounts on:
- [Netlify](https://netlify.com) for frontend deployment
- [Render](https://render.com) for backend deployment
- [MongoDB Atlas](https://cloud.mongodb.com) for database
- [Cloudinary](https://cloudinary.com) for image storage
- [Stripe](https://stripe.com) for payment processing

## Backend Deployment (Render)

### Step 1: Prepare Environment Variables

1. Copy the example environment file:
   ```bash
   cp server/.env.example server/.env
   ```

2. Fill in the actual values in `server/.env`:
   - `MONGODB_URL`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

### Step 2: Deploy to Render

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `trendyx-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Set the following environment variables in Render dashboard:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `MONGODB_URL` (your MongoDB connection string)
   - `JWT_SECRET` (your JWT secret)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `FRONTEND_URL` (your Netlify site URL, e.g., `https://your-site.netlify.app`)

4. **Deploy**
   - Click "Create Blueprint"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://trendyx-backend.onrender.com`)

## Frontend Deployment (Netlify)

### Step 1: Build the Application

1. **Build locally** (optional, for testing):
   ```bash
   cd client
   npm run build
   ```

2. **Set Environment Variables**
   - In Netlify dashboard, go to Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-render-backend-url.onrender.com`

### Step 2: Deploy to Netlify

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Base directory**: `client` (if deploying from root) or leave empty
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. **Environment Variables**
   - `VITE_API_BASE_URL`: Your Render backend URL (e.g., `https://trendyx-backend.onrender.com`)

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete

## Configuration Files

The following configuration files have been created:

- `client/netlify.toml` - Netlify deployment configuration
- `server/render.yaml` - Render deployment configuration
- `client/.env.example` - Frontend environment variables template
- `server/.env.example` - Backend environment variables template

## API Configuration

The frontend has been configured to use environment variables for API calls:

- All API calls now use `API_BASE_URL` from environment variables
- Fallback to `http://localhost:5000` for local development
- Production API calls will use your deployed Render backend URL

## Post-Deployment Steps

1. **Update API Base URL**
   - In Netlify dashboard, set `VITE_API_BASE_URL` to your Render backend URL
   - Redeploy the frontend

2. **Test the Application**
   - Visit your Netlify site URL
   - Test user registration, login, and product browsing
   - Test payment flow with Stripe test cards

3. **Domain Configuration** (Optional)
   - Configure custom domains in both Netlify and Render if needed

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your Render backend allows requests from your Netlify domain
   - Check CORS configuration in your Express server

2. **Environment Variables Not Loading**
   - Verify environment variables are set correctly in both platforms
   - Check that variable names match exactly

3. **Build Failures**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility
   - Verify build commands in configuration files

### Support

If you encounter issues:
1. Check the deployment logs in both Netlify and Render dashboards
2. Verify all environment variables are set correctly
3. Ensure your MongoDB, Cloudinary, and Stripe accounts are properly configured

## Local Development

To run the application locally after deployment setup:

```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

The frontend will automatically use `http://localhost:5000` for API calls when running locally.
