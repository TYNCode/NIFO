"use client";

import React, { useState } from "react";
import { FaPalette, FaEye, FaEdit, FaCopy, FaEnvelope } from "react-icons/fa";

interface Template {
  id: string;
  name: string;
  description: string;
  category: "invite" | "followup" | "engage";
  subject: string;
  preview: string;
  variables: string[];
}

const templates: Template[] = [
  {
    id: "invite",
    name: "Invitation Email",
    description: "Welcome new users to the NIFO platform",
    category: "invite",
    subject: "Welcome to NIFO - Unlock Co-Innovation Opportunities",
    preview: "Dear {{name}}, Welcome to NIFO! We're excited to have you join our innovation platform. Visit {{link}} to begin.",
    variables: ["name", "email", "link"],
  },
  {
    id: "followup",
    name: "Follow-up Email",
    description: "Re-engage existing users and follow up on previous communications",
    category: "followup",
    subject: "Don't Miss Out - Continue Your NIFO Journey",
    preview: "Hi {{name}}, We noticed you haven't completed your profile setup. Continue here: {{link}}.",
    variables: ["name", "email", "link"],
  },
  {
    id: "engage",
    name: "Engagement Email",
    description: "Encourage active participation and engagement on the platform",
    category: "engage",
    subject: "New Opportunities Await - Explore NIFO Today",
    preview: "Hello {{name}}, There are exciting new collaboration opportunities waiting. Explore more: {{link}}.",
    variables: ["name", "email", "link"],
  },
];

const EmailTemplatesPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewData, setPreviewData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    link: "https://theyellow.network",
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "invite":
        return "bg-blue-100 text-blue-800";
      case "followup":
        return "bg-yellow-100 text-yellow-800";
      case "engage":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "invite":
        return "👋";
      case "followup":
        return "🔄";
      case "engage":
        return "🚀";
      default:
        return "📧";
    }
  };

  const renderPreview = (template: Template) => {
    let preview = template.preview;
    Object.entries(previewData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, "g"), value);
    });
    return preview;
  };

  const copyTemplateId = (templateId: string) => {
    navigator.clipboard.writeText(templateId);
    alert(`Template ID "${templateId}" copied to clipboard!`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Templates</h1>
        <p className="text-gray-600">Manage and preview email templates for the NIFO platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2">
            <FaPalette className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Available Templates</h2>
          </div>
          <div>
            {templates.map((template) => (
              <div
                key={template.id}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                  selectedTemplate?.id === template.id ? "bg-gray-50" : ""
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      {getCategoryIcon(template.category)} {template.name}
                    </h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {selectedTemplate ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">{selectedTemplate.name}</h2>
                  <p className="text-sm text-gray-500">Subject: {selectedTemplate.subject}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => copyTemplateId(selectedTemplate.id)}
                    className="inline-flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <FaCopy className="mr-1" /> Copy ID
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Live Preview</label>
                <div className="p-4 bg-gray-50 rounded border border-gray-200 text-sm text-gray-800 whitespace-pre-line">
                  {renderPreview(selectedTemplate)}
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mock Data (editable)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedTemplate.variables.map((variable) => (
                    <div key={variable}>
                      <label className="block text-xs text-gray-500 mb-1 capitalize">{variable}</label>
                      <input
                        type="text"
                        value={(previewData as any)[variable] || ""}
                        onChange={(e) =>
                          setPreviewData((prev) => ({ ...prev, [variable]: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-20">Select a template to preview it.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatesPage;
