import React, { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { ProjectData } from "../../../interfaces/coinnovation";


interface EnterpriseEntryTabOneProps {
    projectData: ProjectData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleDropdownChange: (field: string, value: string) => void;
}

const EnterpriseEntryTabOne: React.FC<EnterpriseEntryTabOneProps> = ({
    projectData,
    handleInputChange,
    handleDropdownChange
}) => {
    const [isOpenGroupCompany, setIsOpenGroupCompany] = useState(false);
    const [isOpenEnterprise, setIsOpenEnterprise] = useState(false);

    const groupCompanyOptions = ["Vedanta", "Tata"];

    const vedantaCompanies = [
        { id: 1, title: "Bharat Aluminium Company", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1741582642/WhatsApp_Image_2025-02-28_at_12.21.51_13f713d1_o2otmq.jpg" },
        { id: 2, title: "Vedanta Aluminium", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740722126/tatasteel_tpdier.jpg" },
        { id: 3, title: "Jharsuguda Aluminium Smelter", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1741582642/WhatsApp_Image_2025-02-28_at_12.22.57_2ae23bbe_eperen.jpg" },
        { id: 4, title: "Cairn Oil & Gas", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1741582585/IMG-20250228-WA0017_vuv0lg.jpg" },
        { id: 5, title: "Mangala Oil Field", imageurl: "" },
        { id: 6, title: "Ravva Oil Field", imageurl: "" },
        { id: 7, title: "Electrosteel Steels", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1741582622/IMG-20250228-WA0018_inudvl.jpg" },
        { id: 8, title: "Sesa Goa Iron Ore", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1741582622/IMG-20250228-WA0019_azbfyr.jpg" },
        { id: 9, title: "Hindustan Zinc", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1741582621/IMG-20250228-WA0020_t4sd6n.jpg" },
        { id: 10, title: "Sterlite Copper", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1741582621/IMG-20250228-WA0021_mvu2gm.jpg" },
        { id: 11, title: "Talwandi Sabo Power Limited", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1741582622/IMG-20250228-WA0022_myymdz.jpg" },
        { id: 12, title: "Malco Energy", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1741582642/IMG-20250228-WA0023_jpgk3h.jpg" },
        { id: 13, title: "Ferro Alloys Corporation", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1741582642/IMG-20250228-WA0024_ixzzgs.jpg" },
    ];

    const tataCompanies = [
        { id: 1, title: "Tata Steel", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740722126/tatasteel_tpdier.jpg" },
        { id: 2, title: "Tata Power", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740739887/IMG-20250228-WA0006_d4ignv.jpg" },
        { id: 3, title: "Tata Projects", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740739887/IMG-20250228-WA0007_rnzonp.jpg" },
        { id: 4, title: "Tata Housing", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740739887/IMG-20250228-WA0008_v2bigw.jpg" },
        { id: 5, title: "Tata Motors", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740739887/IMG-20250228-WA0009_rqxpdo.jpg" },
        { id: 6, title: "Tata Chemicals", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740739887/IMG-20250228-WA0010_myaxmi.jpg" },
        { id: 7, title: "Tata Digital", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740739887/IMG-20250228-WA0011_udknbd.jpg" },
        { id: 8, title: "Titan Company", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740739888/IMG-20250228-WA0012_h4rwst.jpg" },
        { id: 9, title: "Tata Consumer Products", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740739887/IMG-20250228-WA0013_ouvjng.jpg" },
        { id: 10, title: "Air India Limited", imageurl: "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1740739888/IMG-20250228-WA0014_mk78dk.jpg" },
    ];

    const handleSelectGroupCompany = (group: string) => {
        handleDropdownChange("group_company", group);
        handleDropdownChange("enterprise", "");
        handleDropdownChange("enterprise_img", "");
        setIsOpenGroupCompany(false);
    };

    const handleSelectEnterprise = (enterprise: { title: string; imageurl: string }) => {
        handleDropdownChange("enterprise", enterprise.title);
        handleDropdownChange("enterprise_img", enterprise.imageurl);
        setIsOpenEnterprise(false);
    };

    const getEnterpriseList = () => {
        if (projectData.group_company === "Vedanta") {
            return vedantaCompanies;
        } else if (projectData.group_company === "Tata") {
            return tataCompanies;
        }
        return [];
    };

    return (
        <div className="flex flex-col gap-4 w-2/6">
            <div className="text-[14px] font-semibold text-[#4A4D4E]">Enterprise Details</div>

            {/* Group Company Dropdown */}
            <div className="flex flex-col gap-1">
                <label className="text-[#4A4D4E] text-[13px]">Group Company</label>
                <div className="relative w-full">
                    <div
                        className="flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[32px] px-3 cursor-pointer bg-white w-full"
                        onClick={() => setIsOpenGroupCompany(!isOpenGroupCompany)}
                    >
                        <span className="text-[#4A4D4E] text-[13px]">
                            {projectData.group_company || "Select Group Company"}
                        </span>
                        <IoChevronDownOutline className={`transition-transform ${isOpenGroupCompany ? "rotate-180" : ""}`} />
                    </div>

                    {isOpenGroupCompany && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                            {groupCompanyOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-2 hover:bg-[#2286C0] hover:text-white cursor-pointer text-[#4A4D4E] text-[13px]"
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
                <label className="text-[#4A4D4E] text-[13px]">Enterprise</label>
                <div className="relative w-full">
                    <div
                        className={`flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[32px] px-3 text-[#4A4D4E] text-[13px]  ${
                            projectData.group_company ? "cursor-pointer" : "cursor-not-allowed"
                        } bg-white w-full`}
                        onClick={() => projectData.group_company && setIsOpenEnterprise(!isOpenEnterprise)}
                    >
                        <span className="text-[#4A4D4E] text-[13px]">
                            {projectData.enterprise || (projectData.group_company ? "Select Enterprise" : "Select Group Company first")}
                        </span>
                        <IoChevronDownOutline className={`transition-transform ${isOpenEnterprise ? "rotate-180" : ""}`} />
                    </div>

                    {isOpenEnterprise && projectData.group_company && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-20">
                            {getEnterpriseList().map((enterprise, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-2 hover:bg-[#2286C0] hover:text-white cursor-pointer flex items-center gap-2 text-[13px] text-[#4A4D4E]"
                                    onClick={() => handleSelectEnterprise(enterprise)}
                                >
                                    {/* {enterprise.imageurl && (
                                        <Image src={enterprise.imageurl} alt={enterprise.title} className="w-5 h-5 rounded-full" />
                                    )} */}
                                    {enterprise.title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Other Fields */}
            <div className="grid grid-cols-2 gap-4">
                {["owner", "approver", "category", "department", "business_unit", "location"].map((field, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <label className="text-[#4A4D4E] text-[13px]">
                            {field.replace("_", " ").charAt(0).toUpperCase() + field.replace("_", " ").slice(1)}
                        </label>
                        <input
                            type="text"
                            name={field}
                            value={projectData[field as keyof typeof projectData]?.toString()}
                            onChange={handleInputChange}
                            className="rounded-md border-[#56A8F0] h-[32px] px-2 w-full text-sm focus:ring-0 focus:border-[#56A8F0] text-[#4A4D4E] text-[13px]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EnterpriseEntryTabOne;
