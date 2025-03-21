import { ProjectData } from "../Types/CoinnovationTypes";


interface ProjectDescriptionTabOneProps {
    projectData: ProjectData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  }

const ProjectDescriptionTabOne: React.FC<ProjectDescriptionTabOneProps> = ({
  projectData,
  handleInputChange
}) => {
  return (
    <div className="flex flex-col w-2/6">
      <div className="text-[14px] font-semibold text-[#4A4D4E]">
        Project Description
      </div>
      <textarea
        name="project_description"
        value={projectData.project_description}
        onChange={handleInputChange}
        rows={6}
        className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] w-full px-2 resize-none  font-normal mt-2 text-[#4A4D4E] text-[13px] scrollbar-thin"
      />
    </div>
  );
};

export default ProjectDescriptionTabOne;