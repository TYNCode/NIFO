// src/app/admin/emails/compose/page.tsx
"use client";

import React, { useState } from "react";
import { FaUpload, FaPaperPlane, FaFlask } from "react-icons/fa";
import { Contact } from "../types/Contact";
import ContactUploader from "../components/ContactUploader";
import BulkEmailForm from "../components/BulkEmailForm";
import TestEmailModal from "../components/TestEmailModal";


const EmailComposePage = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "send">("upload");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const tabs = [
    { id: "upload", label: "Upload Contacts", icon: FaUpload },
    { id: "send", label: "Send Bulk Email", icon: FaPaperPlane },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Manager</h1>
        <p className="text-gray-600">
          Upload contacts and send personalized bulk emails for NIFO platform
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "upload" | "send")}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="text-base" />
                  {tab.label}
                  {tab.id === "send" && contacts.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                      {contacts.length}
                    </span>
                  )}
                </button>
              );
            })}
            {/* Test Email Button */}
            <div className="ml-auto flex items-center p-2">
              <button
                onClick={() => setIsTestModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <FaFlask className="text-sm" />
                Send Test Email
              </button>
            </div>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "upload" && (
            <ContactUploader contacts={contacts} setContacts={setContacts} />
          )}
          {activeTab === "send" && (
            <BulkEmailForm contacts={contacts} />
          )}
        </div>
      </div>

      {/* Test Email Modal */}
      <TestEmailModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
};

export default EmailComposePage;