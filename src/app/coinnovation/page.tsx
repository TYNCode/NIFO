"use client";

import React, { useState } from "react";
import axios from "axios";
import NavbarTrend from "../components/TrendsWeb/NavbarTrend";
import { IoAttachOutline, IoSend } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import ProblemStatement from "./ProblemStatement";
import Questionnaire from "./Questionnaire";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const Page = () => {
    const [file, setFile] = useState(null);
    const [problemStatement, setProblemStatement] = useState("");
    const [isProblemStatementLoading, setIsProblemStatementLoading] = useState(false);
    const [isAskingQuestions, setIsAskingQuestions] = useState(false);
    const [skipQuestions, setSkipQuestions] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isGeneratingJSON, setIsGeneratingJSON] = useState(false);
    const [context, setContext] = useState("");
    const [generatedJSON, setGeneratedJSON] = useState(null);
    const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
    const [docxFileUrl, setDocxFileUrl] = useState(null);
    const [textStatement, setTextStatement] = useState("");
    const [isChoosenOption, setIsChoosenOption] = useState(false);
    const [isDocumentLoading , setIsDocumentLoading] = useState(false);

    const API_BASE_URL = "http://127.0.0.1:8000/coinnovation";

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleUploadAndGenerate = async () => {
        if (!file && !textStatement.trim()) {
            alert("Please enter a problem statement or upload a file.");
            return;
        }

        setIsProblemStatementLoading(true);

        try {
            let response;
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                response = await axios.post(
                    `${API_BASE_URL}/upload-file/`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            } else if (textStatement.trim()) {
                response = await axios.post(
                    `${API_BASE_URL}/upload-file/`,
                    { text: textStatement },
                    { headers: { "Content-Type": "application/json" } }
                );
            } else {
                alert("Please enter a problem statement or upload a file.");
                setIsProblemStatementLoading(false);
                return;
            }
            setProblemStatement(response.data.problem_statement);
            setContext(response.data.context);

        } catch (error) {
            console.error("Error processing the document:", error);
            alert("Failed to process the document.");
        } finally {
            setIsProblemStatementLoading(false);
        }
    };

    const handleProceed = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/generate-questions/`,
                { problem_statement: problemStatement, context: context },
                { headers: { "Content-Type": "application/json" } }
            );
            
            setQuestions(response.data.questions || []);
            const emptyAnswers = response.data.questions.reduce((acc, q) => {
                acc[q] = "";
                return acc;
            }, {});
            setAnswers(emptyAnswers);
            setIsChoosenOption(true);
            setIsAskingQuestions(true);
        } catch (error) {
            console.error("Error generating questions:", error);
            alert("Failed to generate questions.");
        }
    };

    const handleSkipQuestions = async () => {
        setSkipQuestions(true);
        setIsGeneratingJSON(true);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/generate-questions/`,
                { problem_statement: problemStatement, context: context },
                { headers: { "Content-Type": "application/json" } }
            );

            const preGeneratedAnswers = {};
            response.data.questions.forEach((q, index) => {
                preGeneratedAnswers[q] = response.data.answers[index] || "No answer provided.";
            });

            setIsChoosenOption(true);
            await callGenerateChallengeAPI(preGeneratedAnswers);

        } catch (error) {
            console.error("Error skipping questions:", error);
            alert("Failed to generate challenge document.");
        }
    };

    const handleAnswerSubmit = async () => {
        const currentQuestion = questions[currentQuestionIndex];

        if (!answers[currentQuestion] || answers[currentQuestion].trim() === "") {
            alert("Please provide an answer.");
            return;
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsDocumentLoading(true);
            setIsGeneratingJSON(true);
            setIsAskingQuestions(false);
            setSkipQuestions(true);
            await callGenerateChallengeAPI(answers); 
        }
    };

    const callGenerateChallengeAPI = async (finalAnswers) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/generate-challenge-document/`,
                { problem_statement: problemStatement, context: context, answers: finalAnswers },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("document json generated")

            setIsDocumentLoading(false);
            setGeneratedJSON(response.data);
            await callGenerateDocxAPI(response.data);
        } catch (error) {
            console.error("Error generating challenge document:", error);
            alert("Failed to generate challenge document.");
        }
    };

    const callGenerateDocxAPI = async (jsonData) => {
        console.log("document issssssssss generated")
        setIsGeneratingDocx(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/generate-docx/`,
                jsonData,
                { headers: { "Content-Type": "application/json" }, responseType: "blob" }
            );

            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const url = window.URL.createObjectURL(blob);
            setDocxFileUrl(url);
        
        } catch (error) {
            console.error("Error generating DOCX document:", error);
            alert("Failed to generate DOCX document.");
        } finally {
            setIsGeneratingDocx(false);
        }
    };

    const handleIconClick = () => {
        document.getElementById("fileInput").click();
    }

    return (
        <>
            <NavbarTrend />
            <div className="px-32 py-16 relative">
                {file && (
                    <div className="text-sm mb-2 bg-gray-200 w-max px-4 py-2 text-gray-500 shadow-sm rounded-md relative">
                        {file.name.endsWith('.xlsx') && (
                            <span className="text-white text-[10px] bg-green-500 px-1 py-1 uppercase mr-2">
                                Spreadsheet
                            </span>
                        )}
                        {file.name.endsWith('.docx') && (
                            <span className="text-white text-[10px] bg-blue-500 px-1 py-1 uppercase mr-2">
                                Word Document
                            </span>
                        )}
                        {file.name.endsWith('.pdf') && (
                            <span className="text-white text-[10px] bg-red-500 px-1 py-1 uppercase mr-2">
                                PDF File
                            </span>
                        )}
                        {file.name.endsWith('.txt') && (
                            <span className="text-white text-[10px] bg-gray-500 px-1 py-1 uppercase mr-2">
                                Text File
                            </span>
                        )}
                        {file.name}
                        <div
                            className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 cursor-pointer"
                            onClick={() => setFile(null)}
                        >
                            <IoMdCloseCircle className="text-red-600" size={16} />
                        </div>
                    </div>
                )}

                <div className="relative w-full">
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <input
                        type="text"
                        className="h-[52px] w-full rounded-md border-none shadow-md focus:ring-0 placeholder-gray-400 placeholder:font-normal text-gray-600 font-normal pl-12 pr-4"
                        placeholder="Enter your problem statement"
                        value={textStatement}
                        onChange={(e) => setTextStatement(e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer z-10" onClick={handleIconClick}>
                        <IoAttachOutline size={23} className="text-gray-400" />
                    </div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => handleUploadAndGenerate()}>
                       {
                            !isProblemStatementLoading ? (
                            <IoSend size={23} className="text-gray-400" />
                        )
                            :
                            (
                                <AiOutlineLoading3Quarters size={23} className="text-blue-400 animate-spin" />
                            )
                       } 
                        
                    </div>
                </div>

                {
                    isProblemStatementLoading && 
                    (
                    <div className="flex text-gray-500 mt-4 font-normal">
                      Generating Problem Statement ...
                    </div>
                    )
                }

                <ProblemStatement
                    problemStatement={problemStatement}
                    setProblemStatement={setProblemStatement}
                    handleProceed={handleProceed}
                    handleSkipQuestions={handleSkipQuestions}
                    isChoosenOption={isChoosenOption}
                />

                {
                   isAskingQuestions &&(
                        <Questionnaire
                            questions={questions}
                            answers={answers}
                            handleAnswerSubmit={handleAnswerSubmit}
                            setAnswers={setAnswers}
                        />
                   )
                }

                {
                    isDocumentLoading && (
                        <div className="flex text-gray-500 mt-4 font-normal">
                            Generating the Problem Definition Document ...
                        </div>
                    )
                }

                {docxFileUrl && (
                    <div className="flex mt-4">
                        <a
                            href={docxFileUrl}
                            download="Generated_Document.docx"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                        >
                            Download as DOCX
                        </a>
                    </div>
                )}
                
            </div>
        </>
    );
};

export default Page;
