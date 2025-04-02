import React from "react";
import Image from "next/image";

interface QuestionnaireHeaderProps {
  onDownload: () => void;
}

const QuestionnaireHeader: React.FC<QuestionnaireHeaderProps> = ({ onDownload }) => {
  return (
    <div className="flex justify-between items-center text-black py-2 rounded-md">
      <h1 className="text-[14px] font-semibold text-[#4A4D4E]">
        Questionnaire
      </h1>
      <button onClick={onDownload}>
        <Image
          alt="Download Questionnaire"
          src="/coinnovation/download_questionairre.svg"
          width={30}
          height={30}
        />
      </button>
    </div>
  );
};

export default QuestionnaireHeader;
