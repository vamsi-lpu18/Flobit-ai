"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  manager: string;
  employees: number;
  budget: number;
  spent: number;
  location: string;
}

export default function Departments() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - in a real app, this would come from an API
  const departments: Department[] = [
    {
      id: "1",
      name: "Finance",
      manager: "John Smith",
      employees: 12,
      budget: 500000,
      spent: 380000,
      location: "Building A, Floor 3",
    },
    {
      id: "2",
      name: "Human Resources",
      manager: "Sarah Johnson",
      employees: 8,
      budget: 300000,
      spent: 245000,
      location: "Building A, Floor 2",
    },
    {
      id: "3",
      name: "IT Department",
      manager: "Michael Chen",
      employees: 15,
      budget: 750000,
      spent: 620000,
      location: "Building B, Floor 1",
    },
    {
      id: "4",
      name: "Marketing",
      manager: "Emily Davis",
      employees: 10,
      budget: 450000,
      spent: 390000,
      location: "Building A, Floor 4",
    },
    {
      id: "5",
      name: "Operations",
      manager: "Robert Wilson",
      employees: 20,
      budget: 600000,
      spent: 510000,
      location: "Building B, Floor 2",
    },
    {
      id: "6",
      name: "Sales",
      manager: "Jennifer Brown",
      employees: 18,
      budget: 550000,
      spent: 475000,
      location: "Building A, Floor 5",
    },
  ];

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees = departments.reduce(
    (sum, dept) => sum + dept.employees,
    0
  );
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);
  const totalSpent = departments.reduce((sum, dept) => sum + dept.spent, 0);

  const getUtilizationColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 90) return "text-red-600";
    if (percentage > 75) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage organizational departments and budgets
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Add Department
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-gray-600 mt-1">Total Departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {totalEmployees}
            </div>
            <p className="text-xs text-gray-600 mt-1">Total Employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              €{(totalBudget / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-gray-600 mt-1">Total Budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {((totalSpent / totalBudget) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-gray-600 mt-1">Budget Utilized</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardHeader>

        {/* Departments Table */}
        <CardContent>
          {filteredDepartments.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-600">No departments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Manager
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Employees
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Budget
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Spent
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Utilization
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dept) => {
                    const utilization = (
                      (dept.spent / dept.budget) *
                      100
                    ).toFixed(1);
                    return (
                      <tr
                        key={dept.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {dept.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {dept.manager}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {dept.employees}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                          €{dept.budget.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          €{dept.spent.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${utilization}%` }}
                              ></div>
                            </div>
                            <span
                              className={`text-sm font-semibold ${getUtilizationColor(
                                dept.spent,
                                dept.budget
                              )}`}
                            >
                              {utilization}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {dept.location}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
