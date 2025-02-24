import React, { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { CiPlay1 } from "react-icons/ci";
import { BiSave } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import axios from "axios";
const ProjectDetails: React.FC = () => {
    const [projectData, setProjectData] = useState({
        project_id: "",
        project_name: "",
        priority: "",
        status: "",
        start_date: "",
        end_date: "",
        enterprise: "",
        owner: "",
        approver: "",
        category: "",
        department: "",
        business_unit: "",
        location: "",
        project_description: "",
        problem_statement: "Excessive energy consumption in aluminum smelting is causing overheating and reduced efficiency.",
        context: "Full extracted text from document analysis."
    });
    const [isOpenPriority, setIsOpenPriority] = useState(false);
    const [isOpenStatus, setIsOpenStatus] = useState(false);
    const [selectedOptionPriority, setSelectedOptionPriority] = useState("Select an option");
    const [selectedOptionStatus, setSelectedOptionStatus] = useState("Select an option");
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");

    const optionsPriority = ["Critical", "High", "Medium", "Low"];
    const optionsStatus = ["To Do", "In Progress", "In Review", "Done", "Blocked", "Waiting for Approval", "Cancelled"];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleSelectPriority = (option: string) => {
        setSelectedOptionPriority(option);
        setIsOpenPriority(false);
    };

    const handleSelectStatus = (option: string) => {
        setSelectedOptionStatus(option);
        setIsOpenStatus(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setResponseMessage("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/coinnovation/create-project/",
                projectData,
                { headers: { "Content-Type": "application/json" } }
            );

            setResponseMessage("Project successfully created!");
            console.log("Success:", response.data);
        } catch (error) {
            setResponseMessage("Failed to create project. Please try again.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="px-16 py-6 bg-[#F4FCFF]">
                <div className="flex flex-row gap-6 justify-center">
                    <div className="flex flex-col gap-4">
                        <div className="text-[#4A4D4E] text-lg font-semibold">Project Entry Details</div>

                        <div className="flex flex-col">
                            <label className="text-sm text-[#4A4D4E]">Project ID</label>
                            <input 
                            type="text" 
                            className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full"
                            name="project_id"
                            value={projectData.project_id}
                            onChange={handleInputChange} />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm text-[#4A4D4E]">Project Name</label>
                            <input 
                            type="text" 
                            className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full" 
                            name="project_name"
                            value={projectData.project_name}
                            onChange={handleInputChange}/>
                        </div>

                        <div className="relative">
                            <label className="text-sm text-[#4A4D4E]">Priority</label>
                            <div
                                className="flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[28px] px-3 cursor-pointer bg-white w-full"
                                onClick={() => setIsOpenPriority(!isOpenPriority)}
                            >
                                <span className="text-[#4A4D4E] text-sm">{selectedOptionPriority}</span>
                                <IoChevronDownOutline className={`transition-transform text-sm font-light text-[#979797] ${isOpenPriority ? "rotate-180" : ""}`} />
                            </div>

                            {isOpenPriority && (
                                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                                    {optionsPriority.map((option, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 hover:bg-[#56A8F0] hover:text-white cursor-pointer transition text-sm text-[#4A4D4E]"
                                            onClick={() => handleSelectPriority(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <label className="text-sm text-[#4A4D4E]">Status</label>
                            <div
                                className="flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[32px] px-3 cursor-pointer bg-white w-full text-sm"
                                onClick={() => setIsOpenStatus(!isOpenStatus)}
                            >
                                <span className="text-[#4A4D4E]">{selectedOptionStatus}</span>
                                <IoChevronDownOutline className={`transition-transform text-sm font-light text-[#979797] ${isOpenStatus ? "rotate-180" : ""}`} />
                            </div>

                            {isOpenStatus && (
                                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                                    {optionsStatus.map((option, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 hover:bg-[#56A8F0] hover:text-white cursor-pointer transition text-sm text-[#4A4D4E]"
                                            onClick={() => handleSelectStatus(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm text-[#4A4D4E]">Start Date</label>
                                <input type="date" className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-[#4A4D4E]">Target Closure</label>
                                <input type="date" className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="border-[1px] border-[#C3E3FF] flex items-center justify-center"></div>

                    <div className="flex flex-col gap-4">
                        <div className="text-lg font-semibold text-[#4A4D4E]">Enterprise Details</div>

                        {["Enterprise", "Owner", "Approver"].map((label, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-sm text-[#4A4D4E]">{label}</label>
                                <input type="text" className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full" />
                            </div>
                        ))}

                        <div className="grid grid-cols-2 gap-4">
                            {["Category", "Department", "Business Unit", "Location"].map((label, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="text-sm text-[#4A4D4E]">{label}</label>
                                    <input type="text" className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-[1px] border-[#C3E3FF] flex items-center justify-center"></div>

                    <div className="flex flex-col">
                        <div className="text-lg font-semibold text-[#4A4D4E]">Project Description</div>
                        <textarea
                            name="project_description"
                            value={projectData.project_description}
                            onChange={handleInputChange}
                            rows={3}
                            className="rounded-md focus:ring-0 border-[#56A8F0] border-[1px] w-full px-2 resize-none 
               text-[#4A4D4E] text-sm font-normal mt-2"
                        />
                    </div>
                </div>
      
                <div className="flex flex-row gap-4 justify-end items-end">
                    <div className="flex flex-row justify-center items-center text-white text-normal gap-1.5 bg-[#0070C0] px-4 rounded-[12px] text-sm py-2 cursor-pointer">
                        <div>
                            <FiEdit2 />
                        </div>
                        <div className="font-semibold">Edit</div>
                    </div>
                    <div className="flex flex-row justify-center items-center text-white text-normal gap-1.5 bg-[#0070C0] px-4 rounded-[12px] text-sm py-2 cursor-pointer">
                        <div>
                            <BiSave />
                        </div>
                        <div className="font-semibold">Save & Continue</div>
                    </div>
                    <div className="flex flex-row justify-center items-center text-white text-normal gap-1.5 bg-[#0070C0] px-4 rounded-[12px] text-sm py-2 cursor-pointer">
                        <div>
                            <CiPlay1 />
                        </div>
                        <div className="font-semibold">Skip</div>
                    </div>
                </div>
            </div>
            
        </>
     
    );
};

export default ProjectDetails;
