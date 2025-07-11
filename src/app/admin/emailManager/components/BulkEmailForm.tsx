// src/app/admin/emails/components/BulkEmailForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Contact } from "../types/Contact";



interface BulkEmailFormProps {
  contacts: Contact[];
}

interface SendResult {
  email: string;
  status: "sent" | "failed";
  error?: string;
}

const templates = [
  {
    id: "invite",
    name: "Invitation Email",
    description: "Welcome new users to the NIFO platform",
  },
  {
    id: "followup",
    name: "Follow-up Email",
    description: "Re-engage existing users or follow up on previous communications",
  },
  {
    id: "engage",
    name: "Engagement Email",
    description: "Encourage active participation and engagement on the platform",
  },
];

// Add a simple toast/snackbar
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded shadow-lg text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{message}<button className="ml-4 text-white font-bold" onClick={onClose}>×</button></div>
);

const BulkEmailForm: React.FC<BulkEmailFormProps> = ({ contacts }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<SendResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSendBulkEmail = async () => {
    if (!selectedTemplate || !subject.trim()) {
      setToast({ message: "Please select a template and enter a subject", type: "error" });
      return;
    }

    setIsSending(true);
    setSendResults([]);
    setShowResults(false);

    try {
      const response = await fetch("https://tyn-server.azurewebsites.net/api/api/emails/send-bulk-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: selectedTemplate,
          subject: subject,
          contacts: contacts,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSendResults(data.results);
        setShowResults(true);
        setToast({ message: `Sent to ${data.results.filter((r:any)=>r.status==='sent').length} / ${contacts.length} contacts`, type: "success" });
      } else {
        const errorData = await response.json();
        setToast({ message: "Failed to send emails: " + (errorData.error || "Unknown error"), type: "error" });
      }
    } catch (error) {
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setIsSending(false);
    }
  };

  const successCount = sendResults.filter(r => r.status === "sent").length;
  const failureCount = sendResults.filter(r => r.status === "failed").length;

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <FaUsers className="mx-auto text-4xl text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts uploaded</h3>
        <p className="text-gray-500">
          Please upload contacts first in the "Upload Contacts" tab
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FaUsers className="text-blue-600 text-xl" />
          <div>
            <h3 className="font-medium text-blue-900">
              Ready to send to {contacts.length} contacts
            </h3>
            <p className="text-sm text-blue-700">
              Contacts loaded and validated successfully
            </p>
          </div>
        </div>
      </div>

      {/* Contact List Preview */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 mb-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.slice(0, 10).map((contact, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm">{contact.name}</td>
                <td className="px-4 py-2 text-sm">{contact.email}</td>
                <td className="px-4 py-2 text-sm">{contact.link || <span className="italic text-gray-400">-</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-gray-500 mb-2">Showing up to 10 contacts.</div>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Email Template
        </label>
        <div className="grid gap-3">
          {templates.map((template) => (
            <label
              key={template.id}
              className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTemplate === template.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="template"
                value={template.id}
                checked={selectedTemplate === template.id}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="mt-1 mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">{template.name}</div>
                <div className="text-sm text-gray-500">{template.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Subject Line */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject line..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Send Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSendBulkEmail}
          disabled={isSending || !selectedTemplate || !subject.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Sending to {contacts.length} contacts...
            </>
          ) : (
            <>
              <FaPaperPlane className="text-sm" />
              Send to All ({contacts.length} contacts)
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Send Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span className="text-sm">
                  <strong>{successCount}</strong> sent successfully
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaTimesCircle className="text-red-500" />
                <span className="text-sm">
                  <strong>{failureCount}</strong> failed
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Detailed Results</h4>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {sendResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                    result.status === "sent" ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.status === "sent" ? (
                      <FaCheckCircle className="text-green-500 text-sm" />
                    ) : (
                      <FaTimesCircle className="text-red-500 text-sm" />
                    )}
                    <span className="text-sm text-gray-900">{result.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        result.status === "sent"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.status}
                    </span>
                    {result.error && (
                      <span className="text-xs text-red-600 max-w-xs truncate">
                        {result.error}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast/Snackbar */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BulkEmailForm;