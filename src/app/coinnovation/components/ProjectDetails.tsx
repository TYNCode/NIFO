import React, { useEffect, useState } from "react";

import { CiPlay1 } from "react-icons/ci";
import { BiSave } from "react-icons/bi";
import axios from "axios";
import ProjectEntryTabOne from "./ProjectCreation/ProjectEntryTabOne";
import EnterpriseEntryTabOne from "./ProjectCreation/EnterpriseEntryTabOne";
import ProjectDescriptionTabOne from "./ProjectCreation/ProjectDescriptionTabOne";

export interface ProjectData {
  project_id: string;
  project_name: string;
  priority: string;
  status: string;
  start_date: string;
  end_date: string;
  group_company?: string; 
  enterprise: string;
  owner: string;
  approver: string;
  category: string;
  department: string;
  business_unit: string;
  location: string;
  project_description: string;
  problem_statement: string;
  context: string;
}

interface ProjectDetailsProps {
  projectID: string;
  projectDescription: string;
  problemStatement: string;
  setQuestionnaireData: any;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  projectID,
  projectDescription,
  problemStatement,
  setQuestionnaireData
}) => {
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
      "Excessive energy consumption in aluminum smelting is causing overheating and reduced efficiency.",
    context: "Full extracted text from document analysis.",
  });

  const [isOpenPriority, setIsOpenPriority] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");


  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectID) return;

      setFetchLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/coinnovation/create-project/?project_id=${projectID}`
        );

        if (response.data) {
          const formattedData = {
            ...response.data,
            start_date: response.data.start_date
              ? response.data.start_date.split("T")[0]
              : "",
            end_date: response.data.end_date
              ? response.data.end_date.split("T")[0]
              : "",
          };

          setProjectData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setProjectData((prevData) => ({
          ...prevData,
          project_id: projectID,
          project_description: projectDescription,
        }));
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProjectData();
  }, [projectID]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSelectPriority = (option: string) => {
    setProjectData({ ...projectData, priority: option });
    setIsOpenPriority(false);
  };

  const handleSelectStatus = (option: string) => {
    setProjectData({ ...projectData, status: option });
    setIsOpenStatus(false);
  };

  const handleDropdownChange = (field: string, value: string) => {
    setProjectData((prevData) => ({
        ...prevData,
        [field]: value
    }));
};


  const questionairreBody = {
    "project_id": projectID,
    "problem_statement": problemStatement,
    "context": projectDescription,
  }

  const handleSaveandContinue = async () => {
    setLoading(true);
    setResponseMessage("");

    const formattedProjectData = {
      ...projectData,
      start_date: projectData.start_date
        ? new Date(projectData.start_date).toISOString().split("T")[0]
        : "",
      end_date: projectData.end_date
        ? new Date(projectData.end_date).toISOString().split("T")[0]
        : "",
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/coinnovation/create-project/`,
        formattedProjectData,
        { headers: { "Content-Type": "application/json" } }
      );

      setResponseMessage("Project updated successfully");
      const responseofquestionairre = await axios.post(
        `http://127.0.0.1:8000/coinnovation/generate-questions/`,
        questionairreBody 
      );
      setQuestionnaireData(responseofquestionairre.data.data)
    } catch (error) {
      setResponseMessage("Failed to update project. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#F4FCFF] max-w-[80vw] w-full">
        {fetchLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-[#4A4D4E]">Loading project details...</div>
          </div>
        ) : (
          <div>
            <div className="flex flex-row gap-6 max-w-[80vw] w-full justify-center">
              <ProjectEntryTabOne 
                projectData={projectData}
                handleInputChange={handleInputChange}
                isOpenPriority={isOpenPriority}
                setIsOpenPriority={setIsOpenPriority}
                isOpenStatus={isOpenStatus}
                setIsOpenStatus={setIsOpenStatus}
                handleSelectPriority={handleSelectPriority}
                handleSelectStatus={handleSelectStatus}
              />

              <div className="border-[1px] border-[#C3E3FF] flex items-center justify-center"></div>

              <EnterpriseEntryTabOne 
                projectData={projectData}
                handleInputChange={handleInputChange}
                handleDropdownChange={handleDropdownChange}
              />

              <div className="border-[1px] border-[#C3E3FF] flex items-center justify-center"></div>

              <ProjectDescriptionTabOne 
                projectData={projectData}
                handleInputChange={handleInputChange}
              />
            </div>

            <div className="flex flex-row gap-4 justify-end items-end my-5">
              {responseMessage && (
                <div
                  className={`px-4 py-2 rounded ${responseMessage.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {responseMessage}
                </div>
              )}
              <div
                className="flex flex-row justify-center items-center text-white text-normal gap-1.5 bg-[#0070C0] px-4 rounded-[12px] text-sm py-2 cursor-pointer"
                onClick={handleSaveandContinue}
              >
                <div>
                  <BiSave />
                </div>
                <div className="font-semibold">
                  {loading ? "Saving & Generating Questionairre..." : "Save & Continue"}
                </div>
              </div>
              <div className="flex flex-row justify-center items-center text-white text-normal gap-1.5 bg-[#0070C0] px-4 rounded-[12px] text-sm py-2 cursor-pointer">
                <div>
                  <CiPlay1 />
                </div>
                <div className="font-semibold">Skip</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetails;