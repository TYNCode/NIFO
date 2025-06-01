import React from "react";
import { StartupType } from "../types/company";
import VerifiedBadge from "./VerifiedBadge";

interface StartupGridCardProps {
  startup: StartupType;
  onEdit: (startup: StartupType) => void;
  onDelete: (startup: StartupType) => void;
}

const StartupGridCard: React.FC<StartupGridCardProps> = ({
  startup,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-customBlack line-clamp-1">
          {startup.startup_name}
        </h3>
        {startup.is_verified && <VerifiedBadge isVerified={startup.is_verified} />}
      </div>
      
      <p className="text-sm text-customGreyishBlack line-clamp-3 mb-4">
        {startup.startup_description}
      </p>
      
      {startup.startup_industry && (
        <div className="mb-4">
          <span className="bg-bgBlue text-customBlue text-xs px-2 py-1 rounded">
            {startup.startup_industry}
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <a
          href={startup.startup_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-customBlue hover:underline truncate flex-1 mr-2"
        >
          {startup.startup_url}
        </a>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(startup)}
            className="text-customBlue hover:text-blue-700 p-1"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(startup)}
            className="text-red-500 hover:text-red-700 p-1"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartupGridCard;