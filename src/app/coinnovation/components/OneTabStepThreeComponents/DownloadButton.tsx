import Image from "next/image";
import React from "react";
import Button from "../TwoTabStepComponents/Button";
import { IoDocumentTextOutline } from "react-icons/io5";

interface DownloadButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  isLoading,
}) => {
  console.log("button inside download button")
  return (
    // <button
    //   className="flex flex-row gap-2 bg-[#2286C0] text-white px-4 py-2 rounded-[12px] items-center justify-center shadow-[6px_10px_20px_0px_rgba(7, 7, 7, 0.1)]"
    //   onClick={onClick}
    //   disabled={isLoading}
    // >
    //   <div>
    //     <Image src="/coinnovation/pdd-icon.svg" alt="PDD Icon" width={20} height={20} />
    //   </div>
    //   <div className="text-[12px]">
    //     {isLoading ? "Generating..." : "PDD Download"}
    //   </div>
    // </button>
    <Button
      label="PDD Download"
      icon={<IoDocumentTextOutline />}
      disabled={isLoading}
      onClick={onClick}
    />
  );
};

export default DownloadButton;
