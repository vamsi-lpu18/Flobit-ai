"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  FolderOpen,
  File,
  Search,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedDate: string;
  category: string;
}

export default function OtherFiles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Sample data - in a real app, this would come from an API
  const files: FileItem[] = [
    {
      id: "1",
      name: "Q4_Financial_Report.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedDate: "2025-11-08",
      category: "Financial Reports",
    },
    {
      id: "2",
      name: "Contract_Vendor_A.docx",
      type: "DOCX",
      size: "156 KB",
      uploadedDate: "2025-11-07",
      category: "Contracts",
    },
    {
      id: "3",
      name: "Tax_Documents_2025.xlsx",
      type: "XLSX",
      size: "890 KB",
      uploadedDate: "2025-11-06",
      category: "Tax Documents",
    },
    {
      id: "4",
      name: "Employee_Handbook.pdf",
      type: "PDF",
      size: "5.2 MB",
      uploadedDate: "2025-11-05",
      category: "HR Documents",
    },
    {
      id: "5",
      name: "Compliance_Certificate.pdf",
      type: "PDF",
      size: "1.1 MB",
      uploadedDate: "2025-11-04",
      category: "Compliance",
    },
    {
      id: "6",
      name: "Budget_Planning_2026.xlsx",
      type: "XLSX",
      size: "650 KB",
      uploadedDate: "2025-11-03",
      category: "Financial Reports",
    },
  ];

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(files.map((f) => f.category))),
  ];

  const getFileIcon = (type: string) => {
    return <File className="h-5 w-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Library</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage all your business documents
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Upload className="h-4 w-4" />
          Upload File
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{files.length}</div>
            <p className="text-xs text-gray-600 mt-1">Total Files</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {files.filter((f) => f.type === "PDF").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">PDF Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {files.filter((f) => f.type === "XLSX").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Spreadsheets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {files.filter((f) => f.type === "DOCX").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Word Documents</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        {/* Files Table */}
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-600">No files found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      File Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Size
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Upload Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <span className="text-sm font-medium text-gray-900">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {file.category}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {file.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {file.size}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(file.uploadedDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-green-600 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
