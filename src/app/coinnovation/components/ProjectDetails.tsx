import React, { useEffect, useState } from "react";
import { BiSave } from "react-icons/bi";
import axios from "axios";
import ProjectEntryTabOne from "./ProjectCreation/ProjectEntryTabOne";
import EnterpriseEntryTabOne from "./ProjectCreation/EnterpriseEntryTabOne";
import ProjectDescriptionTabOne from "./ProjectCreation/ProjectDescriptionTabOne";
import { toast } from "react-toastify";
import { RiRefreshLine } from "react-icons/ri";

interface ProjectDetailsProps {
  projectID: string;
  projectDescription: string;
  projectData: any;
  setProjectData: any;
  problemStatement: string;
  setQuestionnaireData: any;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  projectID,
  projectData,
  setProjectData,
  projectDescription,
  problemStatement,
  setQuestionnaireData,
  setActiveTab,
}) => {
  console.log("projectDAta", projectData);
  console.log("projectDescriptioninprojectdetails", projectDescription);
  console.log("problemStatement", problemStatement);

  const [isOpenPriority, setIsOpenPriority] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  const isFormValid = () => {
    const { project_id, project_name, priority, status, start_date, end_date } =
      projectData;

    return (
      String(project_id || "").trim() !== "" &&
      String(project_name || "").trim() !== "" &&
      String(priority || "").trim() !== "" &&
      String(status || "").trim() !== "" &&
      String(start_date || "").trim() !== "" &&
      String(end_date || "").trim() !== "" &&
      end_date > start_date
    );
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectID) return;

      setFetchLoading(true);
      try {
        const response = await axios.get(
          `https://tyn-server.azurewebsites.net/coinnovation/create-project/?project_id=${projectID}`
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
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "end_date" && value && projectData.start_date) {
      if (value <= projectData.start_date) {
        setDateError(
          "Target Closure date should be after Start Date and not the same."
        );
      } else {
        setDateError(null);
      }
    } else if (name === "start_date" && value && projectData.end_date) {
      if (projectData.end_date <= value) {
        setDateError("Start Date should be before Target Closure.");
      } else {
        setDateError(null);
      }
    } else {
      setDateError(null);
    }
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
      [field]: value,
    }));
  };

  const questionairreBody = {
    project_id: projectID,
    problem_statement: problemStatement,
    context: projectDescription ? projectDescription : projectData?.context,
  };

  const handleSaveandContinue = async () => {
    setLoading(true);
    setResponseMessage("");

    try {
      const formData = new FormData();

      Object.keys(projectData).forEach((key) => {
        if (projectData[key] !== null && projectData[key] !== undefined) {
          formData.append(key, projectData[key]);
        }
      });

      if (projectData.start_date) {
        formData.append(
          "start_date",
          new Date(projectData.start_date).toISOString().split("T")[0]
        );
      }
      if (projectData.end_date) {
        formData.append(
          "end_date",
          new Date(projectData.end_date).toISOString().split("T")[0]
        );
      }

      const response = await axios.put(
        `https://tyn-server.azurewebsites.net/coinnovation/create-project/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Project updated successfully");

      const responseofquestionairre = await axios.post(
        `https://tyn-server.azurewebsites.net/coinnovation/generate-questions/`,
        questionairreBody,
        { headers: { "Content-Type": "application/json" } }
      );
      setQuestionnaireData(responseofquestionairre.data.data);
      setActiveTab("01.b");
    } catch (error) {
      toast.error("Failed to update project. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
  
  }

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
                className={`flex flex-row justify-center items-center text-white text-normal gap-1.5 px-4 rounded-[12px] text-sm py-2 cursor-pointer 
  ${isFormValid() ? "bg-[#0070C0] hover:bg-[#005A9C]" : "bg-gray-400 cursor-auto"}`}
              >
                <div>
                  <RiRefreshLine />
                </div>{" "}
                <div className="font-semibold" onClick={handleRegenerate}> Regenerate</div>
              </div>
              <div
                className={`flex flex-row justify-center items-center text-white text-normal gap-1.5 px-4 rounded-[12px] text-sm py-2 cursor-pointer 
  ${isFormValid() ? "bg-[#0070C0] hover:bg-[#005A9C]" : "bg-gray-400 cursor-auto"}`}
                onClick={isFormValid() ? handleSaveandContinue : undefined}
              >
                <div>
                  <BiSave />
                </div>
                <div className="font-semibold">
                  {loading
                    ? "Saving & Generating Questionairre..."
                    : "Save & Continue"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetails;
