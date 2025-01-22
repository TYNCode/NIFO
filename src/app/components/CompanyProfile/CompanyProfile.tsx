import React from "react";
import { ClipLoader } from "react-spinners";

interface CompanyProfileProps {
  company: {
    startup_name: string;
    startup_analyst_rating: string;
    startup_industry: string;
    startup_technology: string;
    startup_overview: string;
    startup_description: string;
    startup_company_stage: string;
    startup_country: string;
    startup_founders_info: string;
    startup_emails: string;
  };
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ company }) => {
  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-4  min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {company.startup_name}
      </h1>
      <div className="w-full max-w-3xl">
        <div className="relative mb-8">
          <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
            Analyst Rating
          </span>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
            {company.startup_analyst_rating || "N/A"}
          </div>
        </div>

        <div className="relative mb-8">
          <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
            Industry
          </span>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
            {company.startup_industry || "N/A"}
          </div>
        </div>

        <div className="relative mb-8">
          <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
            Technology
          </span>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
            {company.startup_technology || "N/A"}
          </div>
        </div>

        <div className="relative mb-8">
          <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
            Overview
          </span>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
            {company.startup_overview || "N/A"}
          </div>
        </div>

        <div className="relative mb-8">
          <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
            Description
          </span>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
            {company.startup_description || "N/A"}
          </div>
        </div>

        <div className="relative mb-8">
          <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
            Stage
          </span>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
            {company.startup_company_stage || "N/A"}
          </div>
        </div>

        <div className="relative mb-8">
          <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
            Country
          </span>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
            {company.startup_country || "N/A"}
          </div>
        </div>

        <div className="relative mb-8">
          <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
            Founders Info
          </span>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
            {company.startup_founders_info || "N/A"}
          </div>
        </div>

        <div className="relative mb-8">
          <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
            Emails
          </span>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
            {company.startup_emails || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
