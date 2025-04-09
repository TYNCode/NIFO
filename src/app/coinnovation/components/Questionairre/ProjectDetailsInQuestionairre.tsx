import React, { useEffect } from "react";

import ProjectEntry from "./ProjectEntry";
import EnterpriseDetails from "./EnterpriseDetails";
import ProjectDescription from "./ProjectDescription";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchProjectDetails } from "../../../redux/features/coinnovation/projectSlice";

const ProjectDetailsInQuestionairre: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    projectID,
    projectDetails,
    fetching: isLoading,
    error: fetchError,
  } = useAppSelector((state) => ({
    projectID: state.projects.projectID,
    projectDetails: state.projects.projectDetails,
    fetching: state.projects.fetching,
    error: state.projects.error,
  }));

  useEffect(() => {
    if (projectID && !projectDetails) {
      dispatch(fetchProjectDetails(projectID));
    }
  }, [dispatch, projectID]);

  const handleInputChange = () => {};
  const handleSelectPriority = () => {};
  const handleSelectStatus = () => {};

  const formattedProject = {
    project_id: projectDetails?.project_id || projectID || "",
    project_name: projectDetails?.project_name || "",
    priority: projectDetails?.priority || "",
    status: projectDetails?.status || "",
    start_date: projectDetails?.start_date?.split("T")[0] || "",
    end_date: projectDetails?.end_date?.split("T")[0] || "",
    enterprise: projectDetails?.enterprise || "",
    owner: projectDetails?.owner || "",
    approver: projectDetails?.approver || "",
    category: projectDetails?.category || "",
    department: projectDetails?.department || "",
    business_unit: projectDetails?.business_unit || "",
    location: projectDetails?.location || "",
    project_description: projectDetails?.project_description || "",
  };

  return (
    <div className="px-8 bg-[#F4FCFF]">
      {isLoading ? (
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
              project_id: formattedProject.project_id,
              project_name: formattedProject.project_name,
              priority: formattedProject.priority,
              status: formattedProject.status,
              start_date: formattedProject.start_date,
              end_date: formattedProject.end_date,
            }}
            onInputChange={handleInputChange}
            onSelectPriority={handleSelectPriority}
            onSelectStatus={handleSelectStatus}
            readOnly={true}
          />

          <EnterpriseDetails
            projectData={{
              enterprise: formattedProject.enterprise,
              owner: formattedProject.owner,
              approver: formattedProject.approver,
              category: formattedProject.category,
              department: formattedProject.department,
              business_unit: formattedProject.business_unit,
              location: formattedProject.location,
            }}
            onInputChange={handleInputChange}
            readOnly={true}
          />

          <ProjectDescription
            projectDescription={formattedProject.project_description}
            onInputChange={handleInputChange}
            readOnly={true}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsInQuestionairre;
