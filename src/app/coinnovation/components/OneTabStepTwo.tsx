import React, { useState } from "react";
import Questionairre from "./Questionairre/Questionairre";
import ProjectDetailsInQuestionairre from "./Questionairre/ProjectDetailsInQuestionairre";

interface OneTabStepTwoProps {}

const OneTabStepTwo: React.FC<OneTabStepTwoProps> = () => {
  const [projectDetails, setProjectDetails] = useState({
    projectID: "PROJ-2025-001",
    projectDescription:
      "This project aims to improve energy efficiency in aluminum smelting operations.",
  });

  return (
    <div className="p-4 w-full flex gap-20 h-screen bg-[#F4FCFF]">
      <div className="w-[30%]">
        <ProjectDetailsInQuestionairre
          projectID={projectDetails.projectID}
          projectDescription={projectDetails.projectDescription}
        />
      </div>
      <div className="border-l-[1px] border-[#f18b47] h-full"></div>
      <div className="w-[75%]">
        <Questionairre />
      </div>
    </div>
  );
};

export default OneTabStepTwo;
