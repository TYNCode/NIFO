"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import mammoth from "mammoth";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

// Dynamically load Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const DocxEditor = () => {
    const [docContent, setDocContent] = useState(""); // Editable content
    const [docxFile, setDocxFile] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            setDocxFile(file);
            const arrayBuffer = await file.arrayBuffer();
            const { value } = await mammoth.convertToHtml({ arrayBuffer });
            setDocContent(value);
        } else {
            alert("Please upload a valid .docx file.");
        }
    };

    const handleSaveDocx = () => {
        const htmlContent = docContent;
        const doc = new Document({
            sections: [
                {
                    children: htmlToDocxContent(htmlContent),
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "Edited_Document.docx");
        });
    };

    const htmlToDocxContent = (html) => {
        const lines = html
            .replace(/<[^>]*>/g, "\n") // Remove HTML tags
            .split("\n") // Split into lines
            .filter((line) => line.trim() !== ""); // Remove empty lines

        return lines.map(
            (line) =>
                new Paragraph({
                    children: [new TextRun({ text: line })],
                })
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit .docx File</h1>
            <input
                type="file"
                accept=".docx"
                onChange={handleFileUpload}
                className="mb-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            />
            {docContent && (
                <>
                    <ReactQuill
                        value={docContent}
                        onChange={setDocContent}
                        className="w-full max-w-3xl bg-white border rounded-lg shadow p-4"
                    />
                    <button
                        onClick={handleSaveDocx}
                        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                    >
                        Save as .docx
                    </button>
                </>
            )}
        </div>
    );
};

export default DocxEditor;
