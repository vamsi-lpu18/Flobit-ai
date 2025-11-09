import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6); // Next 6 months

    // Get unpaid invoices with due dates in the future
    const upcomingInvoices = await prisma.invoice.findMany({
      where: {
        status: {
          in: ["pending", "overdue"],
        },
        dueDate: {
          gte: today,
          lte: futureDate,
        },
      },
      select: {
        dueDate: true,
        totalAmount: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    // Group by month
    const monthlyOutflow = upcomingInvoices.reduce((acc, invoice) => {
      const month = invoice.dueDate.toISOString().substring(0, 7); // YYYY-MM

      if (!acc[month]) {
        acc[month] = {
          month,
          amount: 0,
        };
      }

      acc[month].amount += Number(invoice.totalAmount);

      return acc;
    }, {} as Record<string, { month: string; amount: number }>);

    const data = Object.values(monthlyOutflow).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching cash outflow:", error);
    return NextResponse.json(
      { error: "Failed to fetch cash outflow forecast" },
      { status: 500 }
    );
  }
}
