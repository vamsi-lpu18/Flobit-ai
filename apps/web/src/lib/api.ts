const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchInvoiceTrends() {
  const res = await fetch(`${API_BASE}/invoice-trends`);
  if (!res.ok) throw new Error("Failed to fetch invoice trends");
  return res.json();
}

export async function fetchTopVendors() {
  const res = await fetch(`${API_BASE}/vendors/top10`);
  if (!res.ok) throw new Error("Failed to fetch top vendors");
  return res.json();
}

export async function fetchCategorySpend() {
  const res = await fetch(`${API_BASE}/category-spend`);
  if (!res.ok) throw new Error("Failed to fetch category spend");
  return res.json();
}

export async function fetchCashOutflow() {
  const res = await fetch(`${API_BASE}/cash-outflow`);
  if (!res.ok) throw new Error("Failed to fetch cash outflow");
  return res.json();
}

export async function fetchInvoices(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.set("search", params.search);
  if (params?.status) queryParams.set("status", params.status);
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());

  const res = await fetch(`${API_BASE}/invoices?${queryParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
}

export async function chatWithData(query: string) {
  const res = await fetch(`${API_BASE}/chat-with-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to process query");
  }

  return res.json();
}
