"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const JsonToEditableDoc = () => {
    const [jsonInput, setJsonInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [richTextContent, setRichTextContent] = useState("");

    const handleGenerateEditableContent = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const htmlContent = jsonToHtml(parsedJson);
            setRichTextContent(htmlContent);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Invalid JSON input. Please check the format.");
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

    const handleDownloadWord = () => {
        if (!richTextContent) {
            alert("No content to download. Generate content first.");
            return;
        }

        const doc = new Document({
            sections: [
                {
                    children: richTextContent.split("<br/>").map((line) => {
                        const [boldPart, ...normalParts] = line.split(": ");
                        return new Paragraph({
                            children: [
                                new TextRun({ text: boldPart.replace(/<\/?[^>]+(>|$)/g, ""), bold: true }),
                                ...normalParts.map((part) =>
                                    new TextRun({ text: part.replace(/<\/?[^>]+(>|$)/g, "") })
                                ),
                            ],
                        });
                    }),
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "Editable_Document.docx");
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">JSON to Editable Document</h1>
            <textarea
                className="w-full max-w-3xl p-4 border rounded-lg shadow text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="10"
                placeholder='Enter JSON here (e.g., { "key": "value" })'
                value={jsonInput}
                onChange={(e) => {
                    setJsonInput(e.target.value);
                    setErrorMessage("");
                }}
            />
            {errorMessage && (
                <p className="mt-2 text-red-500 font-medium">{errorMessage}</p>
            )}
            <button
                onClick={handleGenerateEditableContent}
                className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
            >
                Generate Editable Content
            </button>
            {richTextContent && (
                <div className="w-full max-w-3xl mt-6">
                    <ReactQuill
                        value={richTextContent}
                        onChange={setRichTextContent}
                        className="bg-white border rounded-lg shadow"
                    />
                    <button
                        onClick={handleDownloadWord}
                        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                    >
                        Download as Word Document
                    </button>
                </div>
            )}
        </div>
    );
};

export default JsonToEditableDoc;
