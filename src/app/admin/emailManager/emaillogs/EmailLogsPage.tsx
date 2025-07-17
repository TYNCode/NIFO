// src/app/admin/emails/logs/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaSync, FaCheckCircle, FaTimesCircle, FaPaperPlane } from "react-icons/fa";
import { EmailLog } from "../types/EmailLog";
import LogsTable from "../components/LogsTable";


const EmailLogsPage = () => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "sent" | "failed">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(20);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, statusFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseURL}emails/email-logs/`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        console.error("Failed to fetch logs");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.recipient_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const getTemplateName = (templatePath: string) => {
    if (templatePath.includes("invite")) return "Invitation";
    if (templatePath.includes("followup")) return "Follow-up";
    if (templatePath.includes("engage")) return "Engagement";
    return "Unknown";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleResend = async (log: EmailLog) => {
    if (!confirm(`Resend email to ${log.recipient_email}?`)) return;
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseURL}emails/send-single-email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: log.context.name,
          email: log.context.email,
          link: log.context.link || "",
          subject: "Resent Email",
          template: log.template_used.includes("invite") ? "invite" :
                   log.template_used.includes("followup") ? "followup" : "engage",
        }),
      });
      if (response.ok) {
        setToast({ message: "Email resent successfully!", type: "success" });
        fetchLogs();
      } else {
        setToast({ message: "Failed to resend email", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Error resending email", type: "error" });
    }
  };

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const stats = {
    total: logs.length,
    sent: logs.filter(log => log.status === "sent").length,
    failed: logs.filter(log => log.status === "failed").length,
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Logs</h1>
            <p className="text-gray-600">Monitor and track all email communications</p>
          </div>
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FaSync className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Emails</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FaPaperPlane className="text-2xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Successfully Sent</p>
              <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
            </div>
            <FaCheckCircle className="text-2xl text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <FaTimesCircle className="text-2xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "sent" | "failed")}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <LogsTable
        isLoading={isLoading}
        logs={filteredLogs}
        currentPage={currentPage}
        logsPerPage={logsPerPage}
        setCurrentPage={setCurrentPage}
        handleResend={handleResend}
      />

      {/* Toast/Snackbar */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}<button className="ml-4 text-white font-bold" onClick={()=>setToast(null)}>×</button></div>
      )}
    </div>
  );
};

export default EmailLogsPage;