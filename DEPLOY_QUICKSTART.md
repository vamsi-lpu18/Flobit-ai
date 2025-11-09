# 🚀 Quick Deploy to Vercel - 5 Minutes

## 1️⃣ Push to GitHub (2 minutes)

```bash
# In your project directory
cd C:\Users\Hey\Desktop\flobit

# Initialize and commit
git init
git add .
git commit -m "Ready for Vercel deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/flobit-analytics.git
git push -u origin main
```

## 2️⃣ Deploy to Vercel (2 minutes)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Set **Root Directory** to: `apps/web`
4. Add Environment Variables:
   - `DATABASE_URL` - Get from https://vercel.com/storage (create Postgres database)
   - `GROQ_API_KEY` - From https://console.groq.com
   - `NEXT_PUBLIC_API_BASE` - Set to `/api`
5. Click **Deploy**

## 3️⃣ Seed Database (1 minute)

```bash
# Install Vercel CLI
npm install -g vercel

# Login and link
vercel login
vercel link

# Seed database
cd apps/api
vercel env pull
npx prisma db push
npm run db:seed
```

## 4️⃣ Deploy Vanna AI

**Option A - Render (Easiest):**

1. Go to https://render.com/deploy
2. Connect GitHub repo
3. Root Directory: `services/vanna`
4. Build: `pip install -r requirements.txt`
5. Start: `python simple_server.py`
6. Add env vars: `DATABASE_URL`, `GROQ_API_KEY`

**Option B - Railway:**

1. https://railway.app
2. New Project → Deploy from GitHub
3. Set root: `services/vanna`
4. Add same env vars

## 5️⃣ Connect Vanna to Vercel

1. Copy your Vanna URL (e.g., `https://xxx.onrender.com`)
2. Go to Vercel → Project Settings → Environment Variables
3. Add: `VANNA_API_BASE_URL` = your Vanna URL
4. Redeploy

## ✅ Done!

Visit your app at: `https://your-app.vercel.app`

---

**Full Guide:** See `VERCEL_DEPLOYMENT.md` for detailed instructions and troubleshooting.
