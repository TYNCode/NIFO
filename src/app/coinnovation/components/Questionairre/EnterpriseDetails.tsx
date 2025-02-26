import React from "react";

interface EnterpriseDetailsProps {
  projectData: {
    enterprise: string;
    owner: string;
    approver: string;
    category: string;
    department: string;
    business_unit: string;
    location: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EnterpriseDetails: React.FC<EnterpriseDetailsProps> = ({
  projectData,
  onInputChange
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold text-[#4A4D4E]">Enterprise Details</div>

      {["enterprise"].map((field, index) => (
        <div key={index} className="flex flex-col">
          <label className="text-sm text-[#4A4D4E]">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            type="text"
            name={field}
            value={projectData[field as keyof typeof projectData]}
            onChange={onInputChange}
            className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full"
          />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        {["owner", "approver","category", "department", "business_unit", "location"].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-sm text-[#4A4D4E]">{field.replace("_", " ").charAt(0).toUpperCase() + field.replace("_", " ").slice(1)}</label>
            <input
              type="text"
              name={field}
              value={projectData[field as keyof typeof projectData]}
              onChange={onInputChange}
              className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnterpriseDetails;