import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProblemInput from "./ProblemInput";
import ProjectDetails, { ProjectData } from "./ProjectDetails";
import { toast } from "react-toastify";
import fs from "fs";

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

interface StoredFile {
  id: number;
  original_name: string;
  name: string;
  url: string;
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
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);

  const [projectData, setProjectData] = useState<ProjectData>({
    project_id: projectID,
    project_name: "",
    priority: "",
    status: "",
    start_date: "",
    end_date: "",
    group_company: "", 
    enterprise: "",
    owner: "",
    approver: "",
    category: "",
    department: "",
    business_unit: "",
    location: "",
    project_description: "",
    problem_statement:
      "",
    context: "",
    enterprise_img:"",
  });

  useEffect(()=>{
    fetchProjectData(projectID);
  },[projectID])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = lineHeight * maxRows;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [problemStatement]);

  const fetchProjectData = async (projectID) => {
    if (!projectID) return;
    try {
      const response = await axios.get(
        `https://tyn-server.azurewebsites.net/coinnovation/create-project/?project_id=${projectID}`
      );

      if (response.data) {
        const formattedData = {
          ...response.data,
          start_date: response.data.start_date?.split("T")[0] || "",
          end_date: response.data.end_date?.split("T")[0] || "",
        };

        setProjectData(formattedData);
        if (formattedData.files) {
          const formattedFiles = formattedData.files.map((file: any) => ({
            id: file.id,
            name: decodeURIComponent(file.file.split("/").pop()),
            url: `https://tyn-server.azurewebsites.net${file.file}`,
          }));

          setStoredFiles(formattedFiles);
        }
      }
    } catch (error) {
      console.error("Failed to fetch updated project data:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProblemStatement(e.target.value);
  };


  const handleSubmit = async () => {
    if (!problemStatement.trim() && files.length === 0) {
      toast.info("Please enter a problem statement or upload at least one file.");
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
        "https://tyn-server.azurewebsites.net/coinnovation/upload-file/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const problemStatementResponse = uploadResponse.data.problem_statement || "No response from API";
      setResponseData(problemStatementResponse);

      if (problemStatementResponse.trim() === "I could not find any problem to be solved.") {
        toast.warn("The system could not identify a valid problem statement. Please provide a clearer description.");
        return;
      }

      if (projectID) {
        const formData = new FormData();
        formData.append("project_id", projectID);
        formData.append("project_description", problemStatementResponse);
        formData.append("context", problemStatementResponse);
        formData.append("problem_statement", problemStatement);

        if (files && files.length > 0) {
          files.forEach((file) => {
            formData.append("file", file);
          });
        }

        await axios.put(
          "https://tyn-server.azurewebsites.net/coinnovation/create-project/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        await fetchProjectData(projectID); 
        toast.success("Project created successfully!");
      } else {

        const formData = new FormData();
        formData.append("project_description", problemStatementResponse);
        formData.append("context", problemStatementResponse);
        formData.append("problem_statement", problemStatement);

        if (files && files.length > 0) {
          files.forEach((file) => {
            formData.append("file", file);
          });
        }

        const createProjectResponse = await axios.post(
          "https://tyn-server.azurewebsites.net/coinnovation/create-project/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          }
        );


        const projectResponse = createProjectResponse.data || "No response from API";
        setProjectID(projectResponse.project_id);

        await fetchProjectData(projectResponse.project_id);  
        setFiles([]);
        toast.success("Project created successfully.");
      }

    } catch (error) {
      console.error("Error in API call:", error);
      setResponseData("Failed to process the request.");
      toast.error("Error: Failed to analyze the problem statement.");
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
              setProblemStatement={setProblemStatement}
              projectData={projectData}
              handleChange={handleChange}
              lineHeight={lineHeight}
              maxRows={maxRows}
              handleSubmit={handleSubmit}
              loading={loading}
              files={files}
              setFiles={setFiles}
              storedFiles={storedFiles}
              setStoredFiles={setStoredFiles}
              projectID={projectID}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-12 mt-16 w-full">
           <ProblemInput
            textareaRef={textareaRef}
            problemStatement={problemStatement}
            setProblemStatement={setProblemStatement}
            handleChange={handleChange}
            lineHeight={lineHeight}
            maxRows={maxRows}
            projectData={projectData}
            handleSubmit={handleSubmit}
            loading={loading}
            files={files}
            setFiles={setFiles}
            storedFiles={storedFiles}
            setStoredFiles={setStoredFiles}
            projectID={projectID}
          />
          <ProjectDetails
            projectID={projectID}
            projectData={projectData}
            setProjectData={setProjectData}
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
