import React from "react";
import { CompanyType } from "@/app/redux/features/companyprofile/companyProfileSlice";
import DataTable, { AdminTableColumn } from "@/app/components/common/DataTable";

interface Props {
  startups: CompanyType[];
  onEdit: (startup: CompanyType) => void;
  onDelete: (startup: CompanyType) => void;
}

const getCompanyId = (company: CompanyType): number => {
  return 'startup_id' in company ? company.startup_id : company.enterprise_id;
};

const getCompanyName = (company: CompanyType): string => {
  return 'startup_name' in company ? company.startup_name : company.enterprise_name;
};

const getCompanyUrl = (company: CompanyType): string => {
  return 'startup_url' in company ? company.startup_url : company.enterprise_url;
};

const getCompanyLogo = (company: CompanyType): string | undefined => {
  return 'startup_logo' in company ? (company as any).startup_logo : undefined;
};

const getCompanyIndustry = (company: CompanyType): string | undefined => {
  if ('startup_industry' in company) {
    return (company as any).startup_industry;
  }
  if ('enterprise_description' in company) {
    return (company as any).enterprise_description;
  }
  return company.description;
};

const StartupTable: React.FC<Props> = ({ startups, onEdit, onDelete }) => {
  const columns: AdminTableColumn<CompanyType>[] = [
    {
      header: "Startup",
      accessor: "startup_name",
      render: (startup) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {getCompanyLogo(startup) ? (
              <img
                className="h-10 w-10 rounded-lg object-cover"
                src={getCompanyLogo(startup)}
                alt={`${getCompanyName(startup)} logo`}
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-customBlue flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {getCompanyName(startup)?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-customBlack">
              {getCompanyName(startup)}
            </div>
            <div className="text-sm text-customGreyishBlack">
              <a
                href={getCompanyUrl(startup)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-customBlue transition-colors duration-200"
              >
                {getCompanyUrl(startup)}
              </a>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Industry",
      accessor: "industry",
      render: (startup) => (
        <div className="text-sm text-customGreyishBlack">
          {getCompanyIndustry(startup) || (
            <span className="text-gray-400 italic">Not specified</span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (startup) => (
        <div className="flex items-center space-x-2">
          {(startup as any).is_verified ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Pending
            </span>
          )}
          {startup.user_registration && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Registered
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (startup) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onEdit(startup)}
            className="text-customBlue hover:text-blue-700 transition-colors duration-200 flex items-center space-x-1"
            title="Edit startup"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(startup)}
            className="text-red-500 hover:text-red-700 transition-colors duration-200 flex items-center space-x-1"
            title="Delete startup"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable columns={columns} data={startups} rowKey={getCompanyId} emptyMessage="No startups found" />
  );
};

export default StartupTable;