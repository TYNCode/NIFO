import React from "react";
import { LuLoaderCircle } from "react-icons/lu";

interface ActionButtonsProps {
  setIsQuestionnaireModalOpen: (open: boolean) => void;
  isPDDJsonGenerating: boolean;
  onGeneratePDD: () => void;
  disableGenerate: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  setIsQuestionnaireModalOpen,
  isPDDJsonGenerating,
  onGeneratePDD,
  disableGenerate,
}) => {
  return (
    <div className="flex flex-row gap-8 justify-end px-4 pb-4">
      <button
        className="flex flex-row gap-2 bg-[#0071C1] text-white px-4 py-2 rounded-[12px] items-center justify-center text-[14px]"
        onClick={() => setIsQuestionnaireModalOpen(true)}
      >
        <img src="/coinnovation/uploadfilewhite.svg" alt="Upload" />
        <span>Upload</span>
      </button>

      {isPDDJsonGenerating ? (
        <div className="flex bg-[#0071C1] text-white px-4 py-2 rounded-[12px] items-center justify-center text-[14px]">
          <LuLoaderCircle className="animate-spin" size={20} />
        </div>
      ) : (
        <button
          className={`flex flex-row gap-2 px-4 py-2 rounded-[12px] items-center justify-center text-[14px] ${
            disableGenerate
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#0071C1] text-white"
          }`}
          onClick={onGeneratePDD}
          disabled={disableGenerate}
        >
          <img src="/coinnovation/savepdd-icon.svg" alt="Save" />
          <span>Save & Continue</span>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
