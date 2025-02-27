import React from "react";
import ProjectDetailsInQuestionairre from "./Questionairre/ProjectDetailsInQuestionairre";
import Questionairre from "./Questionairre/Questionairre";

interface Answer {
  assumed: string;
  actual: string | null;
}

interface Question {
  question: string;
  answer: Answer;
  isSelected?: boolean;
}

interface Category {
  questions: Question[];
}

interface QuestionnaireData {
  categories: Record<string, Category>;
}

interface OneTabStepTwoProps {
  projectID: string | null;
  projectDescription: string | null;
  questionnaireData: QuestionnaireData;
  setQuestionnaireData: React.Dispatch<React.SetStateAction<QuestionnaireData>>;
}

const OneTabStepTwo: React.FC<OneTabStepTwoProps> = ({ 
  projectID, 
  projectDescription, 
  questionnaireData, 
  setQuestionnaireData 
}) => {
  console.log("questionnaireINSIDEONETAB", questionnaireData);
  
  return (
    <div className="p-4 w-full flex min-h-screen bg-[#F4FCFF]">
      <div className="w-[30%]">
        {projectID && projectDescription ? (
          <ProjectDetailsInQuestionairre
            projectID={projectID}
            projectDescription={projectDescription}
          />
        ) : (
          <div className="text-gray-500 p-4">No project details available.</div>
        )}
      </div>

      <div className="border-l-[1px] border-[#42affc] h-auto"></div>

      <div className="w-[70%] mx-3">
        <Questionairre
          questionnaireData={questionnaireData} 
          setQuestionnaireData={setQuestionnaireData} 
        />
      </div>
    </div>
  );
};

export default OneTabStepTwo;