#!/bin/bash

# Flobit Analytics - Deployment Helper Script
# This script helps you prepare and deploy your application

echo "🚀 Flobit Analytics - Deployment Helper"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo "📝 You have uncommitted changes. Committing..."
    git add .
    
    # Prompt for commit message
    read -p "Enter commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Update: Ready for deployment"
    fi
    
    git commit -m "$commit_msg"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✅ Git remote 'origin' exists"
else
    echo ""
    echo "⚠️  No Git remote found"
    echo "Please create a GitHub repository and run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/flobit-analytics.git"
    exit 1
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi

echo ""
echo "🎉 Your code is now on GitHub!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Set Root Directory: apps/web"
echo "4. Add environment variables (see VERCEL_DEPLOYMENT.md)"
echo "5. Click Deploy!"
echo ""
echo "📖 Full guide: ./VERCEL_DEPLOYMENT.md"
echo "⚡ Quick guide: ./DEPLOY_QUICKSTART.md"
echo ""
