import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const categorySpend = await prisma.invoice.groupBy({
      by: ["category"],
      _sum: {
        totalAmount: true,
      },
      where: {
        category: {
          not: null,
        },
      },
      orderBy: {
        _sum: {
          totalAmount: "desc",
        },
      },
    });

    const data = categorySpend.map((item) => ({
      category: item.category || "Uncategorized",
      totalSpend: Number(item._sum.totalAmount) || 0,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching category spend:", error);
    return NextResponse.json(
      { error: "Failed to fetch category spend" },
      { status: 500 }
    );
  }
}
