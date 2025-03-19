import React, { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { ProjectData } from "../Types/CoinnovationTypes";


interface ProjectEntryProps {
  projectData: ProjectData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectPriority: (option: string) => void;
  onSelectStatus: (option: string) => void;
  readOnly?: boolean;
}

const ProjectEntry: React.FC<ProjectEntryProps> = ({
  projectData,
  onInputChange,
  onSelectPriority,
  onSelectStatus,
  readOnly = false
}) => {
  const [isOpenPriority, setIsOpenPriority] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);

  const optionsPriority = ["Critical", "High", "Medium", "Low"];
  const optionsStatus = ["To Do", "In Progress", "In Review", "Done", "Blocked", "Waiting for Approval", "Cancelled"];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[#4A4D4E] text-[14px] font-semibold">Project Entry Details</div>

      <div className="flex flex-col">
        <label className="text-[#4A4D4E] text-[13px]">Project ID</label>
        <input
          type="text"
          className={`rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full text-[#4A4D4E] text-[13px] ${
            readOnly ? "bg-gray-100" : ""
          }`}
          name="project_id"
          value={projectData.project_id}
          onChange={onInputChange}
          readOnly={readOnly}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-[13px] text-[#4A4D4E]">Project Name</label>
        <input
          type="text"
          className={`rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full  text-[#4A4D4E] text-[13px]  ${
            readOnly ? "bg-gray-100" : ""
          }`}
          name="project_name"
          value={projectData.project_name}
          onChange={onInputChange}
          readOnly={readOnly}
        />
      </div>

      <div className="relative">
        <label className="text-[13px] text-[#4A4D4E]">Priority</label>
        {readOnly ? (
          <div className="rounded-md border-[#56A8F0] border-[1px] h-[32px] cursor-pointer px-3 bg-gray-100 w-full flex items-center  text-[#4A4D4E] text-[13px]">
            <span className="text-[#4A4D4E] text-[13px]">{projectData.priority || "Not set"}</span>
          </div>
        ) : (
          <>
            <div
              className="flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[28px] px-3 cursor-pointer bg-white w-full"
              onClick={() => setIsOpenPriority(!isOpenPriority)}
            >
              <span className="text-[#4A4D4E] text-[13px]">{projectData.priority || "Select an option"}</span>
              <IoChevronDownOutline className={`transition-transform text-sm font-light text-[#979797] ${isOpenPriority ? "rotate-180" : ""}`} />
            </div>

            {isOpenPriority && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                {optionsPriority.map((option, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-[#56A8F0] hover:text-white cursor-pointer transition text-[13px] text-[#4A4D4E]"
                    onClick={() => {
                      onSelectPriority(option);
                      setIsOpenPriority(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="relative">
        <label className="text-[13px] text-[#4A4D4E]">Status</label>
        {readOnly ? (
          <div className="rounded-md border-[#56A8F0] border-[1px] h-[32px] px-3 bg-gray-100 w-full flex items-center">
            <span className="text-[#4A4D4E] text-sm">{projectData.status || "Not set"}</span>
          </div>
        ) : (
          <>
            <div
                className="flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[32px] px-3 cursor-pointer bg-white w-full text-[13px]"
              onClick={() => setIsOpenStatus(!isOpenStatus)}
            >
              <span className="text-[#4A4D4E]">{projectData.status || "Select an option"}</span>
              <IoChevronDownOutline className={`transition-transform text-sm font-light text-[#979797] ${isOpenStatus ? "rotate-180" : ""}`} />
            </div>

            {isOpenStatus && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                {optionsStatus.map((option, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-[#56A8F0] hover:text-white cursor-pointer transition text-[13px] text-[#4A4D4E]"
                    onClick={() => {
                      onSelectStatus(option);
                      setIsOpenStatus(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[13px] text-[#4A4D4E]">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={projectData.start_date}
            onChange={onInputChange}
            className={`rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full text-[#4A4D4E] text-[13px] ${
              readOnly ? "bg-gray-100" : ""
            }`}
            readOnly={readOnly}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#4A4D4E] text-[13px] ">Target Closure</label>
          <input
            type="date"
            name="end_date"
            value={projectData.end_date}
            onChange={onInputChange}
            className={`rounded-md focus:ring-0 placeholder:text-xs focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full text-[#4A4D4E] text-[13px] ${
              readOnly ? "bg-gray-100" : ""
            }`}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectEntry;