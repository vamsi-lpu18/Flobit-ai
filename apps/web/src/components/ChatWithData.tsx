"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { chatWithData } from "@/lib/api";
import { Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sql?: string;
  data?: any[];
  executionTime?: number;
}

export default function ChatWithData() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await chatWithData(input);

      const assistantMessage: Message = {
        role: "assistant",
        content: result.explanation || "Query executed successfully",
        sql: result.sql,
        data: result.data,
        executionTime: result.executionTime,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content:
          error instanceof Error ? error.message : "Failed to process query",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "What's the total spend in the last 90 days?",
    "List top 5 vendors by spend",
    "Show overdue invoices as of today",
    "What's the average invoice amount by category?",
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[700px] flex flex-col">
          <CardHeader>
            <CardTitle>Chat with Your Data</CardTitle>
            <CardDescription>
              Ask questions in natural language about your invoice data
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <p className="text-lg mb-2">Start asking questions!</p>
                    <p className="text-sm">
                      Try one of the sample questions on the right
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>

                      {message.sql && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs font-semibold mb-1">
                            Generated SQL:
                          </p>
                          <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">
                            {message.sql}
                          </pre>
                        </div>
                      )}

                      {message.data && message.data.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs font-semibold mb-1">
                            Results ({message.data.length} rows):
                          </p>
                          <div className="overflow-x-auto">
                            <table className="text-xs w-full">
                              <thead>
                                <tr className="border-b">
                                  {Object.keys(message.data[0]).map((key) => (
                                    <th
                                      key={key}
                                      className="text-left px-2 py-1"
                                    >
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {message.data.slice(0, 10).map((row, i) => (
                                  <tr key={i} className="border-b">
                                    {Object.values(row).map((value: any, j) => (
                                      <td key={j} className="px-2 py-1">
                                        {typeof value === "number"
                                          ? value.toLocaleString()
                                          : String(value)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {message.data.length > 10 && (
                              <p className="text-xs text-gray-500 mt-1">
                                Showing 10 of {message.data.length} rows
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {message.executionTime && (
                        <p className="text-xs text-gray-500 mt-2">
                          Executed in {message.executionTime}ms
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your invoices..."
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Sample Questions */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Sample Questions</CardTitle>
            <CardDescription>Click to try these queries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors text-sm"
                disabled={loading}
              >
                {question}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>1. You ask a question in natural language</p>
            <p>2. Vanna AI converts it to SQL using Groq LLM</p>
            <p>3. SQL is executed on your PostgreSQL database</p>
            <p>4. Results are displayed in a table format</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
