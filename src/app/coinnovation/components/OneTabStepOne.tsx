import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CiPlay1 } from "react-icons/ci";
import ProjectDetails from "./ProjectDetails";

const OneTabStepOne = () => {
    const [problemStatement, setProblemStatement] = useState("");
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState<string | null>(null);
    const [projectID , setProjectID] = useState<string | null>(null);
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

        setLoading(true);
        setResponseData("");

        try {
            const uploadResponse = await axios.post(
                "http://127.0.0.1:8000/coinnovation/upload-file/",
                { text: problemStatement },
                { headers: { "Content-Type": "application/json" } }
            );

            const problemStatementResponse = uploadResponse.data.problem_statement || "No response from API";
            setResponseData(problemStatementResponse);

            const createProjectResponse = await axios.post(
                "http://127.0.0.1:8000/coinnovation/create-project/",
                {
                    project_description: problemStatementResponse,
                },
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
        <div className="">
            <div className="bg-[#F5FCFF] shadow-md rounded-lg flex flex-col justify-center items-center px-5">
                <div className="flex items-center flex-col gap-4 py-32">
                    <div className="flex flex-col justify-center items-center gap-1 ">
                        <div className="text-base">Let us define the</div>
                        <div className="text-xl font-medium">Problem Statement</div>
                    </div>

                    <div className="flex flex-row justify-center items-center gap-2">
                        <div className="w-full">
                            <textarea
                                ref={textareaRef}
                                className="w-[900px] border-none focus:ring-0 px-4 py-2 resize-none overflow-auto rounded-lg 
                                           placeholder-gray-400 placeholder-opacity-75 text-base leading-[1.5] align-middle"
                                value={problemStatement}
                                onChange={handleChange}
                                placeholder="Type your problem statement"
                                style={{
                                    minHeight: `${lineHeight}px`,
                                    maxHeight: `${lineHeight * maxRows}px`,
                                }}
                            />
                        </div>

                        <button
                            className="flex flex-row items-center gap-2 px-4 py-[7px] bg-blue-500 w-max rounded-lg text-white cursor-pointer"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            <div className="font-medium">
                                <CiPlay1 />
                            </div>
                            <div className="font-medium">
                                {loading ? "Processing..." : "Describe"}
                            </div>
                        </button>
                     
                    </div>
                </div>

                <div className="mt-16">
                    <ProjectDetails 
                    projectID = {projectID}
                    projectDescription={responseData}/>
                </div>

            </div>
        </div>
    );
};

export default OneTabStepOne;
