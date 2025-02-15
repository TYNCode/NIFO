import React, { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { LiaDownloadSolid } from "react-icons/lia";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Questionarrie = ({ answers, questions, handleAnswerSubmit, setAnswers }) => {
    const [isQuestionnaireVisible, setIsQuestionnaireVisible] = useState(true);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const categories = Object.keys(questions);
    const currentCategory = categories[currentCategoryIndex];
    const currentQuestions = questions[currentCategory] || [];

    const handleToggleQuestionnaire = () => {
        setIsQuestionnaireVisible(!isQuestionnaireVisible);
    };

    const handleDownloadQuestionnaire = async () => {
        if (Object.keys(questions).length === 0) {
            alert("No questions available to download.");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Questionnaire");

        const headerStyle = {
            font: { name: "Raleway", size: 10, bold: true },
            alignment: { horizontal: "center" as "center", vertical: "middle" as "middle" },
            fill: { type: "pattern" as "pattern", pattern: "solid" as "solid", fgColor: { argb: "D9EAD3" } } // Light Green
        };

        const normalStyle = {
            font: { name: "Raleway", size: 10 },
            alignment: { vertical: "middle" as "middle" },
        };

        // 🔹 Set Header Row
        worksheet.addRow(["SI No", "Questions", "Answers"]).eachCell((cell) => {
            cell.style = headerStyle;
        });

        let rowIndex = 2; // Start from the second row

        // 🔹 Loop through categories and add data
        Object.keys(questions).forEach((category) => {
            // Add Category Header (Merged across A-C)
            const categoryRow = worksheet.addRow([category, "", ""]);
            categoryRow.eachCell((cell) => {
                cell.style = headerStyle;
            });
            worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
            rowIndex++;

            // Add Questions
            questions[category].forEach((question, index) => {
                const questionRow = worksheet.addRow([
                    index + 1, // SI No
                    question,
                    answers[category]?.[question] || "" // Default to empty if no answer
                ]);
                questionRow.eachCell((cell) => {
                    cell.style = normalStyle;
                });
                rowIndex++;
            });
        });

        // 🔹 Auto-adjust column widths
        worksheet.columns = [
            { width: 10 }, // SI No
            { width: 80 }, // Questions
            { width: 60 }, // Answers
        ];

        // 🔹 Generate and Download the File
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "Styled_Questionnaire.xlsx");
    };



    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex(currentCategoryIndex - 1);
            setCurrentQuestionIndex(questions[categories[currentCategoryIndex - 1]].length - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (currentCategoryIndex < categories.length - 1) {
            setCurrentCategoryIndex(currentCategoryIndex + 1);
            setCurrentQuestionIndex(0);
        } else {
            handleAnswerSubmit();
        }
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [currentCategory]: {
                ...(prevAnswers[currentCategory] || {}),
                [currentQuestions[currentQuestionIndex]]: newValue,
            },
        }));
    };

    return (
        <div>
            <div className="flex flex-col mt-4">
                <div className="flex flex-row items-center justify-between gap-4 bg-neutral-100 shadow-md px-2 py-2 rounded-t-lg">
                    <div className="font-medium text-gray-500">
                        Questionnaire
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className='text-gray-700 cursor-pointer' onClick={handleDownloadQuestionnaire}>
                            <LiaDownloadSolid size={18} />
                        </div>
                        <div className="text-gray-500 cursor-pointer" onClick={handleToggleQuestionnaire}>
                            <FaChevronUp />
                        </div>
                    </div>
                </div>

                {isQuestionnaireVisible && (
                    <div className="bg-white shadow-md px-3 py-3">
 
                        <div className="text-lg font-semibold text-gray-700 mb-2">
                            {currentCategory}
                        </div>

                        <div key={currentQuestionIndex} className="text-lg font-medium">
                            {currentQuestions[currentQuestionIndex]}
                        </div>
                        <div>
                            <textarea
                                className="w-full border border-gray-300 focus:ring-2 px-2 py-1 rounded-md focus:ring-gray-500 mt-2"
                                value={answers[currentCategory]?.[currentQuestions[currentQuestionIndex]] ?? ""}
                                onChange={handleInputChange}
                                autoFocus
                            />
                        </div>

                        <div className='flex flex-row gap-10 items-center mt-4 justify-end px-5'>
                            <button
                                className={`px-6 py-2 text-sm rounded-sm ${currentCategoryIndex === 0 && currentQuestionIndex === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-300"
                                    }`}
                                onClick={handleBack}
                                disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
                            >
                                Back
                            </button>
                            <button
                                className={`px-6 py-2 text-sm rounded-sm text-white ${currentCategoryIndex === categories.length - 1 && currentQuestionIndex === currentQuestions.length - 1 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-400"
                                    }`}
                                onClick={handleNext}
                            >
                                {currentCategoryIndex === categories.length - 1 && currentQuestionIndex === currentQuestions.length - 1 ? "Submit" : "Next"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Questionarrie;
