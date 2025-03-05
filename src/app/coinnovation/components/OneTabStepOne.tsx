import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProblemInput from "./ProblemInput";
import ProjectDetails from "./ProjectDetails";

interface OneTabStepOneProps {
  problemStatement: string;
  setProblemStatement: React.Dispatch<React.SetStateAction<string>>;
  responseData: string | null;
  setResponseData: React.Dispatch<React.SetStateAction<string | null>>;
  projectID: string | null;
  setProjectID: React.Dispatch<React.SetStateAction<string | null>>;
  setQuestionnaireData: any;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const OneTabStepOne: React.FC<OneTabStepOneProps> = ({
  problemStatement,
  setProblemStatement,
  responseData,
  setResponseData,
  projectID,
  setProjectID,
  setQuestionnaireData,
  setActiveTab
}) => {
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineHeight = 24;
  const maxRows = 7;
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = lineHeight * maxRows;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [problemStatement]);



  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Current value:', e.target.value);
    setProblemStatement(e.target.value);
  };


  const handleSubmit = async () => {
    if (!problemStatement.trim() && files.length === 0) {
      alert("Please enter a problem statement or upload at least one file.");
      return;
    }

    try {
      setLoading(true);
      setResponseData(null);

      const formData = new FormData();
      if (problemStatement.trim()) {
        formData.append("text", problemStatement);
      }
      files.forEach((file) => formData.append("file", file));

      const uploadResponse = await axios.post(
        "http://127.0.0.1:8000/coinnovation/upload-file/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const problemStatementResponse = uploadResponse.data.problem_statement || "No response from API";
      setResponseData(problemStatementResponse);

      // Check for the unwanted response
      if (problemStatementResponse.trim() === "I could not find any problem to be solved.") {
        alert("The system could not identify a valid problem statement. Please provide a clearer description.");
        return; // 🔥 Stop further processing (skip project creation)
      }

      // If valid response, proceed to project creation
      const createProjectResponse = await axios.post(
        "http://127.0.0.1:8000/coinnovation/create-project/",
        { project_description: problemStatementResponse },
        { headers: { "Content-Type": "application/json" } }
      );

      const projectResponse = createProjectResponse.data || "No response from API";
      setProjectID(projectResponse.project_id);

    } catch (error) {
      console.error("Error in API call:", error);
      setResponseData("Failed to process the request.");
      alert("Error: Failed to analyze the problem statement.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-[#F4FCFF] w-full shadow-md rounded-lg flex flex-col justify-center items-center px-5 min-h-[70vh]">
      {!projectID ? (
        <div className="flex flex-col justify-center items-center gap-10 w-full">
          <div className="flex flex-col gap-1 justify-center items-center">
            <div className="text-base font-semibold">Let us define the</div>
            <div className="text-2xl font-semibold">Problem Statement</div>
          </div>
          
          <div className="w-full">
            <ProblemInput
              textareaRef={textareaRef}
              problemStatement={problemStatement}
              handleChange={handleChange}
              lineHeight={lineHeight}
              maxRows={maxRows}
              handleSubmit={handleSubmit}
              loading={loading}
              files={files}
              setFiles={setFiles}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-12 mt-16 w-full">
           <ProblemInput
            textareaRef={textareaRef}
            problemStatement={problemStatement}
            handleChange={handleChange}
            lineHeight={lineHeight}
            maxRows={maxRows}
            handleSubmit={handleSubmit}
            loading={loading}
            files={files}
            setFiles={setFiles}
          />
          <ProjectDetails
            projectID={projectID}
            setQuestionnaireData={setQuestionnaireData}
            projectDescription={responseData || ""}
            problemStatement={problemStatement}
            setActiveTab={setActiveTab}
          />
        </div>
      )}
      
    </div>
  );
};

export default OneTabStepOne;
