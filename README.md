# Flobit Analytics - Production-Grade Full-Stack Application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/flobit-analytics)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive analytics dashboard with AI-powered natural language query capabilities, built with modern technologies and production-ready deployment.

## 🌐 Live Demo

- **Frontend:** [https://your-app.vercel.app](https://your-app.vercel.app) _(Update after deployment)_
- **Vanna AI:** [https://your-vanna-service.onrender.com](https://your-vanna-service.onrender.com) _(Update after deployment)_

## 🚀 Quick Deploy

**Deploy in 5 minutes:** See [DEPLOY_QUICKSTART.md](./DEPLOY_QUICKSTART.md)

**Full deployment guide:** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 🚀 Features

- **Interactive Analytics Dashboard** - Pixel-perfect implementation with real-time data visualization
- **AI-Powered Chat** - Natural language queries powered by Vanna AI and Groq LLM
- **Production-Ready** - Deployed on Vercel with self-hosted AI service
- **Type-Safe** - Full TypeScript implementation across frontend and backend
- **Monorepo Architecture** - Organized with Turborepo for optimal development

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────┐
│   Next.js App   │ ◄─────► │  API Backend    │ ◄─────► │  PostgreSQL  │
│  (apps/web)     │         │  (apps/api)     │         │   Database   │
└─────────────────┘         └─────────────────┘         └──────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────────────────────────────────────────┐
│            Vanna AI Service (Python)                │
│         Self-hosted with Groq Integration           │
└─────────────────────────────────────────────────────┘
```

## 📦 Tech Stack

### Frontend (`apps/web`)

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **State Management:** React Hooks

### Backend (`apps/api`)

- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Language:** TypeScript

### AI Service (`services/vanna`)

- **Runtime:** Python 3.11+
- **Framework:** FastAPI
- **AI:** Vanna AI + Groq
- **Database Driver:** psycopg2

## 🛠️ Setup Instructions

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- Python >= 3.11
- npm >= 9.0.0

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd flobit
npm install
```

### 2. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker run --name flobit-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=flobit_analytics -p 5432:5432 -d postgres:14

# Or use your existing PostgreSQL instance
```

### 3. Environment Variables

Copy `.env.example` to `.env` in the root and configure:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/flobit_analytics"
NEXT_PUBLIC_API_BASE="/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
VANNA_API_BASE_URL="http://localhost:8000"
GROQ_API_KEY="your_groq_api_key_here"
```

### 4. Database Migration and Seeding

```bash
# Push schema to database
npm run db:push

# Seed with data from Analytics_Test_Data.json
npm run db:seed
```

> **📊 Data Integration**: The seed script automatically processes the Analytics_Test_Data.json file (54,000+ lines of real invoice data) and intelligently extracts vendors, customers, invoices, line items, and payments into a normalized database structure. See [DATA_INTEGRATION.md](./DATA_INTEGRATION.md) for details.

### 5. Start Development Servers

```bash
# Terminal 1: Start all services
npm run dev

# Terminal 2: Start Vanna AI service
cd services/vanna
pip install -r requirements.txt
python main.py
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api
- **Vanna AI:** http://localhost:8000
- **Prisma Studio:** Run `npm run db:studio`

## 📊 Database Schema

### Core Tables

**vendors**

- id (UUID, PK)
- name (String)
- email (String)
- created_at (DateTime)

**customers**

- id (UUID, PK)
- name (String)
- email (String)

**invoices**

- id (UUID, PK)
- invoice_number (String, Unique)
- vendor_id (UUID, FK)
- customer_id (UUID, FK)
- issue_date (DateTime)
- due_date (DateTime)
- total_amount (Decimal)
- status (String)
- category (String)
- created_at (DateTime)

**line_items**

- id (UUID, PK)
- invoice_id (UUID, FK)
- description (String)
- quantity (Decimal)
- unit_price (Decimal)
- amount (Decimal)

**payments**

- id (UUID, PK)
- invoice_id (UUID, FK)
- amount (Decimal)
- payment_date (DateTime)
- method (String)

## 🔌 API Documentation

### GET `/api/stats`

Returns overview statistics for dashboard cards.

**Response:**

```json
{
  "totalSpend": 1250000.5,
  "totalInvoices": 1543,
  "documentsUploaded": 1543,
  "avgInvoiceValue": 810.5
}
```

### GET `/api/invoice-trends`

Returns monthly invoice volume and spend trends.

**Response:**

```json
{
  "data": [
    {
      "month": "2024-01",
      "count": 120,
      "totalAmount": 95000.0
    }
  ]
}
```

### GET `/api/vendors/top10`

Returns top 10 vendors by total spend.

**Response:**

```json
{
  "data": [
    {
      "name": "Vendor Name",
      "totalSpend": 150000.0
    }
  ]
}
```

### GET `/api/category-spend`

Returns spend grouped by category.

### GET `/api/cash-outflow`

Returns expected cash outflow forecast.

### GET `/api/invoices`

Returns paginated list of invoices.

**Query Params:**

- `search` - Search by invoice number or vendor
- `status` - Filter by status
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

### POST `/api/chat-with-data`

Process natural language queries.

**Request:**

```json
{
  "query": "What's the total spend in the last 90 days?"
}
```

**Response:**

```json
{
  "sql": "SELECT SUM(total_amount) FROM invoices WHERE ...",
  "data": [...],
  "executionTime": 45
}
```

## 🤖 Chat with Data Workflow

1. User enters natural language query in chat interface
2. Frontend sends POST request to `/api/chat-with-data`
3. Backend forwards query to Vanna AI service
4. Vanna AI uses Groq to generate SQL from natural language
5. Vanna AI executes SQL on PostgreSQL database
6. Results returned to backend, then to frontend
7. Frontend displays generated SQL and results table

## 🚀 Deployment

### Frontend & Backend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables on Vercel:**

- `DATABASE_URL`
- `NEXT_PUBLIC_API_BASE`
- `NEXT_PUBLIC_APP_URL`
- `VANNA_API_BASE_URL`

### Vanna AI Service (Render/Railway/Fly.io)

**Option 1: Render**

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd services/vanna && pip install -r requirements.txt`
4. Set start command: `cd services/vanna && python main.py`
5. Add environment variables

**Option 2: Docker**

```bash
cd services/vanna
docker build -t flobit-vanna .
docker run -p 8000:8000 --env-file .env flobit-vanna
```

### Database (Production)

Use managed PostgreSQL services:

- **Vercel Postgres**
- **Supabase**
- **Railway**
- **Neon**

## 📁 Project Structure

```
flobit/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/        # App router pages
│   │   │   ├── components/ # React components
│   │   │   └── lib/        # Utilities
│   │   └── package.json
│   └── api/                 # Backend API
│       ├── src/
│       ├── prisma/         # Database schema
│       └── package.json
├── services/
│   └── vanna/              # Python AI service
│       ├── main.py
│       ├── requirements.txt
│       └── Dockerfile
├── data/
│   └── Analytics_Test_Data.json
├── package.json            # Root package.json
├── turbo.json             # Turborepo config
└── README.md
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
cd apps/web && npm run type-check
cd apps/api && npm run type-check
```

## 📝 License

MIT

## 👥 Contributors

Built for Flowbit Private Limited

---

For questions or support, please open an issue on GitHub.
