# 🎯 Quick Start Guide

This guide will get you up and running in under 10 minutes.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Python 3.11+
- Groq API Key ([Get one here](https://console.groq.com))

## Step 1: Clone and Install

```bash
cd c:\Users\Hey\Desktop\flobit
npm install
```

## Step 2: Setup Database

### Option A: Using Docker (Recommended)

```bash
docker-compose up -d postgres
```

### Option B: Local PostgreSQL

Make sure PostgreSQL is running on localhost:5432

## Step 3: Configure Environment

Create `.env` file in the root:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/flobit_analytics"
NEXT_PUBLIC_API_BASE="/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
VANNA_API_BASE_URL="http://localhost:8000"
GROQ_API_KEY="your_groq_api_key_here"
```

## Step 4: Verify Data File

The `Analytics_Test_Data.json` file should already be in the `data/` directory.

```powershell
# Check if file exists
dir data\Analytics_Test_Data.json
```

✅ **File is ready!** The seed script will automatically process all invoice documents.

## Step 5: Initialize Database

```powershell
# Navigate to API directory
cd apps\api

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with data
npm run db:seed

# Go back to root
cd ..\..
```

## Step 6: Start Backend API

```powershell
# From root directory
cd apps\api
npm run dev
```

Backend will be available at `http://localhost:3000`

## Step 7: Start Frontend

Open a **new terminal**:

```powershell
cd apps\web
npm run dev
```

Frontend will be available at `http://localhost:3001`

## Step 8: Start Vanna AI Service

Open **another new terminal**:

```powershell
cd services\vanna
pip install -r requirements.txt
python main.py
```

Vanna AI service will be available at `http://localhost:8000`

## Step 9: Access the Application

Open your browser and navigate to:

- **Frontend Dashboard**: http://localhost:3001
- **API**: http://localhost:3000/api/stats
- **Vanna AI**: http://localhost:8000/docs

## Verify Everything Works

1. **Dashboard**: Should show stats cards and charts
2. **Invoices Table**: Should display invoice data
3. **Chat Tab**: Try asking "What's the total spend?"

## Troubleshooting

### Database connection failed

- Check PostgreSQL is running: `psql -U postgres`
- Verify DATABASE_URL in .env matches your setup

### Frontend shows no data

- Check backend is running on port 3000
- Check browser console for errors
- Verify database has been seeded

### Vanna AI not working

- Verify GROQ_API_KEY is valid
- Check services/vanna terminal for errors
- Test endpoint: http://localhost:8000/health

### Port already in use

- Frontend: Change port in `apps/web/package.json` (change `-p 3001`)
- Backend: Change port in `apps/api/package.json` (change `-p 3000`)
- Vanna: Change PORT in `.env`

## Next Steps

- Explore the dashboard and charts
- Try natural language queries in Chat tab
- View generated SQL queries
- Check Prisma Studio: `cd apps\api && npx prisma studio`

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for instructions on deploying to Vercel and hosting Vanna AI.
