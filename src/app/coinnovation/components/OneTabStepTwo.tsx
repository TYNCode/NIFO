import React from "react";
import { useAppSelector } from "../../redux/hooks";

import ProjectDetailsInQuestionairre from "./Questionairre/ProjectDetailsInQuestionairre";
import Questionairre from "./Questionairre/Questionairre";

const OneTabStepTwo: React.FC = () => {
  const projectID = useAppSelector((state) => state.projects.projectID);

  return (
    <div className="p-4 w-full flex min-h-screen bg-[#F4FCFF]">
      <div className="w-[30%]">
        {projectID ? (
          <ProjectDetailsInQuestionairre />
        ) : (
          <div className="text-gray-500 p-4">No project details available.</div>
        )}
      </div>

      <div className="border-l-[1px] border-[#42affc] h-auto"></div>

      <div className="w-[70%] mx-3">
        <Questionairre />
      </div>
    </div>
  );
};

export default OneTabStepTwo;
