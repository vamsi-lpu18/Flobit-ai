import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const topVendors = await prisma.invoice.groupBy({
      by: ["vendorId"],
      _sum: {
        totalAmount: true,
      },
      orderBy: {
        _sum: {
          totalAmount: "desc",
        },
      },
      take: 10,
    });

    // Get vendor details
    const vendorIds = topVendors.map((v) => v.vendorId);
    const vendors = await prisma.vendor.findMany({
      where: {
        id: {
          in: vendorIds,
        },
      },
    });

    const vendorMap = new Map(vendors.map((v) => [v.id, v]));

    const data = topVendors.map((item) => ({
      name: vendorMap.get(item.vendorId)?.name || "Unknown",
      totalSpend: Number(item._sum.totalAmount) || 0,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching top vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch top vendors" },
      { status: 500 }
    );
  }
}
