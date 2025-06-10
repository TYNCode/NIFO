import Image from "next/image";
import React from "react";
import Button from "../TwoTabStepComponents/Button";
import { IoDocumentTextOutline } from "react-icons/io5";

interface DownloadButtonProps {
  onClick: () => void;
  isLoading: boolean;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  isLoading,
  className = "",
}) => {
  return (
    <Button
      label={isLoading ? "Generating..." : "PDD Download"}
      icon={<IoDocumentTextOutline />}
      disabled={isLoading}
      onClick={onClick}
      className={className} // pass className properly
    />
  );
};
export default DownloadButton;