import { IoChevronDownOutline } from "react-icons/io5";
import { ProjectData } from "../ProjectDetails";

interface ProjectEntryTabOneProps {
  projectData: ProjectData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isOpenPriority: boolean;
  setIsOpenPriority: (value: boolean) => void;
  isOpenStatus: boolean;
  setIsOpenStatus: (value: boolean) => void;
  handleSelectPriority: (option: string) => void;
  handleSelectStatus: (option: string) => void;
}

const ProjectEntryTabOne: React.FC<ProjectEntryTabOneProps> = ({
  projectData,
  handleInputChange,
  isOpenPriority,
  setIsOpenPriority,
  isOpenStatus,
  setIsOpenStatus,
  handleSelectPriority,
  handleSelectStatus,
}) => {
  const optionsPriority = ["Critical", "High", "Medium", "Low"];
  const optionsStatus = [
    "To Do",
    "In Progress",
    "In Review",
    "Done",
    "Blocked",
    "Waiting for Approval",
    "Cancelled",
  ];

  return (
    <div className="flex flex-col gap-4 w-2/6">
      <div className="text-[#4A4D4E] text-[15px] font-semibold">
        Project Entry Details
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[#4A4D4E] text-[13px]">Project ID</label>
        <input
          type="text"
          className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full text-[#4A4D4E] text-[13px]"
          name="project_id"
          value={projectData.project_id}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[#4A4D4E] text-[13px]">Project Name</label>
        <input
          type="text"
          className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full placeholder:text-xs text-[#4A4D4E] text-[13px]"
          name="project_name"
          value={projectData.project_name}
          placeholder="Enter the Project Name"
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative flex flex-col gap-1">
          <label className="text-[#4A4D4E] text-[13px]">Priority</label>
          <div
            className="flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[32px] px-3 cursor-pointer bg-white w-full text-[#4A4D4E] text-[13px]"
            onClick={() => setIsOpenPriority(!isOpenPriority)}
          >
            <span className="text-[#4A4D4E] text-[13px]">
              {projectData.priority || "Select an option"}
            </span>
            <IoChevronDownOutline
              className={`transition-transform text-sm font-light text-[#979797] ${isOpenPriority ? "rotate-180" : ""}`}
            />
          </div>

          {isOpenPriority && (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
              {optionsPriority.map((option, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-[#56A8F0] hover:text-white cursor-pointer transition text-[#4A4D4E] text-[13px]"
                  onClick={() => handleSelectPriority(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="text-[#4A4D4E] text-[13px]">Status</label>
          <div
            className="flex items-center justify-between rounded-md border-[#56A8F0] border-[1px] h-[32px] px-3 cursor-pointer bg-white w-full text-[#4A4D4E] text-[13px]"
            onClick={() => setIsOpenStatus(!isOpenStatus)}
          >
            <span className="text-[#4A4D4E]">
              {projectData.status || "Select an option"}
            </span>
            <IoChevronDownOutline
              className={`transition-transform text-sm font-light text-[#979797] ${isOpenStatus ? "rotate-180" : ""}`}
            />
          </div>

          {isOpenStatus && (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
              {optionsStatus.map((option, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-[#56A8F0] hover:text-white cursor-pointer transition text-[#4A4D4E] text-[13px]"
                  onClick={() => handleSelectStatus(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[13px] text-[#4A4D4E]">Start Date</label>
          <input
            type="date"
            name="start_date"
            placeholder="MM/DD/YYYY"
            value={projectData.start_date}
            onChange={handleInputChange}
            className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full text-[#4A4D4E] text-[13px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[13px] text-[#4A4D4E]">Target Closure</label>
          <input
            type="date"
            name="end_date"
             placeholder="MM/DD/YYYY"
            value={projectData.end_date}
            onChange={handleInputChange}
            className="rounded-md focus:ring-0 placeholder:text-xs focus:border-[#56A8F0] border-[#56A8F0] border-[1px] h-[32px] px-2 w-full text-[#4A4D4E] text-[13px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectEntryTabOne;
