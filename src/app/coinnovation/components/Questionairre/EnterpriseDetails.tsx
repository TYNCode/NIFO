import React from "react";

interface EnterpriseData {
  enterprise: string;
  owner: string;
  approver: string;
  category: string;
  department: string;
  business_unit: string;
  location: string;
}

interface EnterpriseDetailsProps {
  projectData: EnterpriseData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  readOnly?: boolean;
}

const EnterpriseDetails: React.FC<EnterpriseDetailsProps> = ({
  projectData,
  onInputChange,
  readOnly = false,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-[14px] font-semibold text-[#4A4D4E]">
        Enterprise Details
      </div>

      {["enterprise", "owner", "approver"].map((field, index) => (
        <div key={index} className="flex flex-col">
          <label className="text-[13px] text-[#4A4D4E]">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type="text"
            name={field}
            value={(
              projectData[field as keyof EnterpriseData] ?? ""
            ).toString()}
            onChange={onInputChange}
            className={`rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full text-[13px] text-[#4A4D4E] ${
              readOnly ? "bg-gray-100" : ""
            }`}
            readOnly={readOnly}
          />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        {["category", "department", "business_unit", "location"].map(
          (field, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-[13px] text-[#4A4D4E]">
                {field.replace("_", " ").charAt(0).toUpperCase() +
                  field.replace("_", " ").slice(1)}
              </label>
              <input
                type="text"
                name={field}
                value={(
                  projectData[field as keyof EnterpriseData] ?? ""
                ).toString()}
                onChange={onInputChange}
                className={`rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full text-[#4A4D4E] text-[13px] ${
                  readOnly ? "bg-gray-100" : ""
                }`}
                readOnly={readOnly}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EnterpriseDetails;
