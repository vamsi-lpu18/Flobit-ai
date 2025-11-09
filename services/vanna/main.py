import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import vanna as vn
from vanna.groq import Groq
from vanna.postgres import Postgres
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Vanna AI Service",
    description="Natural language to SQL conversion for Flobit Analytics",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Vanna class combining Groq and Postgres
class MyVanna(Groq, Postgres):
    def __init__(self, config=None):
        Groq.__init__(self, config=config)
        Postgres.__init__(self, config=config)

# Initialize Vanna AI
DATABASE_URL = os.getenv("DATABASE_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not DATABASE_URL or not GROQ_API_KEY:
    raise ValueError("DATABASE_URL and GROQ_API_KEY must be set in environment variables")

vanna_instance = MyVanna(config={
    'api_key': GROQ_API_KEY,
    'model': 'mixtral-8x7b-32768',  # or 'llama2-70b-4096'
})

# Connect to PostgreSQL database
vanna_instance.connect_to_postgres(
    host=DATABASE_URL.split('@')[1].split(':')[0] if '@' in DATABASE_URL else 'localhost',
    dbname=DATABASE_URL.split('/')[-1] if '/' in DATABASE_URL else 'flobit_analytics',
    user=DATABASE_URL.split('//')[1].split(':')[0] if '//' in DATABASE_URL else 'postgres',
    password=DATABASE_URL.split(':')[2].split('@')[0] if '@' in DATABASE_URL else 'password',
    port=int(DATABASE_URL.split(':')[-1].split('/')[0]) if ':' in DATABASE_URL.split('@')[-1] else 5432
)

# Train Vanna with database schema
def train_vanna():
    """Train Vanna with database schema and sample queries"""
    try:
        # Add DDL statements for training
        ddl_statements = [
            """
            CREATE TABLE vendors (
                id UUID PRIMARY KEY,
                name VARCHAR NOT NULL,
                email VARCHAR,
                phone VARCHAR,
                address VARCHAR
            );
            """,
            """
            CREATE TABLE customers (
                id UUID PRIMARY KEY,
                name VARCHAR NOT NULL,
                email VARCHAR,
                phone VARCHAR,
                address VARCHAR
            );
            """,
            """
            CREATE TABLE invoices (
                id UUID PRIMARY KEY,
                invoice_number VARCHAR UNIQUE NOT NULL,
                vendor_id UUID REFERENCES vendors(id),
                customer_id UUID REFERENCES customers(id),
                issue_date TIMESTAMP NOT NULL,
                due_date TIMESTAMP NOT NULL,
                total_amount DECIMAL(12,2) NOT NULL,
                status VARCHAR NOT NULL,
                category VARCHAR
            );
            """,
            """
            CREATE TABLE line_items (
                id UUID PRIMARY KEY,
                invoice_id UUID REFERENCES invoices(id),
                description VARCHAR NOT NULL,
                quantity DECIMAL(10,2),
                unit_price DECIMAL(12,2),
                amount DECIMAL(12,2)
            );
            """,
            """
            CREATE TABLE payments (
                id UUID PRIMARY KEY,
                invoice_id UUID REFERENCES invoices(id),
                amount DECIMAL(12,2),
                payment_date TIMESTAMP,
                method VARCHAR
            );
            """
        ]
        
        for ddl in ddl_statements:
            vanna_instance.train(ddl=ddl)
        
        # Add sample question-SQL pairs for better training
        training_data = [
            {
                "question": "What is the total spend?",
                "sql": "SELECT SUM(total_amount) as total_spend FROM invoices;"
            },
            {
                "question": "Show me all pending invoices",
                "sql": "SELECT * FROM invoices WHERE status = 'pending';"
            },
            {
                "question": "List top 5 vendors by spend",
                "sql": """
                SELECT v.name, SUM(i.total_amount) as total_spend 
                FROM invoices i 
                JOIN vendors v ON i.vendor_id = v.id 
                GROUP BY v.name 
                ORDER BY total_spend DESC 
                LIMIT 5;
                """
            },
            {
                "question": "What are the overdue invoices?",
                "sql": "SELECT * FROM invoices WHERE status = 'overdue' OR (due_date < CURRENT_DATE AND status != 'paid');"
            },
            {
                "question": "Average invoice amount by category",
                "sql": """
                SELECT category, AVG(total_amount) as avg_amount 
                FROM invoices 
                WHERE category IS NOT NULL 
                GROUP BY category;
                """
            }
        ]
        
        for item in training_data:
            vanna_instance.train(question=item["question"], sql=item["sql"])
        
        print("✅ Vanna training completed successfully")
        
    except Exception as e:
        print(f"⚠️  Warning: Training failed - {e}")

# Train on startup
@app.on_event("startup")
async def startup_event():
    print("🚀 Starting Vanna AI Service...")
    train_vanna()
    print("✅ Service ready!")

# Request/Response models
class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    sql: str
    results: List[Dict[str, Any]]
    explanation: Optional[str] = None
    error: Optional[str] = None

# Endpoints
@app.get("/")
async def root():
    return {
        "service": "Vanna AI for Flobit Analytics",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """
    Convert natural language question to SQL and execute it
    """
    try:
        # Generate SQL from natural language
        sql = vanna_instance.generate_sql(request.question)
        
        if not sql:
            raise HTTPException(status_code=400, detail="Could not generate SQL from question")
        
        # Execute the SQL query
        results = vanna_instance.run_sql(sql)
        
        # Convert results to list of dictionaries
        if results is not None:
            # Handle pandas DataFrame
            if hasattr(results, 'to_dict'):
                results_list = results.to_dict('records')
            else:
                results_list = results
        else:
            results_list = []
        
        # Generate explanation (optional)
        explanation = f"Executed query successfully. Found {len(results_list)} results."
        
        return QueryResponse(
            sql=sql,
            results=results_list,
            explanation=explanation
        )
        
    except Exception as e:
        return QueryResponse(
            sql="",
            results=[],
            error=str(e)
        )

@app.post("/train")
async def train_with_data(question: str, sql: str):
    """
    Add new training data to Vanna
    """
    try:
        vanna_instance.train(question=question, sql=sql)
        return {"message": "Training data added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
