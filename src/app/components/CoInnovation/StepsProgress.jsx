import React, { useState, useEffect } from "react";

const StepsProgress = () => {
    const steps = [
        { title: "Upload File", description: "Start by uploading your problem statement file." },
        { title: "Answer Questions", description: "Answer guided questions to refine the challenge." },
        { title: "Download DOCX", description: "Generate and download the structured challenge document." }
    ];

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prevStep) => (prevStep < steps.length - 1 ? prevStep + 1 : 0));
        }, 3000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full p-6  rounded-lg shadow-md">
            <div className="w-full max-w-lg">
                <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
                    {steps.map((step, index) => (
                        <div key={index} className={`text-center ${index <= currentStep ? "text-blue-600 font-bold" : "text-gray-400"}`}>
                            {step.title}
                        </div>
                    ))}
                </div>
                <div className="relative w-full h-2 bg-gray-300 rounded-full">
                    <div
                        className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="mt-6 text-lg font-semibold text-gray-800">{steps[currentStep].description}</div>

            <div className="mt-6 w-96 h-52 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">
                Step {currentStep + 1} Animation
            </div>
        </div>
    );
};

export default StepsProgress;
