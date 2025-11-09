"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StatsCards from "./StatsCards";
import InvoiceTrendsChart from "./charts/InvoiceTrendsChart";
import VendorSpendChart from "./charts/VendorSpendChart";
import CategorySpendChart from "./charts/CategorySpendChart";
import CashOutflowChart from "./charts/CashOutflowChart";
import InvoicesTable from "./InvoicesTable";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <InvoiceTrendsChart />
        <VendorSpendChart />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CategorySpendChart />
        <CashOutflowChart />
      </div>

      {/* Invoices Table */}
      <InvoicesTable />
    </div>
  );
}
