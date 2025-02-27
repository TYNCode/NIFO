import React, { useEffect, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { CiPlay1 } from "react-icons/ci";
import { BiSave } from "react-icons/bi";
import axios from "axios";

interface ProjectDetailsProps {
  projectID: string;
  projectDescription: string;
  problemStatement: string;
  setQuestionnaireData:any;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  projectID,
  projectDescription,
  problemStatement,
  setQuestionnaireData
}) => {
  const [projectData, setProjectData] = useState({
    project_id: projectID,
    project_name: "",
    priority: "",
    status: "",
    start_date: "",
    end_date: "",
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

  console.log("projectId",projectID)
  console.log("projectDescription", projectData)
  const optionsPriority = ["Critical", "High", "Medium", "Low"];
  const optionsStatus = [
    "To Do",
    "In Progress",
    "In Review",
    "Done",
    "Blocked",
    "Waiting for Approval",
    "Cancelled",
  ];

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
      <div className="bg-[#F4FCFF]">
        {fetchLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-[#4A4D4E]">Loading project details...</div>
          </div>
        ) : (
          <div>
            <div className="flex flex-row gap-6 justify-center">
              <div className="flex flex-col gap-4">
                <div className="text-[#4A4D4E] text-lg font-semibold">
                  Project Entry Details
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-[#4A4D4E]">Project ID</label>
                  <input
                    type="text"
                    className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full"
                    name="project_id"
                    value={projectData.project_id}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-[#4A4D4E]">Project Name</label>
                  <input
                    type="text"
                    className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full"
                    name="project_name"
                    value={projectData.project_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="relative">
                  <label className="text-sm text-[#4A4D4E]">Priority</label>
                  <div
                    className="flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[28px] px-3 cursor-pointer bg-white w-full"
                    onClick={() => setIsOpenPriority(!isOpenPriority)}
                  >
                    <span className="text-[#4A4D4E] text-sm">
                      {projectData.priority || "Select an option"}
                    </span>
                    <IoChevronDownOutline
                      className={`transition-transform text-sm font-light text-[#979797] ${isOpenPriority ? "rotate-180" : ""}`}
                    />
                  </div>

                  {isOpenPriority && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                      {optionsPriority.map((option, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-[#56A8F0] hover:text-white cursor-pointer transition text-sm text-[#4A4D4E]"
                          onClick={() => handleSelectPriority(option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="text-sm text-[#4A4D4E]">Status</label>
                  <div
                    className="flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[32px] px-3 cursor-pointer bg-white w-full text-sm"
                    onClick={() => setIsOpenStatus(!isOpenStatus)}
                  >
                    <span className="text-[#4A4D4E]">
                      {projectData.status || "Select an option"}
                    </span>
                    <IoChevronDownOutline
                      className={`transition-transform text-sm font-light text-[#979797] ${isOpenStatus ? "rotate-180" : ""}`}
                    />
                  </div>

                  {isOpenStatus && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                      {optionsStatus.map((option, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-[#56A8F0] hover:text-white cursor-pointer transition text-sm text-[#4A4D4E]"
                          onClick={() => handleSelectStatus(option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-[#4A4D4E]">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      value={projectData.start_date}
                      onChange={handleInputChange}
                      className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-[#4A4D4E]">
                      Target Closure
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={projectData.end_date}
                      onChange={handleInputChange}
                      className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="border-[1px] border-[#C3E3FF] flex items-center justify-center"></div>

              <div className="flex flex-col gap-4">
                <div className="text-lg font-semibold text-[#4A4D4E]">
                  Enterprise Details
                </div>

                {["enterprise", "owner", "approver"].map((field, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="text-sm text-[#4A4D4E]">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={projectData[
                        field as keyof typeof projectData
                      ]?.toString()}
                      onChange={handleInputChange}
                      className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  {["category", "department", "business_unit", "location"].map(
                    (field, index) => (
                      <div key={index} className="flex flex-col">
                        <label className="text-sm text-[#4A4D4E]">
                          {field.replace("_", " ").charAt(0).toUpperCase() +
                            field.replace("_", " ").slice(1)}
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={projectData[
                            field as keyof typeof projectData
                          ]?.toString()}
                          onChange={handleInputChange}
                          className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="border-[1px] border-[#C3E3FF] flex items-center justify-center"></div>

              <div className="flex flex-col">
                <div className="text-lg font-semibold text-[#4A4D4E]">
                  Project Description
                </div>
                <textarea
                  name="project_description"
                  value={projectData.project_description}
                  onChange={handleInputChange}
                  rows={3}
                  className="rounded-md focus:ring-0 border-[#56A8F0] border-[1px] w-full px-2 resize-none 
                   text-[#4A4D4E] text-sm font-normal mt-2"
                />
              </div>
            </div>

            <div className="flex flex-row gap-4 justify-end items-end mt-4">
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
                  {loading ? "Saving..." : "Save & Continue"}
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
