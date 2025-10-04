# 🚀 Deploy Trendyx on Vercel (Frontend) + Railway (Backend)

## Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

### Step 1: Deploy Backend on Railway

1. **Go to [Railway](https://railway.app)**
2. **Create New Project** → **Deploy from GitHub**
3. **Connect your repository**
4. **Configure Deployment:**
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Set Environment Variables in Railway:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URL=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   FRONTEND_URL=https://your-app.vercel.app
   ```

6. **Deploy**: Click "Deploy" and note your backend URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend on Vercel

1. **Go to [Vercel Dashboard](https://vercel.com)**
2. **Import Project** → **From Git**
3. **Connect your repository**
4. **Configure Project:**
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Set Environment Variables in Vercel:**
   ```
   VITE_API_BASE_URL=https://your-app.railway.app
   ```

6. **Deploy**: Click "Deploy"

### Step 3: Update API Configuration

Update `client/.env`:
```bash
VITE_API_BASE_URL=https://your-app.railway.app
```

---

## Option 2: Full Deployment on Vercel (Advanced)

If you want everything on Vercel, you'll need to convert your Express.js backend to serverless functions.

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy Frontend
```bash
cd client
vercel --prod
```

### Step 4: Deploy Backend as Serverless Functions
```bash
# This requires converting your Express routes to serverless functions
# Each route becomes a separate function in /api directory
vercel --prod
```

---

## 📋 Prerequisites (Required Services)

- **[Vercel Account](https://vercel.com)** (Frontend) - Free tier available
- **[Railway Account](https://railway.app)** (Backend) - Free tier available
- **[MongoDB Atlas](https://cloud.mongodb.com)** (Database) - Free tier available
- **[Cloudinary](https://cloudinary.com)** (Images) - Free tier available
- **[Stripe](https://stripe.com)** (Payments) - Test mode available

---

## 🔧 Environment Variables Setup

### Railway (Backend):
```
NODE_ENV=production
PORT=5000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/trendyx
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel (Frontend):
```
VITE_API_BASE_URL=https://your-app.railway.app
```

---

## 🚀 Quick Deploy Commands

```bash
# Deploy Frontend to Vercel
cd client
vercel --prod

# Deploy Backend to Railway (via dashboard)
# Go to https://railway.app and deploy from GitHub
```

---

## ✅ Post-Deployment Steps

1. **Update API Base URL** in Vercel dashboard
2. **Test the Application** at your Vercel URL
3. **Verify Backend Connection** by checking API calls
4. **Test Payment Flow** with demo card details

---

## 🛠️ Troubleshooting

### Common Issues:
1. **CORS Errors**: Update `FRONTEND_URL` in Railway with your Vercel domain
2. **API Connection**: Ensure `VITE_API_BASE_URL` points to correct Railway backend URL
3. **Environment Variables**: Double-check all variables are set correctly

### Support:
- **Vercel Dashboard**: Check function logs and deployment status
- **Railway Dashboard**: Monitor backend logs and database connections

---

## 🎯 Your Deployment URLs

After deployment:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **Admin Panel**: `https://your-app.vercel.app/admin/dashboard`

The application will be fully functional with all e-commerce features! 🎉
