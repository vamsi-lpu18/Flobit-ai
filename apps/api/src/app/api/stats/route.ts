import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Total Spend (YTD)
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    const totalSpendResult = await prisma.invoice.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        issueDate: {
          gte: yearStart,
        },
      },
    });

    // Total Invoices Processed
    const totalInvoices = await prisma.invoice.count();

    // Documents Uploaded (same as total invoices in this case)
    const documentsUploaded = totalInvoices;

    // Average Invoice Value
    const avgInvoiceResult = await prisma.invoice.aggregate({
      _avg: {
        totalAmount: true,
      },
    });

    return NextResponse.json({
      totalSpend: Number(totalSpendResult._sum.totalAmount) || 0,
      totalInvoices,
      documentsUploaded,
      avgInvoiceValue: Number(avgInvoiceResult._avg.totalAmount) || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
