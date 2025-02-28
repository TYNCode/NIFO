import { ProjectData } from "../ProjectDetails";


interface EnterpriseEntryTabOneProps {
    projectData: ProjectData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  }

const EnterpriseEntryTabOne: React.FC<EnterpriseEntryTabOneProps> = ({
  projectData,
  handleInputChange
}) => {
  return (
    <div className="flex flex-col gap-4 w-2/6">
      <div className="font-semibold text-[#4A4D4E] text-[14px]">
        Enterprise Details
      </div>

      {["enterprise"].map((field, index) => (
        <div key={index} className="flex flex-col gap-1">
          <label className="text-[#4A4D4E] text-[13px]">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type="text"
            name={field}
            value={projectData[field as keyof typeof projectData]?.toString()}
            onChange={handleInputChange}
            className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full text-[#4A4D4E] text-[13px]"
          />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        {[ "owner", "approver","category", "department", "business_unit", "location"].map(
          (field, index) => (
            <div key={index} className="flex flex-col gap-1">
              <label className="text-[#4A4D4E] text-[13px]">
                {field.replace("_", " ").charAt(0).toUpperCase() +
                  field.replace("_", " ").slice(1)}
              </label>
              <input
                type="text"
                name={field}
                value={projectData[field as keyof typeof projectData]?.toString()}
                placeholder={`Please enter the ${field}`}
                onChange={handleInputChange}
                className="rounded-md focus:ring-0 placeholder:text-xs focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full text-[#4A4D4E] text-[13px]"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EnterpriseEntryTabOne;