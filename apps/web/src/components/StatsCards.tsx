"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchStats } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { DollarSign, FileText, Upload, TrendingUp } from "lucide-react";

interface Stats {
  totalSpend: number;
  totalInvoices: number;
  documentsUploaded: number;
  avgInvoiceValue: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const cards = [
    {
      title: "Total Spend (YTD)",
      value: stats ? formatCurrency(stats.totalSpend) : "$0.00",
      icon: DollarSign,
      description: "Year to date spending",
    },
    {
      title: "Total Invoices Processed",
      value: stats ? formatNumber(stats.totalInvoices) : "0",
      icon: FileText,
      description: "All-time invoice count",
    },
    {
      title: "Documents Uploaded",
      value: stats ? formatNumber(stats.documentsUploaded) : "0",
      icon: Upload,
      description: "Total documents",
    },
    {
      title: "Average Invoice Value",
      value: stats ? formatCurrency(stats.avgInvoiceValue) : "$0.00",
      icon: TrendingUp,
      description: "Mean invoice amount",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 animate-pulse bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 animate-pulse bg-gray-200 rounded mb-2" />
              <div className="h-3 w-20 animate-pulse bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
