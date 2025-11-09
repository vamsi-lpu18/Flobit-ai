# Vanna AI Service

AI-powered natural language to SQL conversion service using Vanna AI and Groq.

## Features

- Natural language query processing
- SQL generation using Groq LLM
- PostgreSQL database integration
- RESTful API with FastAPI
- CORS enabled for frontend integration

## Setup

### Local Development

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set environment variables:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/flobit_analytics"
GROQ_API_KEY="your_groq_api_key"
PORT=8000
```

3. Run the service:

```bash
python main.py
```

The service will be available at `http://localhost:8000`

### Docker Deployment

1. Build the image:

```bash
docker build -t flobit-vanna .
```

2. Run the container:

```bash
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e GROQ_API_KEY="..." \
  flobit-vanna
```

## API Endpoints

### POST /query

Convert natural language to SQL and execute

**Request:**

```json
{
  "question": "What's the total spend in the last 90 days?"
}
```

**Response:**

```json
{
  "sql": "SELECT SUM(total_amount) FROM invoices WHERE issue_date > CURRENT_DATE - INTERVAL '90 days'",
  "results": [{ "sum": 150000.5 }],
  "explanation": "Executed query successfully. Found 1 results."
}
```

### POST /train

Add custom training data

**Request:**

```json
{
  "question": "Show me high-value invoices",
  "sql": "SELECT * FROM invoices WHERE total_amount > 10000"
}
```

### GET /health

Health check endpoint

## Deployment Options

### Render.com

1. Create new Web Service
2. Connect GitHub repository
3. Set Root Directory: `services/vanna`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `python main.py`
6. Add environment variables

### Railway.app

1. Deploy from GitHub
2. Set Root Directory: `services/vanna`
3. Add environment variables
4. Railway will auto-detect Python and deploy

### Fly.io

1. Install flyctl
2. Run `fly launch` in services/vanna
3. Configure environment variables
4. Deploy with `fly deploy`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `GROQ_API_KEY`: Groq API key for LLM
- `PORT`: Port to run the service (default: 8000)
