"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Page = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("idle");
    const [problemStatement, setProblemStatement] = useState("");
    const [questions, setQuestions] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [documentContent, setDocumentContent] = useState("");
    const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
    const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    /** STEP 1: Upload file and extract problem statement */
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploadStatus("idle");
        setProblemStatement("");
        setQuestions([]);
        setChatHistory([]);
        setCurrentQuestionIndex(0);
        setUserInput("");
        setDocumentContent("");
    };

    const handleUploadAndGenerate = async () => {
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }

        setUploadStatus("uploading");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const uploadResponse = await axios.post(
                "http://127.0.0.1:8000/coinnovation/upload-file/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const extractedProblemStatement = uploadResponse.data.problem_statement;
            setProblemStatement(extractedProblemStatement);

            // Display problem statement and begin generating questions in the background
            setChatHistory([
                { type: "system", message: "Problem Statement: " + extractedProblemStatement },
                { type: "system", message: "I will ask a few questions to understand your requirement correctly." }
            ]);

            generateQuestions(extractedProblemStatement);
        } catch (error) {
            console.error("Error processing the document:", error);
            alert("Failed to process the document. Please try again.");
        } finally {
            setUploadStatus("idle");
        }
    };

    /** STEP 2: Generate questions */
    const generateQuestions = async (problemStatement) => {
        setIsGeneratingQuestions(true);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/coinnovation/generate-questions/",
                { problem_statement: problemStatement },
                { headers: { "Content-Type": "application/json" } }
            );

            const generatedQuestions = response.data.questions || [];
            setQuestions(generatedQuestions);
            setCurrentQuestionIndex(0);

            // Add first question to chat
            setChatHistory((prev) => [
                ...prev,
                { type: "system", message: generatedQuestions[0] }
            ]);
        } catch (error) {
            console.error("Error generating questions:", error);
            alert("Failed to generate questions.");
        } finally {
            setIsGeneratingQuestions(false);
        }
    };

    /** STEP 3: Handle user answers */
    const handleAnswerSubmit = () => {
        if (!userInput.trim()) return alert("Please provide an answer before submitting.");

        const updatedChatHistory = [...chatHistory, { type: "user", message: userInput }];
        setChatHistory(updatedChatHistory);
        setUserInput("");
        setIsTyping(true);

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                const nextQuestion = questions[currentQuestionIndex + 1];
                setChatHistory((prev) => [...prev, { type: "system", message: nextQuestion }]);
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setIsTyping(false);
            } else {
                // After last question, generate document
                generateFinalDocument();
            }
        }, 1500);
    };

    /** STEP 4: Generate final document */
    const generateFinalDocument = async () => {
        setIsGeneratingDocument(true);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/coinnovation/generate-challenge-document/",
                {
                    problem_statement: problemStatement,
                    answers: chatHistory.filter((entry) => entry.type === "user").map((entry) => entry.message)
                },
                { headers: { "Content-Type": "application/json" } }
            );

            setDocumentContent(response.data.final_document);
            setChatHistory((prev) => [...prev, { type: "system", message: "Your document is ready. You can edit and download it below." }]);
        } catch (error) {
            console.error("Error generating document:", error);
            alert("Failed to generate document.");
        } finally {
            setIsGeneratingDocument(false);
        }
    };

    /** STEP 5: Download document as DOCX */
    const handleDownloadDocx = async () => {
        try {
            const response = await fetch("/blank.docx");
            if (!response.ok) {
                throw new Error("Failed to fetch the blank document template.");
            }

            const arrayBuffer = await response.arrayBuffer();
            const zip = new PizZip(arrayBuffer);

            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true
            });

            doc.setData({ content: documentContent });
            doc.render();

            const out = doc.getZip().generate({ type: "blob" });
            saveAs(out, "Challenge_Curation.docx");
        } catch (error) {
            console.error("Error generating .docx:", error);
            alert("Failed to generate the document.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Challenge Curation Tool</h1>

            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUploadAndGenerate} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Upload & Generate
                </button>
            </div>

            {chatHistory.length > 0 && (
                <div className="mt-6 w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                    {chatHistory.map((chat, index) => (
                        <div key={index} className={`mt-2 ${chat.type === "user" ? "text-right" : "text-left"}`}>
                            <p className={`${chat.type === "user" ? "text-blue-600" : "text-gray-700"}`}>
                                {chat.message}
                            </p>
                        </div>
                    ))}
                    {isTyping && <p>Typing...</p>}
                    <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} className="w-full p-2 border rounded-lg" />
                    <button onClick={handleAnswerSubmit} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg">Submit</button>
                </div>
            )}

            {documentContent && (
                <ReactQuill value={documentContent} onChange={setDocumentContent} />
            )}

            {documentContent && <button onClick={handleDownloadDocx}>Download</button>}
        </div>
    );
};

export default Page;
