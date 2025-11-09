import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql } = body;

    if (!sql) {
      return NextResponse.json(
        { error: "SQL query is required" },
        { status: 400 }
      );
    }

    // Execute raw SQL query
    const results = await prisma.$queryRawUnsafe(sql);

    return NextResponse.json({
      results,
      count: Array.isArray(results) ? results.length : 0,
    });
  } catch (error) {
    console.error("Error executing SQL:", error);
    return NextResponse.json(
      {
        error: "Failed to execute SQL query",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
