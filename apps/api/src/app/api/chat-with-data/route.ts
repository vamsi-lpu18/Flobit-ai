import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    console.log("=== CHAT WITH DATA REQUEST ===");
    console.log("Query:", query);

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const vannaBaseUrl =
      process.env.VANNA_API_BASE_URL || "http://localhost:8000";

    console.log("Vanna URL:", vannaBaseUrl);
    console.log("Calling:", `${vannaBaseUrl}/query`);

    // Forward request to Vanna AI service
    const startTime = Date.now();
    const response = await fetch(`${vannaBaseUrl}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.VANNA_API_KEY && {
          Authorization: `Bearer ${process.env.VANNA_API_KEY}`,
        }),
      },
      body: JSON.stringify({ question: query }),
    });

    console.log("Vanna response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Vanna error response:", errorText);
      throw new Error(
        `Vanna AI service returned ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      sql: data.sql || "",
      data: data.results || [],
      executionTime,
      explanation: data.explanation || "",
    });
  } catch (error) {
    console.error("Error in chat-with-data:", error);
    return NextResponse.json(
      {
        error: "Failed to process query",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
