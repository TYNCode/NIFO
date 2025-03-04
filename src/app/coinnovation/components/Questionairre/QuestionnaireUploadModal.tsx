import React, { useState } from "react";
import * as XLSX from "xlsx";

interface QuestionnaireUploadModalProps {
    setIsQuestionnaireModalOpen: (isOpen: boolean) => void;
    isQuestionnaireModalOpen: boolean;
    questionnaireFile: File;
    setQuestionnaireFile: (file: File) => void;
}


const QuestionnaireUploadModal: React.FC<QuestionnaireUploadModalProps> = ({ setIsQuestionnaireModalOpen, isQuestionnaireModalOpen,setQuestionnaireFile }) => {
    const [tempFiles, setTempFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);

    if (!isQuestionnaireModalOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        const filteredFiles = selectedFiles.filter(file => file.name.endsWith(".xlsx") || file.name.endsWith(".csv"));

        if (filteredFiles.length === 0) {
            alert("Only .xlsx or .csv files are allowed.");
            return;
        }

        setTempFiles(filteredFiles);
        setUploadComplete(false);
    };

    const handleUploadClick = async() => {
        if (tempFiles.length === 0) {
            alert("Please select a valid .xlsx or .csv file first.");
            return;
        }

        setUploading(true);
        setUploadComplete(false);
        const fileToUpload = tempFiles[0];

        try{
            const data = await fileToUpload.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const expectedHeaders = ["SI No", "Questions", "Assumed Answers", "Actual Answers"];
            const fileHeaders = jsonData[0] || [];

            const isValidTemplate = expectedHeaders.every(
                (header, index) => fileHeaders[index]?.trim() === header
            );

            if (!isValidTemplate) {
                alert("Invalid template file. Please upload a file with headers: SI No, Questions, Assumed Answers, Actual Answers.");
                setUploading(false);
                return;
            }

            const structuredData: {
                categories: Record<string, { questions: string[]; assumedAnswers: string[]; actualAnswers: string[] }>;
            } = { categories: {} };

            let currentCategory: string | null = null;
            jsonData.slice(1).forEach((row: any[]) => {
                const siNo = row[0] ? row[0].toString().trim() : "";
                const question = row[1] ? row[1].toString().trim() : "";
                const assumedAnswer = row[2] ? row[2].toString().trim() : "";
                const actualAnswer = row[3] ? row[3].toString().trim() : "";

                if (siNo !== "" && question === "" && assumedAnswer === "" && actualAnswer === "") {
                    currentCategory = siNo;
                    structuredData.categories[currentCategory] = { questions: [], assumedAnswers: [], actualAnswers: [] };
                } else if (currentCategory && question !== "") {
                    structuredData.categories[currentCategory].questions.push(question);
                    structuredData.categories[currentCategory].assumedAnswers.push(assumedAnswer);
                    structuredData.categories[currentCategory].actualAnswers.push(actualAnswer);
                }
            });
            setQuestionnaireFile(fileToUpload);
            setTimeout(() => {
                setUploading(false);
                setUploadComplete(true);
                setTimeout(() => {
                    setTempFiles([]);
                    setIsQuestionnaireModalOpen(false);
                }, 1000);
            }, 2000); 
        } catch (error) {
            alert("An error occurred while processing the file. Please try again.");
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-[50vw] flex flex-col px-8 py-6">
                <button
                    onClick={() => setIsQuestionnaireModalOpen(false)}
                    className="text-[#2286C0] transition duration-200 flex justify-end"
                >
                    ✕
                </button>

                <div className="relative flex items-center justify-center text-base text-[#0070C0] font-semibold">
                    Upload Questionnaire
                    <div className="absolute -bottom-[2px] w-[150px] h-[2px] bg-[#0070C0]"></div>
                </div>

                <hr className={`border-[#E3F2FE] w-full mt-2 ${uploadComplete ? 'border-green-500' : ''}`} />

                <div
                    className="my-4 mx-auto border-2 border-dashed border-[#D8D8D8] rounded-lg py-6 px-4 flex flex-col w-[80%] cursor-pointer hover:bg-blue-50 transition duration-200"
                    onClick={() => document.getElementById("questionnaireFileInput")?.click()}
                >
                    {tempFiles.length > 0 ? (
                        tempFiles.map((file, index) => (
                            <div key={index} className="w-full flex flex-row items-center gap-4">
                                <img src="/coinnovation/excel-icon.svg" className="flex-shrink-0" alt="File Icon" />
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex flex-row justify-between items-center w-full">
                                        <div className="text-[12px] text-[#4A4D4E] truncate w-full">{file.name}</div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTempFiles([]);
                                            }}
                                            className="text-[#4A4D4E] text-sm font-semibold cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="w-full h-[5px] rounded-full bg-gray-200">
                                        <div className={`h-full rounded-full transition-all duration-500 ${uploadComplete ? 'bg-green-500 w-full' : 'bg-[#E4E5E7] w-0'}`}></div>
                                    </div>


                                    <div className="flex flex-row justify-between text-xs text-gray-600 w-full">
                                        <span>Document Selected. Click upload to proceed.</span>
                                        <span>{(file.size / 1024).toFixed(2)} KB</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div>
                                <img src="/coinnovation/uploadfileicon.svg" alt="File Upload Icon" />
                            </div>
                            <div className="text-[#979797] text-[13px]">Drag & Drop or Click to upload</div>
                            <div className="text-[#979797] text-[12px]">
                                Accepted file formats: XLSX, CSV
                            </div>
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    id="questionnaireFileInput"
                    className="hidden"
                    accept=".xlsx,.csv"
                    onChange={handleFileChange}
                />

                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleUploadClick}
                        className={`flex flex-row items-center justify-center gap-2 px-4 py-2 w-max text-[12px] text-white shadow-[6px_10px_20px_0px_rgba(7,7,7,0.1)] rounded-[12px] 
                        ${tempFiles.length > 0 && !uploading ? "bg-[#2286C0] cursor-pointer" : "bg-[#979797] cursor-default"}`}
                        disabled={tempFiles.length === 0 || uploading}
                    >
                        <img
                            src="/coinnovation/uploadfilewhite.svg"
                            alt="File Upload Icon"
                            className="h-4 w-4 object-contain"
                        />
                        <div className="flex items-center">
                            {uploading ? "Uploading..." : "Upload"}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionnaireUploadModal;
