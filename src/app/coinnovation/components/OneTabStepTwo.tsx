import React from "react";
import { useAppSelector } from "../../redux/hooks";

import ProjectDetailsInQuestionairre from "./Questionairre/ProjectDetailsInQuestionairre";
import Questionairre from "./Questionairre/Questionairre";

const OneTabStepTwo: React.FC = () => {
  const projectID = useAppSelector((state) => state.projects.projectID);

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-[#F4FCFF]">
      <div className="md:w-[30%] w-full">
        {projectID ? (
          <ProjectDetailsInQuestionairre />
        ) : (
          <div className="text-gray-500 p-4">No project details available.</div>
        )}
      </div>

      <div className="hidden md:block border-l-[1px] border-[#42affc] h-auto"></div>

      <div className="md:w-[70%] w-full md:mx-3 mt-4 md:mt-0 p-2">
        <Questionairre />
      </div>
    </div>
  );
};

export default OneTabStepTwo;
