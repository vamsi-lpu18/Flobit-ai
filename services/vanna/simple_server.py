import os
import sys
import json
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
PORT = int(os.getenv("PORT", 8000))

class VannaHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        """Handle GET requests for health check"""
        if self.path == '/health' or self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'status': 'healthy',
                'service': 'Vanna AI',
                'version': '1.0.0'
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())

    def do_POST(self):
        if self.path == '/query' or self.path == '/api/generate-sql':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                print(f"Received request: {data}")
                
                question = data.get('question', '') or data.get('query', '')
                
                if not question:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'No question provided'}).encode())
                    return
                
                # Use Groq API to generate SQL
                print(f"Generating SQL for: {question}")
                sql_query = self.generate_sql_with_groq(question)
                print(f"Generated SQL: {sql_query}")
                
                # Execute the SQL query against the database
                print("Executing SQL...")
                results = self.execute_sql(sql_query)
                print(f"Got {len(results)} results")
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    'sql': sql_query,
                    'results': results,
                    'explanation': f'Found {len(results)} result(s)',
                    'success': True
                }
                self.wfile.write(json.dumps(response).encode())
                print("Response sent successfully")
            except Exception as e:
                print(f"ERROR: {str(e)}")
                import traceback
                traceback.print_exc()
                
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    'error': str(e),
                    'success': False
                }
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())

    def generate_sql_with_groq(self, question):
        """Generate SQL query using Groq API"""
        
        schema_context = """
        Database Schema:
        
        Table: vendors
        - id (UUID, PRIMARY KEY)
        - name (VARCHAR, NOT NULL)
        - email (VARCHAR)
        - phone (VARCHAR)
        - address (VARCHAR)
        
        Table: customers
        - id (UUID, PRIMARY KEY)
        - name (VARCHAR, NOT NULL)
        - email (VARCHAR)
        - phone (VARCHAR)
        - address (VARCHAR)
        
        Table: invoices
        - id (UUID, PRIMARY KEY)
        - invoice_number (VARCHAR, UNIQUE, NOT NULL)
        - vendor_id (UUID, FOREIGN KEY -> vendors.id)
        - customer_id (UUID, FOREIGN KEY -> customers.id)
        - issue_date (TIMESTAMP, NOT NULL)
        - due_date (TIMESTAMP, NOT NULL)
        - total_amount (DECIMAL(12,2), NOT NULL)
        - status (VARCHAR, NOT NULL) -- values: 'paid', 'pending', 'overdue'
        - category (VARCHAR)
        
        Table: line_items
        - id (UUID, PRIMARY KEY)
        - invoice_id (UUID, FOREIGN KEY -> invoices.id)
        - description (VARCHAR, NOT NULL)
        - quantity (DECIMAL(10,2))
        - unit_price (DECIMAL(12,2))
        - amount (DECIMAL(12,2), NOT NULL)
        """
        
        prompt = f"""{schema_context}

Question: {question}

Generate ONLY the SQL query (PostgreSQL syntax) to answer this question. Do not include any explanation, just the SQL query.
"""
        
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {GROQ_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'llama-3.3-70b-versatile',
                'messages': [
                    {'role': 'system', 'content': 'You are a SQL expert. Generate only PostgreSQL SQL queries without any explanation or markdown formatting.'},
                    {'role': 'user', 'content': prompt}
                ],
                'temperature': 0.1,
                'max_tokens': 500
            }
        )
        
        if response.status_code != 200:
            raise Exception(f"Groq API error: {response.text}")
        
        result = response.json()
        sql_query = result['choices'][0]['message']['content'].strip()
        
        # Clean up the SQL query (remove markdown code blocks if present)
        if sql_query.startswith('```'):
            lines = sql_query.split('\n')
            sql_query = '\n'.join(lines[1:-1]) if len(lines) > 2 else sql_query
        sql_query = sql_query.replace('```sql', '').replace('```', '').strip()
        
        return sql_query

    def execute_sql(self, sql_query):
        """Execute SQL query by forwarding to the backend API"""
        try:
            # Call the backend API to execute the SQL
            api_url = "http://localhost:3002/api/execute-sql"
            response = requests.post(
                api_url,
                json={'sql': sql_query},
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('results', [])
            else:
                # If the execute-sql endpoint doesn't exist, return empty results
                return []
        except Exception as e:
            # If there's an error, return empty results (the SQL will still be shown)
            print(f"Warning: Could not execute SQL: {e}")
            return []

    def log_message(self, format, *args):
        """Override to customize logging"""
        print(f"{self.address_string()} - {format % args}")

def run_server():
    """Start the HTTP server"""
    try:
        server_address = ('', PORT)
        httpd = HTTPServer(server_address, VannaHandler)
        print(f"""
╔══════════════════════════════════════════════╗
║   Vanna AI Service Started Successfully!    ║
╠══════════════════════════════════════════════╣
║  Port: {PORT}                                   ║
║  Endpoint: http://localhost:{PORT}/query        ║
║  Status: Ready to process queries           ║
╚══════════════════════════════════════════════╝
""")
        httpd.serve_forever()
    except Exception as e:
        print(f"\nSERVER ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    if not GROQ_API_KEY:
        print("Error: GROQ_API_KEY not set in environment variables")
        sys.exit(1)
    
    print(f"Starting Vanna AI Service...")
    print(f"GROQ_API_KEY: {GROQ_API_KEY[:20]}..." if GROQ_API_KEY else "NO KEY")
    
    try:
        run_server()
    except KeyboardInterrupt:
        print("\nShutting down Vanna AI service...")
        sys.exit(0)
