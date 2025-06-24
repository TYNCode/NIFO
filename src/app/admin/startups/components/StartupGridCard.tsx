import React from "react";
import { CompanyType } from "@/app/redux/features/companyprofile/companyProfileSlice";
import VerifiedBadge from "./VerifiedBadge";

interface StartupGridCardProps {
  startup: CompanyType;
  onEdit: (startup: CompanyType) => void;
  onDelete: (startup: CompanyType) => void;
}

const StartupGridCard: React.FC<StartupGridCardProps> = ({
  startup,
  onEdit,
  onDelete,
}) => {
  // Type guards
  const isStartup = "startup_id" in startup;
  const isEnterprise = "enterprise_id" in startup;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-customBlack line-clamp-1">
          {isStartup
            ? (startup as any).startup_name
            : (startup as any).enterprise_name}
        </h3>
        {"is_verified" in startup && (
          <VerifiedBadge isVerified={(startup as any).is_verified} />
        )}
      </div>
      
      <p className="text-sm text-customGreyishBlack line-clamp-3 mb-4">
        {isStartup
          ? (startup as any).startup_description
          : (startup as any).enterprise_description}
      </p>
      
      {(
        (isStartup && (startup as any).startup_industry) ||
        (isEnterprise && (startup as any).enterprise_description)
      ) && (
        <div className="mb-4">
          <span className="bg-bgBlue text-customBlue text-xs px-2 py-1 rounded">
            {isStartup
              ? (startup as any).startup_industry
              : (startup as any).enterprise_description}
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <a
          href={
            isStartup
              ? (startup as any).startup_url
              : (startup as any).enterprise_url
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-customBlue hover:underline truncate flex-1 mr-2"
        >
          {isStartup
            ? (startup as any).startup_url
            : (startup as any).enterprise_url}
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