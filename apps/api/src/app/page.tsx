export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Flobit Analytics API</h1>
      <p>API is running. Use the following endpoints:</p>
      <ul>
        <li>GET /api/stats - Dashboard statistics</li>
        <li>GET /api/invoice-trends - Invoice trends</li>
        <li>GET /api/vendors/top10 - Top 10 vendors</li>
        <li>GET /api/category-spend - Spend by category</li>
        <li>GET /api/cash-outflow - Cash outflow forecast</li>
        <li>GET /api/invoices - List invoices</li>
        <li>POST /api/chat-with-data - Chat with data</li>
      </ul>
    </div>
  );
}
