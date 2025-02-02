"use client";

import React, { useState } from "react";
import axios from "axios";

const Page = () => {
    const [file, setFile] = useState(null);
    const [problemStatement, setProblemStatement] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [chatHistory, setChatHistory] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [jsonOutput, setJsonOutput] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const API_BASE_URL = "http://127.0.0.1:8000/coinnovation";

    /** STEP 1: Handle File Upload and Extract Problem Statement */
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        resetState();
    };

    const resetState = () => {
        setProblemStatement("");
        setQuestions([]);
        setAnswers({});
        setChatHistory([]);
        setCurrentQuestionIndex(0);
        setUserInput("");
        setJsonOutput(null);
        setIsAnswering(false);
        setIsDownloading(false);
    };

    const handleUploadAndGenerate = async () => {
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadResponse = await axios.post(
                `${API_BASE_URL}/upload-file/`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const extractedProblemStatement = uploadResponse.data.problem_statement;
            setProblemStatement(extractedProblemStatement);

            setChatHistory([
                { type: "system", message: "Problem Statement: " + extractedProblemStatement },
                { type: "system", message: "I will ask a few questions to understand your requirement." }
            ]);

            generateQuestions(extractedProblemStatement);
        } catch (error) {
            console.error("Error processing the document:", error);
            alert("Failed to process the document.");
        }
    };

    /** STEP 2: Generate Questions */
    const generateQuestions = async (problemStatement) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/generate-questions/`,
                { problem_statement: problemStatement },
                { headers: { "Content-Type": "application/json" } }
            );

            const generatedQuestions = response.data.questions || [];
            setQuestions(generatedQuestions);

            if (generatedQuestions.length > 0) {
                setChatHistory((prev) => [...prev, { type: "system", message: generatedQuestions[0] }]);
                setIsAnswering(true);
            }
        } catch (error) {
            console.error("Error generating questions:", error);
            alert("Failed to generate questions.");
        }
    };

    /** STEP 3: Handle Answer Submission */
    const handleAnswerSubmit = () => {
        if (!userInput.trim()) return alert("Please provide an answer.");

        const updatedAnswers = { ...answers, [questions[currentQuestionIndex]]: userInput };
        setAnswers(updatedAnswers);

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
                generateFinalJson(updatedAnswers);
            }
        }, 1500);
    };

    /** STEP 4: Generate Final JSON */
    const generateFinalJson = async (finalAnswers) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/generate-challenge-document/`,
                {
                    problem_statement: problemStatement,
                    answers: finalAnswers
                },
                { headers: { "Content-Type": "application/json" } }
            );

            setJsonOutput(response.data);
            setChatHistory((prev) => [...prev, { type: "system", message: "JSON generated successfully!" }]);

            downloadDocx(response.data);
        } catch (error) {
            console.error("Error generating JSON:", error);
            alert("Failed to generate JSON.");
        }
    };

    /** STEP 5: Generate & Download DOCX */
    const downloadDocx = async (jsonData) => {
        try {
            setIsDownloading(true);
            const response = await axios.post(
                `${API_BASE_URL}/generate-docx/`,
                { final_document: jsonData.final_document },
                {
                    headers: { "Content-Type": "application/json" },
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Final_Document.docx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setChatHistory((prev) => [...prev, { type: "system", message: "DOCX file downloaded!" }]);
        } catch (error) {
            console.error("Error generating DOCX:", error);
            alert("Failed to download DOCX.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-gray-700 mb-6">Challenge Curation Tool</h1>

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
                            <p className={`${chat.type === "user" ? "text-blue-600" : "text-gray-700"}`}>{chat.message}</p>
                        </div>
                    ))}
                    {isTyping && <p>Typing...</p>}
                    {isAnswering && (
                        <>
                            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} className="w-full p-2 border rounded-lg" />
                            <button onClick={handleAnswerSubmit} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg">
                                Submit
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Page;
