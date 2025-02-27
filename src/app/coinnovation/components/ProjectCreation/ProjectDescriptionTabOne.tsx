import { ProjectData } from "../ProjectDetails";

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
      <div className="text-lg font-semibold text-[#4A4D4E]">
        Project Description
      </div>
      <textarea
        name="project_description"
        value={projectData.project_description}
        onChange={handleInputChange}
        rows={3}
        className="rounded-md focus:ring-0 border-[#56A8F0] border-[1px] w-full px-2 resize-none 
                text-[#4A4D4E] text-sm font-normal mt-2"
      />
    </div>
  );
};

export default ProjectDescriptionTabOne;