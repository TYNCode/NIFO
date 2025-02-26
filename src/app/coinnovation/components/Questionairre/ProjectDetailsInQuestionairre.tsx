import React, { useEffect, useState } from "react";
import axios from "axios";

import ProjectEntry from "./ProjectEntry";
import EnterpriseDetails from "./EnterpriseDetails";
import ProjectDescription from "./ProjectDescription";

interface ProjectDetailsInQuestionairreProps {
  projectID: string;
  projectDescription: string;
}

const ProjectDetailsInQuestionairre: React.FC<
  ProjectDetailsInQuestionairreProps
> = ({ projectID, projectDescription }) => {
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

  useEffect(() => {
    setProjectData((prevData) => ({
      ...prevData,
      project_id: projectID,
      project_description: projectDescription,
    }));
  }, [projectID, projectDescription]);

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSelectPriority = (option: string) => {
    setProjectData({ ...projectData, priority: option });
  };

  const handleSelectStatus = (option: string) => {
    setProjectData({ ...projectData, status: option });
  };

  const handleSubmit = async () => {
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
        "http://127.0.0.1:8000/coinnovation/create-project/",
        formattedProjectData,
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      setResponseMessage("Failed to create project. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-16 bg-[#F4FCFF]">
      <div className="flex flex-col gap-6 justify-center">
        <ProjectEntry
          projectData={{
            project_id: projectData.project_id,
            project_name: projectData.project_name,
            priority: projectData.priority,
            status: projectData.status,
            start_date: projectData.start_date,
            end_date: projectData.end_date,
          }}
          onInputChange={handleInputChange}
          onSelectPriority={handleSelectPriority}
          onSelectStatus={handleSelectStatus}
        />

        <EnterpriseDetails
          projectData={{
            enterprise: projectData.enterprise,
            owner: projectData.owner,
            approver: projectData.approver,
            category: projectData.category,
            department: projectData.department,
            business_unit: projectData.business_unit,
            location: projectData.location,
          }}
          onInputChange={handleInputChange}
        />

        <ProjectDescription
          projectDescription={projectData.project_description}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default ProjectDetailsInQuestionairre;
