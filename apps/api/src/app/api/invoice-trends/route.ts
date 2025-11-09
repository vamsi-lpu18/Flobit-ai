import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get invoices grouped by month
    const invoices = await prisma.invoice.findMany({
      select: {
        issueDate: true,
        totalAmount: true,
      },
      orderBy: {
        issueDate: "asc",
      },
    });

    // Group by month
    const monthlyData = invoices.reduce((acc, invoice) => {
      const month = invoice.issueDate.toISOString().substring(0, 7); // YYYY-MM

      if (!acc[month]) {
        acc[month] = {
          month,
          count: 0,
          totalAmount: 0,
        };
      }

      acc[month].count += 1;
      acc[month].totalAmount += Number(invoice.totalAmount);

      return acc;
    }, {} as Record<string, { month: string; count: number; totalAmount: number }>);

    const data = Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching invoice trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice trends" },
      { status: 500 }
    );
  }
}
