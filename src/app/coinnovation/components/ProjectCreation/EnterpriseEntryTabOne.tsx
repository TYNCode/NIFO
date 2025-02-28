import React, { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { ProjectData } from "../ProjectDetails";

interface EnterpriseEntryTabOneProps {
    projectData: ProjectData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleDropdownChange: (field: string, value: string) => void; // New prop
}

const EnterpriseEntryTabOne: React.FC<EnterpriseEntryTabOneProps> = ({
    projectData,
    handleInputChange,
    handleDropdownChange
}) => {
    const [isOpenGroupCompany, setIsOpenGroupCompany] = useState(false);
    const [isOpenEnterprise, setIsOpenEnterprise] = useState(false);

    const groupCompanyOptions = ["Vedanta", "Tata"];

    const enterpriseOptions: Record<string, string[]> = {
        Vedanta: [
            "Bharat Aluminium Company",
            "Vedanta Aluminium",
            "Jharsuguda Aluminium Smelter",
            "Cairn Oil & Gas",
            "Mangala Oil Field",
            "Ravva Oil Field",
            "Electrosteel Steels",
            "Sesa Goa Iron Ore",
            "Hindustan Zinc",
            "Sterlite Copper",
            "Talwandi Sabo Power Limited",
            "Malco Energy",
            "Ferro Alloys Corporation",
        ],
        Tata: [
            "Tata Steel",
            "Tata Power",
            "Tata Projects",
            "Tata Housing",
            "Tata Motors",
            "Tata Chemicals",
            "Tata Digital",
            "Titan Company",
            "Tata Consumer Products",
            "Air India Limited",
        ],
    };

    const handleSelectGroupCompany = (option: string) => {
        handleDropdownChange("group_company", option);
        handleDropdownChange("enterprise", ""); // Clear enterprise when group changes
        setIsOpenGroupCompany(false);
    };

    const handleSelectEnterprise = (option: string) => {
        handleDropdownChange("enterprise", option);
        setIsOpenEnterprise(false);
    };

    return (
        <div className="flex flex-col gap-4 w-2/6">
            <div className="text-lg font-semibold text-[#4A4D4E]">Enterprise Details</div>

            {/* Group Company Dropdown */}
            <div className="flex flex-col gap-1">
                <label className="text-sm text-[#4A4D4E]">Group Company</label>
                <div className="relative w-full">
                    <div
                        className="flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[32px] px-3 cursor-pointer bg-white w-full"
                        onClick={() => setIsOpenGroupCompany(!isOpenGroupCompany)}
                    >
                        <span className="text-[#4A4D4E] text-sm">
                            {projectData.group_company || "Select Group Company"}
                        </span>
                        <IoChevronDownOutline className={`transition-transform ${isOpenGroupCompany ? "rotate-180" : ""}`} />
                    </div>

                    {isOpenGroupCompany && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                            {groupCompanyOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-2 hover:bg-[#56A8F0] hover:text-white cursor-pointer"
                                    onClick={() => handleSelectGroupCompany(option)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Enterprise Dropdown */}
            <div className="flex flex-col gap-1">
                <label className="text-sm text-[#4A4D4E]">Enterprise</label>
                <div className="relative w-full">
                    <div
                        className={`flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[32px] px-3 ${
                            projectData.group_company ? "cursor-pointer" : "cursor-not-allowed"
                        } bg-white w-full`}
                        onClick={() => projectData.group_company && setIsOpenEnterprise(!isOpenEnterprise)}
                    >
                        <span className="text-[#4A4D4E] text-sm">
                            {projectData.enterprise || (projectData.group_company ? "Select Enterprise" : "Select Group Company first")}
                        </span>
                        <IoChevronDownOutline className={`transition-transform ${isOpenEnterprise ? "rotate-180" : ""}`} />
                    </div>

                    {isOpenEnterprise && projectData.group_company && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-20">
                            {enterpriseOptions[projectData.group_company]?.map((option, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-2 hover:bg-[#56A8F0] hover:text-white cursor-pointer"
                                    onClick={() => handleSelectEnterprise(option)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
        {[ "owner", "approver","category", "department", "business_unit", "location"].map(
          (field, index) => (
            <div key={index} className="flex flex-col gap-1">
              <label className="text-sm text-[#4A4D4E]">
                {field.replace("_", " ").charAt(0).toUpperCase() +
                  field.replace("_", " ").slice(1)}
              </label>
              <input
                type="text"
                name={field}
                value={projectData[field as keyof typeof projectData]?.toString()}
                placeholder={`Please enter the ${field}`}
                onChange={handleInputChange}
                className="rounded-md focus:ring-0 placeholder:text-xs focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full"
              />
            </div>
          )
        )}
      </div>
        </div>
    );
};

export default EnterpriseEntryTabOne;
