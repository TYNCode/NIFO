import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import ProblemInput from "./ProblemInput";
import { ProjectDetails } from "./ProjectDetails";

interface OneTabStepOneProps {
    problemStatement: string;
    setProblemStatement: React.Dispatch<React.SetStateAction<string>>;
    responseData: string | null;
    setResponseData: React.Dispatch<React.SetStateAction<string | null>>;
    projectID: string | null;
    setProjectID: React.Dispatch<React.SetStateAction<string | null>>;
    setQuestionnaireData:any;
}

const OneTabStepOne: React.FC<OneTabStepOneProps> = ({
    problemStatement,
    setProblemStatement,
    responseData,
    setResponseData,
    projectID,
    setProjectID,
    setQuestionnaireData
}) => {
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const lineHeight = 24;
    const maxRows = 4;

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = lineHeight * maxRows;
            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    }, [problemStatement]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProblemStatement(e.target.value);
    };

    const handleSubmit = async () => {
        if (!problemStatement.trim()) {
            alert("Please enter a problem statement.");
            return;
        }

        try {
            setLoading(true); 
            setResponseData(null);

            const uploadResponse = await axios.post(
                "http://127.0.0.1:8000/coinnovation/upload-file/",
                { text: problemStatement },
                { headers: { "Content-Type": "application/json" } }
            );

            const problemStatementResponse = uploadResponse.data.problem_statement || "No response from API";
            setResponseData(problemStatementResponse);

            const createProjectResponse = await axios.post(
                "http://127.0.0.1:8000/coinnovation/create-project/",
                { project_description: problemStatementResponse },
                { headers: { "Content-Type": "application/json" } }
            );

            const projectResponse = createProjectResponse.data || "No response from API";
            setProjectID(projectResponse.project_id);
        } catch (error) {
            console.error("Error in API calls:", error);
            setResponseData("Failed to process the request.");
            alert("Failed to create project. Please try again.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="bg-[#F5FCFF] shadow-md rounded-lg flex flex-col justify-center items-center px-5 min-h-[70vh]">
            {!responseData ? (
                <div className="flex flex-col justify-center items-center gap-4 ">
                    <div className="flex flex-col gap-1 justify-center items-center ">
                        <div className="text-base font-semibold">Let us define the</div>
                        <div className="text-2xl font-semibold">Problem Statement</div>
                    </div>

                    <div className="mt-8">
                        <ProblemInput
                            textareaRef={textareaRef}
                            problemStatement={problemStatement}
                            handleChange={handleChange}
                            lineHeight={lineHeight}
                            maxRows={maxRows}
                            handleSubmit={handleSubmit}
                            loading={loading} 
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center gap-12 mt-16">
                    <ProblemInput
                        textareaRef={textareaRef}
                        problemStatement={problemStatement}
                        handleChange={handleChange}
                        lineHeight={lineHeight}
                        maxRows={maxRows}
                        handleSubmit={handleSubmit}
                        loading={loading} 
                    />

                    <ProjectDetails projectID={projectID} setQuestionnaireData={setQuestionnaireData} projectDescription={responseData}  problemStatement={problemStatement}/>
                </div>
            )}
        </div>
    );
};

export default OneTabStepOne;
