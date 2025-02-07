import React, { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { LiaDownloadSolid } from "react-icons/lia";
import * as XLSX from "xlsx";

const Questionarrie = ({ answers, questions, handleAnswerSubmit , setAnswers }) => {
    const [isQuestionnaireVisible, setIsQuestionnaireVisible] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});

    const handleToggleQuestionnaire = () => {
        setIsQuestionnaireVisible(!isQuestionnaireVisible);
    };

    const handleDownloadQuestionnaire = () => {
        if (questions.length === 0) {
            alert("No questions available to download.");
            return;
        }
        const header = [["SI No", "Questions", "User Answers"]];
        const questionData = questions.map((question, index) => [
            index + 1,
            question,
            answers[question] || ""
        ]);

        const finalData = [...header, ...questionData];
        const ws = XLSX.utils.aoa_to_sheet(finalData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Questions");
        XLSX.writeFile(wb, "Generated_Questionnaire.xlsx");
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex === questions.length - 1) {
            handleAnswerSubmit();
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };


    const handleInputChange = (e) => {
        const currentQuestion = questions[currentIndex];
        const newValue = e.target.value;

        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [currentQuestion]: newValue, 
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
                        <div key={currentIndex} className="text-lg font-medium">
                            {questions[currentIndex]}
                        </div>
                        <div>
                            <textarea
                                className="w-full border border-gray-300 focus:ring-2 px-2 py-1 rounded-md focus:ring-gray-500"
                                value={answers[questions[currentIndex]] ?? ""} 
                                onChange={handleInputChange}
                                autoFocus
                            />
                        </div>

                        <div className='flex flex-row gap-10 items-center mt-2 justify-end px-5'>
                            <button
                                className={`px-6 py-2 text-sm rounded-sm ${currentIndex === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-300"
                                    }`}
                                onClick={handleBack}
                                disabled={currentIndex === 0}
                            >
                                Back
                            </button>
                            <button
                                className={`px-6 py-2 text-sm rounded-sm text-white ${currentIndex === questions.length - 1 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-400"
                                    }`}
                                onClick={handleNext}
                            >
                               {currentIndex === questions.length -1 ? "Submit" : "Next"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Questionarrie;
