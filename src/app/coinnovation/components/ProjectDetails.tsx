import React, { useEffect, useState } from "react";
import { BiSave } from "react-icons/bi";
import { RiRefreshLine } from "react-icons/ri";
import { toast } from "react-toastify";

import ProjectEntryTabOne from "./ProjectCreation/ProjectEntryTabOne";
import EnterpriseEntryTabOne from "./ProjectCreation/EnterpriseEntryTabOne";
import ProjectDescriptionTabOne from "./ProjectCreation/ProjectDescriptionTabOne";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchProjectDetails,
  createOrUpdateProject,
  updateProjectField,
} from "../../redux/features/coinnovation/projectSlice";
import {
  generateQuestions,
  setQuestionnaireData,
  setActiveDefineStepTab,
} from "../../redux/features/coinnovation/challengeSlice";

const ProjectDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    projectDetails,
    projectID,
    fetching,
    saving,
    error: projectError,
  } = useAppSelector((state) => state.projects);
  const { loading: generationLoading, error: generationError } = useAppSelector(
    (state) => state.challenge
  );

  const [isOpenPriority, setIsOpenPriority] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (projectID && !projectDetails) {
      dispatch(fetchProjectDetails(projectID));
    }
  }, [projectID]);

  useEffect(() => {
    if (projectError) toast.error(projectError);
    if (generationError) toast.error(generationError);
  }, [projectError, generationError]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(updateProjectField({ key: name, value }));

    if (name === "end_date" && value && projectDetails?.start_date) {
      setDateError(
        value <= projectDetails.start_date
          ? "Target Closure date should be after Start Date."
          : null
      );
    } else if (name === "start_date" && value && projectDetails?.end_date) {
      setDateError(
        projectDetails.end_date <= value
          ? "Start Date should be before Target Closure."
          : null
      );
    } else {
      setDateError(null);
    }
  };

  const handleSelect = (key: string, value: string) => {
    dispatch(updateProjectField({ key, value }));
    if (key === "priority") setIsOpenPriority(false);
    if (key === "status") setIsOpenStatus(false);
  };

  const isFormValid = () => {
    if (!projectDetails) return false;
    const { project_id, project_name, priority, status, start_date, end_date } =
      projectDetails;
    return (
      project_id &&
      project_name &&
      priority &&
      status &&
      start_date &&
      end_date &&
      end_date > start_date
    );
  };

  const handleSaveAndContinue = async () => {
    if (!projectDetails || !projectID) return;

    const formatted = {
      ...projectDetails,
      start_date: projectDetails.start_date?.split("T")[0],
      end_date: projectDetails.end_date?.split("T")[0],
    };

    await dispatch(
      createOrUpdateProject({ projectID, projectData: formatted , mode: "save" })
    );

    const response = await dispatch(
      generateQuestions({
        projectID,
        problemStatement: projectDetails.problem_statement || "",
        context:
          projectDetails.project_description || projectDetails.context || "",
      })
    );

    if (generateQuestions.fulfilled.match(response)) {
      dispatch(setQuestionnaireData(response.payload));
      dispatch(setActiveDefineStepTab("01.b"));
      toast.success("Questionnaire generated successfully!");
    } else {
      toast.error("Failed to generate questionnaire.");
    }
  };

  if (!projectDetails) return null;

  return (
    <div className="bg-[#F4FCFF] max-w-[80vw] w-full">
      {fetching ? (
        <div className="flex justify-center items-center py-8 text-[#4A4D4E]">
          Loading project details...
        </div>
      ) : (
        <>
          <div className="flex gap-6 justify-center">
            <ProjectEntryTabOne
              projectData={projectDetails}
              handleInputChange={handleInputChange}
              isOpenPriority={isOpenPriority}
              setIsOpenPriority={setIsOpenPriority}
              isOpenStatus={isOpenStatus}
              setIsOpenStatus={setIsOpenStatus}
              handleSelectPriority={(val) => handleSelect("priority", val)}
              handleSelectStatus={(val) => handleSelect("status", val)}
            />
            <div className="border-[1px] border-[#C3E3FF]" />
            <EnterpriseEntryTabOne
              projectData={projectDetails}
              handleInputChange={handleInputChange}
              handleDropdownChange={(key, value) => handleSelect(key, value)}
            />
            <div className="border-[1px] border-[#C3E3FF]" />
            <ProjectDescriptionTabOne
              projectData={projectDetails}
              handleInputChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end gap-4 mt-5">
            <div className="flex items-center gap-2 bg-gray-300 text-white px-4 py-2 rounded-[12px] text-sm cursor-not-allowed">
              <RiRefreshLine />
              <span>Regenerate</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-sm text-white font-semibold ${
                isFormValid()
                  ? "bg-[#0070C0] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={isFormValid() ? handleSaveAndContinue : undefined}
            >
              <BiSave />
              <span>
                {saving || generationLoading ? "Saving..." : "Save & Continue"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
