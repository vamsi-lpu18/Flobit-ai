# 🚀 Deployment Guide

Complete guide to deploying Flobit Analytics to production.

## Architecture Overview

```
Frontend (Vercel) → Backend API (Vercel) → PostgreSQL (Vercel/Supabase)
                          ↓
                   Vanna AI (Render/Railway/Fly.io)
```

## Part 1: Database Deployment

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project
2. Navigate to Storage → Create Database → Postgres
3. Copy the `DATABASE_URL` connection string
4. Update your `.env` with the production DATABASE_URL

### Option B: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string (Transaction mode)
5. Use this as `DATABASE_URL`

### Option C: Railway

1. Create account at [railway.app](https://railway.app)
2. New Project → Add PostgreSQL
3. Copy DATABASE_URL from Variables tab

## Part 2: Deploy Backend & Frontend to Vercel

### Prerequisites

```bash
npm install -g vercel
```

### Deploy Steps

1. **Initialize Vercel project**

```bash
cd c:\Users\Hey\Desktop\flobit
vercel login
vercel
```

2. **Configure Build Settings**

When prompted:

- Set up and deploy: Yes
- Which scope: Your account
- Link to existing project: No
- Project name: flobit-analytics
- In which directory: `./`
- Override settings: Yes
  - Build Command: `cd apps/api && npm install && npx prisma generate && npm run build`
  - Output Directory: `apps/api/.next`
  - Install Command: `npm install`

3. **Add Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_API_BASE=/api
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
VANNA_API_BASE_URL=https://your-vanna-service.onrender.com
GROQ_API_KEY=your_groq_api_key
```

4. **Deploy Database Schema**

```bash
# From your local machine
cd apps\api
npx prisma db push

# Seed production database
npm run db:seed
```

5. **Deploy to Production**

```bash
vercel --prod
```

## Part 3: Deploy Vanna AI Service

### Option A: Render.com (Recommended - Free Tier Available)

1. **Create Account**: Go to [render.com](https://render.com)

2. **New Web Service**:

   - Connect your GitHub repository
   - Name: `flobit-vanna`
   - Root Directory: `services/vanna`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`

3. **Environment Variables**:

   ```env
   DATABASE_URL=your_production_database_url
   GROQ_API_KEY=your_groq_api_key
   PORT=8000
   ```

4. **Deploy**: Click "Create Web Service"

5. **Get URL**: Copy the service URL (e.g., `https://flobit-vanna.onrender.com`)

6. **Update Frontend**: Add the Vanna URL to Vercel environment variables as `VANNA_API_BASE_URL`

### Option B: Railway.app

1. **Create Project**: Go to [railway.app](https://railway.app)

2. **Deploy from GitHub**:

   - New Project → Deploy from GitHub repo
   - Select your repository
   - Add service → Select repository

3. **Configure**:

   - Root Directory: `services/vanna`
   - Add environment variables (same as above)

4. **Generate Domain**: Settings → Generate Domain

### Option C: Fly.io

1. **Install Flyctl**:

```bash
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

2. **Login and Launch**:

```bash
cd services\vanna
fly auth login
fly launch
```

3. **Set Secrets**:

```bash
fly secrets set DATABASE_URL="your_url"
fly secrets set GROQ_API_KEY="your_key"
```

4. **Deploy**:

```bash
fly deploy
```

### Option D: Docker on Any Platform

1. **Build Image**:

```bash
cd services\vanna
docker build -t flobit-vanna .
```

2. **Push to Registry**:

```bash
docker tag flobit-vanna your-registry/flobit-vanna
docker push your-registry/flobit-vanna
```

3. **Deploy to your hosting platform** (DigitalOcean, AWS, etc.)

## Part 4: Configure CORS

Update `services/vanna/main.py` with your production domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",
        "https://*.vercel.app"  # For preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Part 5: Verification

1. **Check Frontend**: Visit your Vercel URL
2. **Check API**: Visit `https://your-app.vercel.app/api/stats`
3. **Check Vanna**: Visit `https://your-vanna.onrender.com/health`
4. **Test Chat**: Try a natural language query

## Part 6: Custom Domain (Optional)

### In Vercel:

1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### In Render/Railway:

1. Go to Settings → Custom Domains
2. Add domain and configure DNS

## Monitoring & Maintenance

### Vercel Logs

- Dashboard → Deployments → Click deployment → Logs

### Render Logs

- Dashboard → Service → Logs tab

### Database Monitoring

- Vercel Postgres: Storage tab → Metrics
- Supabase: Dashboard → Database → Logs

## Cost Estimation

### Free Tier (Suitable for Internship Project)

- **Vercel**: Free (Hobby plan)
- **Render**: Free (Web service sleeps after inactivity)
- **Supabase**: Free (500MB database, 2GB bandwidth)
- **Total**: $0/month

### Production Tier

- **Vercel Pro**: $20/month
- **Render Starter**: $7/month
- **Supabase Pro**: $25/month
- **Total**: ~$52/month

## Troubleshooting

### Build Fails on Vercel

- Check build logs
- Verify all dependencies in package.json
- Ensure Prisma generate runs before build

### Vanna Service Times Out

- Free tier services sleep after 15min inactivity
- First request may take 30-60s to wake up
- Upgrade to paid tier for always-on

### Database Connection Issues

- Verify DATABASE_URL format
- Check firewall rules
- Ensure SSL mode is configured

### CORS Errors

- Update allowed origins in Vanna service
- Clear browser cache
- Check browser console for exact error

## Rollback

### Vercel

```bash
vercel rollback
```

### Render/Railway

- Go to Deployments
- Click on previous deployment
- Click "Redeploy"

## CI/CD Setup (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Security Checklist

- [ ] Environment variables set in platform (not in code)
- [ ] Database has strong password
- [ ] CORS configured for production domain only
- [ ] API rate limiting enabled
- [ ] HTTPS enforced
- [ ] Secrets rotated regularly

## Support

For deployment issues:

- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Railway: https://docs.railway.app
- Supabase: https://supabase.com/docs
