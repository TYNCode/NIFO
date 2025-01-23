"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";

// Dynamically import ReactQuill for client-side rendering
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Page = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("idle");
    const [richTextContent, setRichTextContent] = useState("<p>Edit your document content here...</p>");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploadStatus("idle");
        setRichTextContent("<p>Edit your document content here...</p>");
        setError("");
    };

    const handleUploadAndGenerate = async () => {
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            
            const uploadResponse = await axios.post(
                "http://127.0.0.1:8000/coinnovation/upload-file/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const extractedProblemStatement = uploadResponse.data.problem_statement;

            const jsonResponse = await axios.post(
                "http://127.0.0.1:8000/coinnovation/generate-challenge-document/",
                { problem_statement: extractedProblemStatement },
                { headers: { "Content-Type": "application/json" } }
            );

            const htmlContent = jsonToHtml(jsonResponse.data);
            setRichTextContent(htmlContent);

            setUploadStatus("uploaded");
        } catch (error) {
            console.error("Error processing the document:", error);
            setError("Failed to process the document. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const jsonToHtml = (data) => {
        let html = "";
        const traverseJson = (obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                html += `<strong>${key}:</strong> `;
                if (typeof value === "object" && !Array.isArray(value)) {
                    html += "<div style='margin-left: 20px;'>";
                    traverseJson(value);
                    html += "</div>";
                } else if (Array.isArray(value)) {
                    html += value.join(", ");
                } else {
                    html += value;
                }
                html += "<br/>";
            });
        };
        traverseJson(data);
        return html;
    };

    const stripHtml = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    const handleDownloadDocx = async () => {
        if (!richTextContent) {
            alert("No content available for download.");
            return;
        }

        try {
            const response = await fetch("/blank.docx");
            if (!response.ok) {
                throw new Error("Failed to fetch the blank document template.");
            }

            const arrayBuffer = await response.arrayBuffer();
            const zip = new PizZip(arrayBuffer);

            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            const strippedContent = stripHtml(richTextContent);
            doc.setData({ content: strippedContent });
            doc.render();

            const out = doc.getZip().generate({ type: "blob" });
            saveAs(out, "Challenge_Curation.docx");
        } catch (error) {
            console.error("Error generating .docx:", error);
            alert("Failed to generate the document. Please check the template and content.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Challenge Curation Tool</h1>

            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
                <div
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    onClick={() => document.getElementById("fileInput").click()}
                >
                    <p className="text-gray-500">
                        {file ? (
                            <span className="text-gray-800 font-medium">{file.name}</span>
                        ) : (
                            "Click or drag a file to upload"
                        )}
                    </p>
                    <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
                <button
                    onClick={handleUploadAndGenerate}
                    disabled={loading}
                    className={`mt-6 px-6 py-3 w-full rounded-lg shadow-md font-semibold ${loading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Processing..." : "Upload & Generate"}
                </button>
            </div>

            {richTextContent && (
                <div className="mt-6 w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Editable Document</h2>
                    <ReactQuill
                        value={richTextContent}
                        onChange={setRichTextContent}
                        className="bg-white border rounded-lg shadow p-4"
                    />
                    <button
                        onClick={handleDownloadDocx}
                        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                    >
                        Download as .docx
                    </button>
                </div>
            )}

            {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
        </div>
    );
};

export default Page;
