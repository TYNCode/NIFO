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
    return   <div className="flex items-center justify-center min-h-screen">
    <ClipLoader color="#3b82f6" size={50} />
  </div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border ">
      <h1 className="sm:text-4xl text-3xl font-bold text-gray-900 mb-4">{company.startup_name}</h1>
      <div className="space-y-4">
        <div className="flex items-baseline space-y-2 md:space-y-0 md:space-x-4">
          <strong className="text-gray-700 w-2/3 md:w-1/4">Analyst Rating:</strong>
          <p className="text-gray-900 w-2/3">{company.startup_analyst_rating}</p>
        </div>
        <div className="flex items-baseline space-y-2 md:space-y-0 md:space-x-4">
          <strong className="text-gray-700 w-2/3 md:w-1/4">Industry:</strong>
          <p className="text-gray-900 w-2/3">{company.startup_industry}</p>
        </div>
        <div className="flex items-baseline  space-y-2 md:space-y-0 md:space-x-4">
          <strong className="text-gray-700 w-2/3 md:w-1/4">Technology:</strong>
          <p className="text-gray-900 w-2/3">{company.startup_technology}</p>
        </div>
        <div className="flex items-baseline space-y-2 md:space-y-0 md:space-x-4">
          <strong className="text-gray-700 w-2/3 md:w-1/4">Overview:</strong>
          <p className="text-gray-900 w-2/3">{company.startup_overview}</p>
        </div>
        <div className="flex items-baseline space-y-2 md:space-y-0 md:space-x-4">
          <strong className="text-gray-700 w-2/3 md:w-1/4">Description:</strong>
          <p className="text-gray-900 w-2/3">{company.startup_description}</p>
        </div>
        <div className="flex items-baseline space-y-2 md:space-y-0 md:space-x-4">
          <strong className="text-gray-700 w-2/3 md:w-1/4">Stage:</strong>
          <p className="text-gray-900 w-2/3">{company.startup_company_stage}</p>
        </div>
        <div className="flex items-baseline space-y-2 md:space-y-0 md:space-x-4">
          <strong className="text-gray-700 w-2/3 md:w-1/4">Country:</strong>
          <p className="text-gray-900 w-2/3">{company.startup_country}</p>
        </div>
        <div className="flex items-baseline space-y-2 md:space-y-0 md:space-x-4">
          <strong className="text-gray-700 w-2/3 md:w-1/4">Founders Info:</strong>
          <p className="text-gray-900 w-2/3">{company.startup_founders_info}</p>
        </div>
        <div className="flex items-baseline space-y-2 md:space-y-0 md:space-x-4">
          <strong className="text-gray-700 w-2/3 md:w-1/4">Emails:</strong>
          <p className="text-gray-900 w-2/3">{company.startup_emails}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
