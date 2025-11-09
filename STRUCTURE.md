# 📦 Project Structure

```
flobit/
├── apps/
│   ├── api/                          # Backend API (Next.js API Routes)
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Database schema
│   │   │   └── seed.ts               # Database seeding script
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── api/              # API routes
│   │   │   │   │   ├── stats/
│   │   │   │   │   ├── invoice-trends/
│   │   │   │   │   ├── vendors/
│   │   │   │   │   ├── category-spend/
│   │   │   │   │   ├── cash-outflow/
│   │   │   │   │   ├── invoices/
│   │   │   │   │   └── chat-with-data/
│   │   │   │   └── page.tsx          # API landing page
│   │   │   └── lib/
│   │   │       └── prisma.ts         # Prisma client instance
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                          # Frontend (Next.js App)
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx        # Root layout
│       │   │   ├── page.tsx          # Main page with tabs
│       │   │   └── globals.css       # Global styles
│       │   ├── components/
│       │   │   ├── ui/               # shadcn/ui components
│       │   │   │   ├── card.tsx
│       │   │   │   ├── button.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   └── tabs.tsx
│       │   │   ├── charts/           # Chart components
│       │   │   │   ├── InvoiceTrendsChart.tsx
│       │   │   │   ├── VendorSpendChart.tsx
│       │   │   │   ├── CategorySpendChart.tsx
│       │   │   │   └── CashOutflowChart.tsx
│       │   │   ├── Dashboard.tsx     # Main dashboard
│       │   │   ├── StatsCards.tsx    # Overview cards
│       │   │   ├── InvoicesTable.tsx # Invoices table
│       │   │   └── ChatWithData.tsx  # Chat interface
│       │   └── lib/
│       │       ├── utils.ts          # Utility functions
│       │       └── api.ts            # API client functions
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── package.json
│       └── tsconfig.json
│
├── services/
│   └── vanna/                        # Vanna AI Python Service
│       ├── main.py                   # FastAPI application
│       ├── requirements.txt          # Python dependencies
│       ├── Dockerfile                # Docker configuration
│       └── README.md                 # Service documentation
│
├── data/
│   ├── Analytics_Test_Data.json     # Invoice data (add your file here)
│   └── README.md                     # Data directory instructions
│
├── .env.example                      # Environment variables template
├── .gitignore
├── package.json                      # Root package.json (Turborepo)
├── turbo.json                        # Turborepo configuration
├── docker-compose.yml                # Docker Compose setup
├── vercel.json                       # Vercel deployment config
│
└── Documentation/
    ├── README.md                     # Main project documentation
    ├── QUICKSTART.md                 # Quick start guide
    ├── DEPLOYMENT.md                 # Deployment instructions
    ├── API.md                        # API documentation
    └── DATABASE.md                   # Database schema docs
```

## Technology Stack

### Frontend (apps/web)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend (apps/api)

- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Language**: TypeScript

### AI Service (services/vanna)

- **Runtime**: Python 3.11+
- **Framework**: FastAPI
- **AI**: Vanna AI + Groq
- **Database Driver**: psycopg2

### DevOps

- **Monorepo**: Turborepo
- **Package Manager**: npm
- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel (Frontend/Backend), Render/Railway (AI Service)

## Key Files Explained

### Root Level

**package.json**: Workspace root configuration for Turborepo

- Defines monorepo structure
- Scripts for running all apps
- Shared dev dependencies

**turbo.json**: Turborepo pipeline configuration

- Build task dependencies
- Caching strategy
- Output directories

**docker-compose.yml**: Local development setup

- PostgreSQL database
- Vanna AI service
- Network configuration

**.env.example**: Environment variables template

- Database connection
- API keys
- Service URLs

### Backend (apps/api)

**prisma/schema.prisma**: Database schema definition

- Table definitions
- Relationships
- Indexes

**prisma/seed.ts**: Database seeding script

- JSON data import
- Sample data generation
- Data normalization

**src/app/api/\*/route.ts**: API route handlers

- Request validation
- Database queries
- Response formatting

**src/lib/prisma.ts**: Prisma client singleton

- Connection pooling
- Development mode helpers

### Frontend (apps/web)

**src/app/page.tsx**: Main application page

- Tab navigation
- Dashboard/Chat views

**src/components/Dashboard.tsx**: Analytics dashboard

- Stats cards
- Charts grid
- Invoices table

**src/components/ChatWithData.tsx**: AI chat interface

- Message history
- Query submission
- Results display

**src/lib/api.ts**: API client functions

- Fetch wrappers
- Error handling
- Type definitions

**src/lib/utils.ts**: Utility functions

- Currency formatting
- Date formatting
- Tailwind class merging

### AI Service (services/vanna)

**main.py**: FastAPI application

- Vanna AI initialization
- Database connection
- Query endpoints

**requirements.txt**: Python dependencies

- FastAPI
- Vanna AI
- Groq client
- PostgreSQL driver

## Component Hierarchy

```
App
├── Layout
│   └── Page (Tabs)
│       ├── Dashboard Tab
│       │   ├── StatsCards
│       │   │   └── Card (4x)
│       │   ├── Charts Grid
│       │   │   ├── InvoiceTrendsChart
│       │   │   ├── VendorSpendChart
│       │   │   ├── CategorySpendChart
│       │   │   └── CashOutflowChart
│       │   └── InvoicesTable
│       │       └── SearchInput
│       │
│       └── Chat Tab
│           └── ChatWithData
│               ├── Messages List
│               ├── Input Form
│               └── Sample Questions
```

## Data Flow

### Dashboard Loading

```
User → Frontend → API Routes → Prisma → PostgreSQL
                        ↓
              Response with Data
                        ↓
                   Charts Render
```

### Chat Query

```
User Question → Frontend → /api/chat-with-data
                              ↓
                     Vanna AI Service
                              ↓
                    Generate SQL (Groq)
                              ↓
                     Execute on PostgreSQL
                              ↓
                     Return Results
                              ↓
                   Display in Frontend
```

## Build Process

### Development

```bash
# Root
npm install          # Install all dependencies
npm run dev          # Start all services

# Backend
cd apps/api
npm run dev          # Start on port 3000

# Frontend
cd apps/web
npm run dev          # Start on port 3001

# Vanna AI
cd services/vanna
python main.py       # Start on port 8000
```

### Production

```bash
# Build all apps
npm run build

# Deploy Frontend & Backend
vercel --prod

# Deploy Vanna AI
# (See DEPLOYMENT.md for options)
```

## Environment Variables

### Development (.env)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/flobit_analytics"
NEXT_PUBLIC_API_BASE="/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
VANNA_API_BASE_URL="http://localhost:8000"
GROQ_API_KEY="your_key_here"
```

### Production (Vercel + Render)

```env
DATABASE_URL="postgresql://..."  # Production database
NEXT_PUBLIC_API_BASE="/api"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
VANNA_API_BASE_URL="https://your-vanna.onrender.com"
GROQ_API_KEY="your_production_key"
```

## Port Allocation

- **3000**: Backend API
- **3001**: Frontend App
- **5432**: PostgreSQL
- **8000**: Vanna AI Service

## Git Workflow

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit: Complete Flobit Analytics application"

# Create repository on GitHub
git remote add origin https://github.com/yourusername/flobit-analytics.git
git push -u origin main

# Feature development
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Create pull request on GitHub
```

## Next Steps

1. ✅ All code is complete and ready
2. 📥 Download Analytics_Test_Data.json from Google Drive
3. 📁 Place it in `data/Analytics_Test_Data.json`
4. 🚀 Follow QUICKSTART.md to run locally
5. 🌐 Follow DEPLOYMENT.md to deploy to production
6. 🎥 Record demo video
7. 📧 Submit project

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Vanna AI Documentation](https://vanna.ai/docs)
- [Groq API Documentation](https://console.groq.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
