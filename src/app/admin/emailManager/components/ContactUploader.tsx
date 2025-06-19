// src/app/admin/emails/components/ContactUploader.tsx
"use client";

import React, { useState, useRef } from "react";
import { FaUpload, FaFileExcel, FaFileCsv, FaGoogle, FaTrash } from "react-icons/fa";
import { Contact } from "../../types/Contact";

interface ContactUploaderProps {
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
}

const ContactUploader: React.FC<ContactUploaderProps> = ({ contacts, setContacts }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [uploadType, setUploadType] = useState<"file" | "sheet">("file");
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add validation for contacts
  const validateContacts = (contacts: Contact[]) => {
    return contacts.map((contact) => {
      const errors: { name?: boolean; email?: boolean } = {};
      if (!contact.name || contact.name.trim() === "") errors.name = true;
      if (!contact.email || !/^\S+@\S+\.\S+$/.test(contact.email)) errors.email = true;
      return { ...contact, errors };
    });
  };

  // After setting contacts, validate them
  const [validatedContacts, setValidatedContacts] = useState<any[]>([]);
  React.useEffect(() => {
    setValidatedContacts(validateContacts(contacts));
  }, [contacts]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setErrors([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/emails/upload-contacts/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
      } else {
        const errorData = await response.json();
        setErrors([errorData.error || "Failed to upload file"]);
      }
    } catch (error) {
      setErrors(["Network error. Please try again."]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGoogleSheetUpload = async () => {
    if (!googleSheetUrl.trim()) {
      setErrors(["Please enter a valid Google Sheet URL"]);
      return;
    }

    setIsUploading(true);
    setErrors([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/emails/upload-contacts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sheet_url: googleSheetUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
        setGoogleSheetUrl("");
      } else {
        const errorData = await response.json();
        setErrors([errorData.error || "Failed to load Google Sheet"]);
      }
    } catch (error) {
      setErrors(["Network error. Please try again."]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => 
      file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );
    
    if (validFile) {
      handleFileUpload(validFile);
    } else {
      setErrors(["Please upload a valid CSV or Excel file"]);
    }
  };

  const clearContacts = () => {
    setContacts([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Type Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setUploadType("file")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            uploadType === "file"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FaUpload className="inline mr-2" />
          Upload File
        </button>
        <button
          onClick={() => setUploadType("sheet")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            uploadType === "sheet"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FaGoogle className="inline mr-2" />
          Google Sheet
        </button>
      </div>

      {/* File Upload */}
      {uploadType === "file" && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
        >
          <div className="space-y-4">
            <div className="flex justify-center space-x-4 text-4xl text-gray-400">
              <FaFileCsv />
              <FaFileExcel />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your file here, or{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports CSV, XLSX files with headers: name, email, link (optional)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Google Sheet URL */}
      {uploadType === "sheet" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Sheet URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleGoogleSheetUpload}
                disabled={isUploading || !googleSheetUrl.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <FaUpload className="text-sm" />
                )}
                Load
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <strong>Note:</strong> Make sure your Google Sheet is publicly accessible and contains columns: name, email, link (optional)
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium mb-2">Upload Errors:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Loading State */}
      {isUploading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-3" />
          <p className="text-gray-600">Processing contacts...</p>
        </div>
      )}

      {/* Contacts Preview */}
      {validatedContacts.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-green-800 font-medium">
              ✓ {validatedContacts.length} contacts loaded successfully
            </h4>
            <button
              onClick={clearContacts}
              className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
            >
              <FaTrash className="text-xs" />
              Clear
            </button>
          </div>
          
          {/* Preview Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 mt-6">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {validatedContacts.slice(0, 10).map((contact, idx) => (
                  <tr key={idx}>
                    <td className={`px-4 py-2 text-sm ${contact.errors?.name ? 'bg-red-100 text-red-700' : ''}`}>{contact.name || <span className="italic text-gray-400">Missing</span>}</td>
                    <td className={`px-4 py-2 text-sm ${contact.errors?.email ? 'bg-red-100 text-red-700' : ''}`}>{contact.email || <span className="italic text-gray-400">Missing</span>}</td>
                    <td className="px-4 py-2 text-sm">{contact.link || <span className="italic text-gray-400">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2">Showing up to 10 contacts. Invalid fields are highlighted in red.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUploader;