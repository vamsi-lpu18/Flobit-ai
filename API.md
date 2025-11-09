# 📚 API Documentation

Complete API reference for Flobit Analytics backend.

## Base URL

- **Local**: `http://localhost:3000/api`
- **Production**: `https://your-app.vercel.app/api`

## Authentication

Currently no authentication required. In production, consider adding API keys or JWT tokens.

---

## Endpoints

### 1. Get Dashboard Statistics

Get overview metrics for dashboard cards.

**Endpoint:** `GET /api/stats`

**Response:**

```json
{
  "totalSpend": 1250000.5,
  "totalInvoices": 1543,
  "documentsUploaded": 1543,
  "avgInvoiceValue": 810.5
}
```

**Fields:**

- `totalSpend` (number): Total spend year-to-date in USD
- `totalInvoices` (number): Count of all invoices
- `documentsUploaded` (number): Count of uploaded documents
- `avgInvoiceValue` (number): Average invoice amount in USD

---

### 2. Get Invoice Trends

Get monthly invoice volume and spend trends.

**Endpoint:** `GET /api/invoice-trends`

**Response:**

```json
{
  "data": [
    {
      "month": "2024-01",
      "count": 120,
      "totalAmount": 95000.0
    },
    {
      "month": "2024-02",
      "count": 135,
      "totalAmount": 102000.0
    }
  ]
}
```

**Fields:**

- `month` (string): Month in YYYY-MM format
- `count` (number): Number of invoices in that month
- `totalAmount` (number): Total invoice amount for that month

---

### 3. Get Top 10 Vendors

Get top 10 vendors by total spend.

**Endpoint:** `GET /api/vendors/top10`

**Response:**

```json
{
  "data": [
    {
      "name": "Acme Corporation",
      "totalSpend": 150000.0
    },
    {
      "name": "TechSupply Inc",
      "totalSpend": 125000.0
    }
  ]
}
```

**Fields:**

- `name` (string): Vendor name
- `totalSpend` (number): Total amount spent with vendor

---

### 4. Get Category Spend

Get spend distribution across categories.

**Endpoint:** `GET /api/category-spend`

**Response:**

```json
{
  "data": [
    {
      "category": "Software",
      "totalSpend": 250000.0
    },
    {
      "category": "Hardware",
      "totalSpend": 180000.0
    }
  ]
}
```

**Fields:**

- `category` (string): Category name
- `totalSpend` (number): Total spend in that category

---

### 5. Get Cash Outflow Forecast

Get expected cash outflow by month.

**Endpoint:** `GET /api/cash-outflow`

**Response:**

```json
{
  "data": [
    {
      "month": "2024-12",
      "amount": 45000.0
    },
    {
      "month": "2025-01",
      "amount": 52000.0
    }
  ]
}
```

**Fields:**

- `month` (string): Month in YYYY-MM format
- `amount` (number): Expected cash outflow for that month

---

### 6. List Invoices

Get paginated list of invoices with search and filtering.

**Endpoint:** `GET /api/invoices`

**Query Parameters:**

- `search` (string, optional): Search by invoice number or vendor name
- `status` (string, optional): Filter by status (pending, paid, overdue, cancelled)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 50)

**Example Request:**

```
GET /api/invoices?search=acme&status=pending&page=1&limit=20
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid-here",
      "invoiceNumber": "INV-001234",
      "vendor": "Acme Corporation",
      "issueDate": "2024-01-15T00:00:00.000Z",
      "dueDate": "2024-02-15T00:00:00.000Z",
      "amount": 5000.0,
      "status": "paid",
      "category": "Software"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Invoice Fields:**

- `id` (string): Unique invoice ID
- `invoiceNumber` (string): Invoice number
- `vendor` (string): Vendor name
- `issueDate` (string): ISO 8601 date when invoice was issued
- `dueDate` (string): ISO 8601 date when payment is due
- `amount` (number): Invoice total amount
- `status` (string): Invoice status
- `category` (string): Invoice category

**Pagination Fields:**

- `page` (number): Current page
- `limit` (number): Items per page
- `total` (number): Total number of items
- `totalPages` (number): Total number of pages

---

### 7. Chat with Data

Process natural language queries using Vanna AI.

**Endpoint:** `POST /api/chat-with-data`

**Request Body:**

```json
{
  "query": "What's the total spend in the last 90 days?"
}
```

**Response:**

```json
{
  "sql": "SELECT SUM(total_amount) FROM invoices WHERE issue_date > CURRENT_DATE - INTERVAL '90 days'",
  "data": [
    {
      "sum": 250000.5
    }
  ],
  "executionTime": 45,
  "explanation": "Executed query successfully. Found 1 results."
}
```

**Request Fields:**

- `query` (string, required): Natural language question

**Response Fields:**

- `sql` (string): Generated SQL query
- `data` (array): Query results as array of objects
- `executionTime` (number): Execution time in milliseconds
- `explanation` (string): Human-readable explanation

**Example Queries:**

- "What's the total spend in the last 90 days?"
- "List top 5 vendors by spend"
- "Show overdue invoices as of today"
- "What's the average invoice amount by category?"
- "How many pending invoices do we have?"

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message here",
  "details": "Additional error details"
}
```

**Common HTTP Status Codes:**

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Currently no rate limiting implemented. For production:

- Consider implementing rate limiting (e.g., 100 requests/minute)
- Use Redis for distributed rate limiting
- Return `429 Too Many Requests` when limit exceeded

---

## Data Types

### Invoice Status

- `pending`: Invoice not yet paid
- `paid`: Invoice has been paid
- `overdue`: Invoice past due date and not paid
- `cancelled`: Invoice cancelled

### Payment Methods

- `Bank Transfer`
- `Credit Card`
- `Cash`
- `Check`

### Categories

- `Software`
- `Hardware`
- `Services`
- `Consulting`
- `Marketing`
- `Office Supplies`

---

## Testing

### Using cURL

```bash
# Get stats
curl http://localhost:3000/api/stats

# Get invoices with filters
curl "http://localhost:3000/api/invoices?search=acme&status=pending"

# Chat with data
curl -X POST http://localhost:3000/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the total spend?"}'
```

### Using Postman

1. Import the API endpoints
2. Set base URL to `http://localhost:3000/api`
3. Test each endpoint with sample parameters

---

## Database Schema

See [DATABASE.md](DATABASE.md) for complete database schema documentation.

---

## Need Help?

- Check the [README.md](README.md) for setup instructions
- See [QUICKSTART.md](QUICKSTART.md) for getting started
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
