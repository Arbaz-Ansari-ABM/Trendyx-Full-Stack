#!/bin/bash

echo "🚀 Deploying Trendyx to Vercel + Railway"
echo "========================================"

# Check if user wants to deploy frontend only or both
echo "Choose deployment option:"
echo "1) Deploy Frontend to Vercel only (backend on Railway)"
echo "2) Deploy Full Stack (requires serverless conversion)"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo "📦 Deploying Frontend to Vercel..."
    cd client
    vercel --prod
    echo "✅ Frontend deployed! Update VITE_API_BASE_URL in Vercel dashboard"
    echo "🔗 Your site will be available at: https://your-project.vercel.app"

elif [ "$choice" = "2" ]; then
    echo "🔧 Full stack deployment requires serverless conversion"
    echo "⚠️  This is advanced and may require code modifications"
    echo "📖 Please follow the detailed guide in Vercel-Deployment-Guide.md"

else
    echo "❌ Invalid choice. Please run again and select 1 or 2."
fi

echo "🎉 Deployment process initiated!"
echo "📋 Check Vercel-Deployment-Guide.md for detailed instructions"
