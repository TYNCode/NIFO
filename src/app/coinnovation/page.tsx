"use client";

import React, { useState } from "react";
import axios from "axios";
import NavbarTrend from "../components/TrendsWeb/NavbarTrend";
import { IoAttachOutline, IoSend } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import ProblemStatement from "./ProblemStatement";
import Questionnaire from "./Questionnaire";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";
import * as XLSX from "xlsx";

const Page = () => {
    const [file, setFile] = useState(null);
    const [questionnaireFile, setQuestionnaireFile] = useState(null)
    const [problemStatement, setProblemStatement] = useState("");
    const [isProblemStatementLoading, setIsProblemStatementLoading] = useState(false);
    const [isAskingQuestions, setIsAskingQuestions] = useState(false);
    const [skipQuestions, setSkipQuestions] = useState(false);
    const [questions, setQuestions] = useState({});
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isGeneratingJSON, setIsGeneratingJSON] = useState(false);
    const [context, setContext] = useState("");
    const [generatedJSON, setGeneratedJSON] = useState(null);
    const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
    const [docxFileUrl, setDocxFileUrl] = useState(null);
    const [textStatement, setTextStatement] = useState("");
    const [isChoosenOption, setIsChoosenOption] = useState(false);
    const [isDocumentLoading, setIsDocumentLoading] = useState(false);
    const [isQuestionnaireLoading, setIsQuestionnaireLoading] = useState(false);
    const [isQuestionnaireUploaded, setIsQuestionnaireUploaded] = useState(false);
    const [questionnaireAnswers, setQuestionnaireAnswers] = useState({})
    const API_BASE_URL = "https://tyn-server.azurewebsites.net/coinnovation";

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
            let extractedProblemStatement = "";
            let extractedContext = "";

            const formData = new FormData();
            if (file) formData.append("file", file);
            if (textStatement.trim()) formData.append("text", textStatement.trim());

            response = await axios.post(
                `${API_BASE_URL}/upload-file/`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            extractedProblemStatement = response.data.problem_statement;
            extractedContext = response.data.context;

            setProblemStatement(extractedProblemStatement);
            setContext(extractedContext);
        } catch (error) {
            console.error("Error processing the document:", error);
            alert("Failed to process the document.");
        } finally {
            setIsProblemStatementLoading(false);
        }
    };

    const questionnaireUploadAndGenerate = async () => {
        if (!file && !textStatement.trim()) {
            alert("Please enter a problem statement or upload a file.");
            return;
        }
        setIsProblemStatementLoading(true);
        try {
            let response;
            let extractedProblemStatement = "";
            let extractedContext = "";

            const formData = new FormData();
            if (file) formData.append("file", file);
            if (textStatement.trim()) formData.append("text", textStatement.trim());

            response = await axios.post(
                `${API_BASE_URL}/upload-file/`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            extractedProblemStatement = response.data.problem_statement;
            extractedContext = response.data.context;
            setProblemStatement(extractedProblemStatement);
            setContext(extractedContext);
            setIsProblemStatementLoading(false);
            setIsDocumentLoading(true);
            if (questionnaireFile) {
                const requestData = {
                    problem_statement: extractedProblemStatement,
                    context: extractedContext,
                    categories: questionnaireAnswers
                };
                response = await axios.post(
                    `${API_BASE_URL}/generate-challenge-document/`,
                    requestData,
                    { headers: { "Content-Type": "application/json" } }
                );
                setGeneratedJSON(response.data);
                await callGenerateDocxAPI(response.data);
            }
        } catch (error) {
            console.error("Error processing the document:", error);
            alert("Failed to process the document.");
        } finally {
            setIsProblemStatementLoading(false);
        }
    };

    const handleProceed = async () => {
        setIsQuestionnaireLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/generate-questions/`,
                { problem_statement: problemStatement, context: context },
                { headers: { "Content-Type": "application/json" } }
            );

            const apiResponse = response.data.categories; 

            const structuredQuestions = Object.keys(apiResponse).reduce((acc, category) => {
                acc[category] = apiResponse[category].questions || [];
                return acc;
            }, {});

            const structuredAnswers = Object.keys(apiResponse).reduce((acc, category) => {
                acc[category] = apiResponse[category].questions.reduce((qAcc, question) => {
                    qAcc[question] = ""; 
                    return qAcc;
                }, {});
                return acc;
            }, {});

            setQuestions(structuredQuestions);
            setAnswers(structuredAnswers);
            setIsChoosenOption(true);
            setIsAskingQuestions(true);
            setIsQuestionnaireLoading(false);

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

        if (currentQuestionIndex < Object.keys(questions).length - 1) {
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

    const AddQuestionnaire = () => {
        const fileInput = document.getElementById("xlsx");
        if (fileInput) {
            fileInput.click();
        }
    }

    const handleQuestionnaireUpload = async (event) => {
        const selectedQuestionnaire = event.target.files[0];
        if (!selectedQuestionnaire) {
            alert("No file selected.");
            return;
        }

        try {
            const data = await selectedQuestionnaire.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            console.log("Raw JSON Data from Excel:", jsonData); 

            const expectedHeaders = ["SI No", "Questions", "Answers"];
            const fileHeaders = jsonData[0] || [];
            const isValidTemplate = expectedHeaders.every((header, index) => fileHeaders[index]?.trim() === header);

            if (!isValidTemplate) {
                alert("Invalid template file. Please upload a file with the correct format.");
                return;
            }

            let structuredData = { categories: {} };
            let currentCategory = null;

            jsonData.slice(1).forEach((row, index) => {
                const siNo = row[0] ? row[0].toString().trim() : "";
                const question = row[1] ? row[1].toString().trim() : "";
                const answer = row[2] ? row[2].toString().trim() : "";
                if (siNo !== "" && question === "" && answer === "") {
                    currentCategory = siNo;
                    structuredData.categories[currentCategory] = { questions: [], answers: [] };
                    console.log(`✅ Detected Category: ${currentCategory}`);
                }
                else if (currentCategory && question !== "") {
                    structuredData.categories[currentCategory].questions.push(question);
                    structuredData.categories[currentCategory].answers.push(answer);
                }
            });
            setQuestionnaireAnswers(structuredData);
            setQuestionnaireFile(selectedQuestionnaire);
            setIsQuestionnaireUploaded(true);
        } catch (error) {
            console.error("Error reading the file:", error);
            alert("An error occurred while processing the file. Please try again.");
        }
    };



    return (
        <>
            <NavbarTrend />
            <div className="px-[8%] py-16 relative">
                <div className="flex flex-row gap-4">
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
                    {questionnaireFile && (
                        <div className="text-sm mb-2 bg-gray-200 w-max px-4 py-2 text-gray-500 shadow-sm rounded-md relative">
                            <span className="text-white text-[10px] bg-green-500 px-1 py-1 uppercase mr-2">
                                Questionnaire File
                            </span>
                            {questionnaireFile.name}
                            <div
                                className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 cursor-pointer"
                                onClick={() => setQuestionnaireFile(null)}
                            >
                                <IoMdCloseCircle className="text-red-600" size={16} />
                            </div>
                        </div>
                    )}
                </div>


                <div className="shadow-md rounded-md overflow-hidden">
                    <div className="relative w-full flex items-center">
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <textarea
                            rows={4}
                            className="w-full shadow-none focus:ring-0 border-none placeholder-gray-500 text-gray-600 px-6 resize-none"
                            placeholder="Enter your problem statement"
                            value={textStatement}
                            onChange={(e) => setTextStatement(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-row justify-between bg-white pb-4 px-6">
                        <div className="flex items-center gap-2">
                            <div onClick={handleIconClick} className="flex items-center gap-1 text-[10px] border-2 border-gray-500 px-2 py-0.5 rounded-full cursor-pointer">
                                <IoAttachOutline size={12} className="text-gray-400" />
                                <span className="text-gray-400">Attach File</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] border-2 border-gray-500 px-2 py-0.5 rounded-full cursor-pointer" onClick={AddQuestionnaire}>
                                <MdAddCircleOutline size={12} className="text-gray-400" />
                                <span className="text-gray-400" >Questionnaire</span>
                            </div>
                            <input type="file"
                                id='xlsx'
                                accept=".xlsx"
                                className="hidden"
                                onChange={handleQuestionnaireUpload} />
                        </div>
                        <div
                            className="cursor-pointer"
                            onClick={() => questionnaireFile ? questionnaireUploadAndGenerate() : handleUploadAndGenerate()}
                        >
                            {!isProblemStatementLoading ? (
                                <IoSend size={23} className="text-gray-400" />
                            ) : (
                                <AiOutlineLoading3Quarters size={23} className="text-blue-400 animate-spin" />
                            )}
                        </div>

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
                    isQuestionnaireLoading={isQuestionnaireLoading}
                    questionnaireFile = {questionnaireFile}
                />

                {
                    isAskingQuestions && (
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
