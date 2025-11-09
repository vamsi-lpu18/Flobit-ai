# 🚀 Vercel Deployment Guide for Flobit Analytics

This guide will walk you through deploying your Flobit Analytics application to Vercel.

## 📋 Prerequisites

Before deploying, ensure you have:

- [x] A GitHub account
- [x] A Vercel account (sign up at https://vercel.com)
- [x] PostgreSQL database accessible from the internet (see database options below)
- [x] Groq API key
- [x] Git installed locally

---

## Step 1: Prepare Your Database

You need a PostgreSQL database accessible from the internet. Choose one of these options:

### Option A: Vercel Postgres (Recommended - Easiest)

1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the connection string (it will look like: `postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb`)

### Option B: Neon (Free Tier Available)

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string

### Option C: Supabase (Free Tier Available)

1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the connection string

### Option D: Railway (Free Tier Available)

1. Sign up at https://railway.app
2. Create new project → Add PostgreSQL
3. Copy the connection string

---

## Step 2: Push Your Code to GitHub

### 2.1 Initialize Git Repository (if not already done)

```bash
# Navigate to your project directory
cd C:\Users\Hey\Desktop\flobit

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Flobit Analytics ready for deployment"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Name it: `flobit-analytics`
4. Don't initialize with README (you already have one)
5. Click "Create repository"

### 2.3 Push to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/flobit-analytics.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Frontend + Backend to Vercel

### 3.1 Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub account and authorize Vercel
4. Find and select `flobit-analytics` repository

### 3.2 Configure Project Settings

**Framework Preset:** Next.js

**Root Directory:** `apps/web` (Important!)

**Build Command:**

```bash
cd ../.. && npm install && cd apps/web && npm run build
```

**Output Directory:** `.next`

**Install Command:**

```bash
npm install
```

### 3.3 Configure Environment Variables

Click "Environment Variables" and add the following:

#### Required Variables:

| Name                   | Value                                                 | Where to get it                      |
| ---------------------- | ----------------------------------------------------- | ------------------------------------ |
| `DATABASE_URL`         | Your PostgreSQL connection string                     | From Step 1 (your database provider) |
| `NEXT_PUBLIC_API_BASE` | `/api`                                                | Keep as is                           |
| `NEXT_PUBLIC_APP_URL`  | Leave empty for now (will auto-fill after deployment) | -                                    |
| `GROQ_API_KEY`         | Your Groq API key                                     | From https://console.groq.com        |
| `VANNA_API_BASE_URL`   | Leave empty for now (add after Vanna deployment)      | -                                    |

**Important:** Make sure to select all environments (Production, Preview, Development) for each variable.

### 3.4 Deploy

1. Click "Deploy"
2. Wait 2-5 minutes for the build to complete
3. Once deployed, you'll get a URL like: `https://flobit-analytics-xxx.vercel.app`

### 3.5 Update Environment Variables

After first deployment:

1. Go to your Vercel project settings
2. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
3. Redeploy (Settings → Deployments → click on latest → "Redeploy")

---

## Step 4: Seed Your Database

After deploying, you need to populate your database with data.

### 4.1 Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 4.2 Login to Vercel

```bash
vercel login
```

### 4.3 Link Your Project

```bash
cd C:\Users\Hey\Desktop\flobit
vercel link
```

### 4.4 Pull Environment Variables

```bash
vercel env pull
```

### 4.5 Run Database Migration

```bash
# Navigate to API directory
cd apps/api

# Push Prisma schema to database
npx prisma db push

# Seed the database
npm run db:seed
```

---

## Step 5: Deploy Vanna AI Service

You need to deploy the Python Vanna AI service separately. Choose one of these platforms:

### Option A: Render (Recommended - Free Tier)

1. Go to https://render.com and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:

   - **Name:** `flobit-vanna-ai`
   - **Root Directory:** `services/vanna`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python simple_server.py`
   - **Instance Type:** Free

5. Add Environment Variables:

   - `DATABASE_URL`: Your PostgreSQL connection string
   - `GROQ_API_KEY`: Your Groq API key
   - `PORT`: 8000

6. Click "Create Web Service"
7. Wait for deployment (you'll get a URL like: `https://flobit-vanna-ai.onrender.com`)

### Option B: Railway

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory:** `services/vanna`
   - Add environment variables (same as Render)
5. Deploy

### Option C: Fly.io

1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Login: `fly auth login`
3. Navigate to Vanna directory:

```bash
cd services/vanna
```

4. Initialize Fly app:

```bash
fly launch
```

5. Deploy:

```bash
fly deploy
```

---

## Step 6: Connect Vanna AI to Vercel

### 6.1 Update Vercel Environment Variables

1. Go to your Vercel project → Settings → Environment Variables
2. Add/Update:
   - `VANNA_API_BASE_URL`: Your Vanna service URL (e.g., `https://flobit-vanna-ai.onrender.com`)
3. Redeploy your Vercel project

### 6.2 Configure CORS on Vanna Service

Make sure your `services/vanna/simple_server.py` allows requests from your Vercel domain.

If using Render/Railway, the CORS should already be set to allow all origins (`"*"`), but for production, you should update it to only allow your Vercel domain.

---

## Step 7: Test Your Deployment

### 7.1 Access Your Application

Open your Vercel URL: `https://flobit-analytics-xxx.vercel.app`

### 7.2 Test Dashboard

- Check if all charts load
- Verify metrics are displayed
- Test invoice table filters

### 7.3 Test Chat with Data

1. Click "Chat with Data" in sidebar
2. Try a query like: "What's the total spend?"
3. Verify SQL is generated and results are displayed

---

## 🎯 Quick Reference Commands

### Deploy Updates

```bash
# After making changes locally
git add .
git commit -m "Your commit message"
git push origin main

# Vercel will automatically redeploy
```

### View Logs

```bash
# View Vercel logs
vercel logs

# View Vanna logs (on Render)
# Go to your Render dashboard → Your service → Logs tab
```

### Database Operations

```bash
# View database in Prisma Studio
cd apps/api
npx prisma studio

# Reset database (CAUTION: Deletes all data)
npx prisma db push --force-reset
npm run db:seed
```

---

## 📊 Environment Variables Summary

### Vercel (Frontend + Backend)

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_BASE=/api
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
GROQ_API_KEY=gsk_...
VANNA_API_BASE_URL=https://your-vanna-service.onrender.com
```

### Vanna AI Service (Render/Railway/Fly.io)

```env
DATABASE_URL=postgresql://...
GROQ_API_KEY=gsk_...
PORT=8000
```

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Error:** `Cannot find module 'X'`

- **Fix:** Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error:** `Prisma Client not found`

- **Fix:** Add postinstall script to `apps/api/package.json`:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Connection Issues

**Error:** `Connection refused`

- **Fix:** Ensure `DATABASE_URL` is accessible from Vercel's servers
- Check if your database allows external connections
- Verify connection string format

### Vanna AI Not Responding

**Error:** `Failed to fetch from Vanna`

- **Fix:**
  1. Check if Vanna service is running (visit the URL directly)
  2. Verify `VANNA_API_BASE_URL` is correct in Vercel
  3. Check CORS settings in `simple_server.py`
  4. View Vanna service logs for errors

### Chat Queries Return Errors

**Error:** `SQL generation failed`

- **Fix:**
  1. Verify `GROQ_API_KEY` is set correctly
  2. Check Groq API quota/limits
  3. View Vanna service logs

---

## ✅ Deployment Checklist

Before considering deployment complete, verify:

- [ ] Frontend loads at Vercel URL
- [ ] All dashboard charts display data
- [ ] Invoice table shows data and filters work
- [ ] Database is seeded with Analytics_Test_Data.json
- [ ] Vanna AI service is running and accessible
- [ ] Chat queries generate SQL and return results
- [ ] All environment variables are set correctly
- [ ] No console errors in browser
- [ ] API endpoints return data (test in Network tab)

---

## 🎉 Success!

Once all checks pass, your application is fully deployed!

**Share these URLs:**

- Frontend: `https://your-app.vercel.app`
- Vanna AI: `https://your-vanna-service.onrender.com`

---

## 📝 Next Steps (Optional)

1. **Custom Domain:** Add a custom domain in Vercel settings
2. **Analytics:** Enable Vercel Analytics
3. **Monitoring:** Set up error tracking (Sentry)
4. **Performance:** Enable Vercel Speed Insights
5. **Backups:** Set up automated database backups

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- GitHub Issues: Create an issue in your repository

Good luck with your deployment! 🚀
