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

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Fetch project details only
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectID) return;
      
      setFetchLoading(true);
      setFetchError("");
      
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/coinnovation/create-project/?project_id=${projectID}`
        );
        
        if (response.data) {
          // Format dates from API if needed
          const formattedData = {
            ...response.data,
            start_date: response.data.start_date ? response.data.start_date.split('T')[0] : "",
            end_date: response.data.end_date ? response.data.end_date.split('T')[0] : "",
            // Include project description from props if not in API response
            project_description: response.data.project_description || projectDescription,
          };
          
          setProjectData(formattedData);
        } else {
          // If no data, use props as fallback
          setProjectData(prevData => ({
            ...prevData,
            project_id: projectID,
            project_description: projectDescription,
          }));
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setFetchError("Failed to load project details. Using initial data instead.");
        
        // If fetch fails, initialize with props
        setProjectData(prevData => ({
          ...prevData,
          project_id: projectID,
          project_description: projectDescription
        }));
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProjectData();
  }, [projectID, projectDescription]);

  // These handlers won't update the backend, just the local state for view consistency
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Not used in read-only mode, but kept to satisfy component props
  };

  const handleSelectPriority = (option: string) => {
    // Not used in read-only mode, but kept to satisfy component props
  };

  const handleSelectStatus = (option: string) => {
    // Not used in read-only mode, but kept to satisfy component props
  };

  return (
    <div className="px-8 bg-[#F4FCFF]">
      {fetchLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-[#4A4D4E]">Loading project details...</div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 justify-center">
          {fetchError && (
            <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded mb-4">
              {fetchError}
            </div>
          )}
          
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
            readOnly={true}
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
            readOnly={true}
          />

          <ProjectDescription
            projectDescription={projectData.project_description}
            onInputChange={handleInputChange}
            readOnly={true}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsInQuestionairre;