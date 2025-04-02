import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setProjectID,
  fetchProjectDetails,
  createOrUpdateProject,
  clearProjectState,
} from "../../redux/features/coinnovation/projectSlice";
import {
  fetchProjectFiles,
  uploadProjectFiles,
} from "../../redux/features/coinnovation/fileSlice";
import { toast } from "react-toastify";

import ProblemInput from "./ProblemInput";
import ProjectDetails from "./ProjectDetails";

const OneTabStepOne: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projectID, projectDetails, problemStatement } = useAppSelector(
    (state) => state.projects
  );
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const storedProjectID = localStorage.getItem("projectID");
    if (!storedProjectID) dispatch(clearProjectState());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!problemStatement?.trim() && files.length === 0) {
      return toast.info(
        "Please enter a problem statement or upload at least one file."
      );
    }

    try {
      const uploadResult = await dispatch(
        uploadProjectFiles({ files, projectID, problemStatement })
      ).unwrap();

      const project_description =
        uploadResult.problem_statement || problemStatement;

      if (
        project_description === "I could not find any problem to be solved."
      ) {
        return toast.warn(
          "The system could not identify a valid problem statement."
        );
      }

      const payload = {
        ...projectDetails,
        project_description,
        problem_statement: problemStatement,
        enterprise_img: "",
      };

      const result = await dispatch(
        createOrUpdateProject({ projectID, projectData: payload })
      ).unwrap();

      if (!projectID && result.project_id) {
        dispatch(setProjectID(result.project_id));
        localStorage.setItem("projectID", result.project_id);
      }

      toast.success("Project saved successfully!");
      setFiles([]);
    } catch (error) {
      toast.error("Error: Failed to analyze the problem statement.");
    }
  };

  return (
    <div className="bg-[#F4FCFF] w-full shadow-md rounded-lg flex flex-col justify-center items-center px-5 min-h-[70vh]">
      {!projectID ? (
        <div className="flex flex-col justify-center items-center gap-10 w-full">
          <div className="text-center">
            <p className="text-base font-semibold">Let us define the</p>
            <p className="text-2xl font-semibold">Problem Statement</p>
          </div>
          <div className="w-full">
            <ProblemInput
              handleSubmit={handleSubmit}
              files={files}
              setFiles={setFiles}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-12 mt-16 w-full">
          <ProblemInput
            handleSubmit={handleSubmit}
            files={files}
            setFiles={setFiles}
          />
          <ProjectDetails />
        </div>
      )}
    </div>
  );
};

export default OneTabStepOne;
