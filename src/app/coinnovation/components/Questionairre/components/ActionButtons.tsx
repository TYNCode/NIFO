import Image from "next/image";
import React from "react";
import { LuLoaderCircle } from "react-icons/lu";
import Button from "../../TwoTabStepComponents/Button";

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
      {/* <button
        className="flex flex-row gap-2 bg-[#0071C1] text-white px-4 py-2 rounded-[12px] items-center justify-center text-[14px]"
        onClick={() => setIsQuestionnaireModalOpen(true)}
      >
        <Image src="/coinnovation/uploadfilewhite.svg" width={100} height={100} alt="Upload" />
        <span>Upload</span>
      </button> */}
      <Button
      label="Upload"
      onClick={() => setIsQuestionnaireModalOpen(true)}
      />

      {isPDDJsonGenerating ? (
        <div className="flex bg-[#0071C1] text-white px-4 py-2 rounded-[12px] items-center justify-center text-[14px]">
          <LuLoaderCircle className="animate-spin" size={20} />
        </div>
      ) : (
        // <button
        //   className={`flex flex-row gap-2 px-4 py-2 rounded-[12px] items-center justify-center text-[14px] ${
        //     disableGenerate
        //       ? "bg-gray-400 text-white cursor-not-allowed"
        //       : "bg-[#0071C1] text-white"
        //   }`}
        //   onClick={onGeneratePDD}
        //   disabled={disableGenerate}
        // >
        //   <Image src="/coinnovation/savepdd-icon.svg" width={10} height={10} alt="Save" />
        //   <span>Save & Continue</span>
        // </button>

        <Button
        label="Save & Continue"
        onClick={onGeneratePDD}
        disabled={disableGenerate}

        />
      )}
    </div>
  );
};

export default ActionButtons;
