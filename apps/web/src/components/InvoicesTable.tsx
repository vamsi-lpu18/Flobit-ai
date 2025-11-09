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
import { fetchInvoices } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: string;
  category: string;
}

export default function InvoicesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        const result = await fetchInvoices({ search, page, limit: 50 });
        setInvoices(result.data);
        setTotal(result.pagination.total);
      } catch (error) {
        console.error("Failed to load invoices:", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadInvoices();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, page]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>All invoices ({total} total)</CardDescription>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by invoice number or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-sm">
                  Invoice #
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm">
                  Vendor
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm">
                  Issue Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm">
                  Due Date
                </th>
                <th className="text-right py-3 px-4 font-medium text-sm">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-4" colSpan={7}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-sm">{invoice.vendor}</td>
                    <td className="py-3 px-4 text-sm">
                      {formatDate(invoice.issueDate)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{invoice.category}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
