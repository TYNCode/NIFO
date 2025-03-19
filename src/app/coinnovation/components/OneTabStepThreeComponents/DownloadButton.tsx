import React from 'react';

interface DownloadButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      className="flex flex-row gap-2 bg-[#2286C0] text-white px-4 py-2 rounded-[12px] items-center justify-center shadow-[6px_10px_20px_0px_rgba(7, 7, 7, 0.1)]"
      onClick={onClick}
      disabled={isLoading}
    >
      <div>
        <img src="/coinnovation/pdd-icon.svg" alt="PDD Icon" />
      </div>
      <div className="text-[12px]">
        {isLoading ? "Generating..." : "PDD Download"}
      </div>
    </button>
  );
};

export default DownloadButton;