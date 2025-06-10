import { ProjectData } from "../../../interfaces/coinnovation";

interface ProjectDescriptionTabOneProps {
    projectData: ProjectData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProjectDescriptionTabOne: React.FC<ProjectDescriptionTabOneProps> = ({
    projectData,
    handleInputChange
}) => {
    return (
        <div className="flex flex-col gap-4 w-full sm:w-2/6">
            <div className="text-[14px] font-semibold text-[#4A4D4E]">
                Project Description
            </div>
            <div className="flex flex-col gap-1">
                <textarea
                    name="project_description"
                    value={projectData.project_description}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Enter project description..."
                    className="rounded-md focus:ring-0 focus:border-[#56A8F0] border-[#56A8F0] border-[1px] w-full px-2 py-2 resize-none font-normal text-[#4A4D4E] text-[13px] scrollbar-thin min-h-[120px] sm:min-h-[140px]"
                />
            </div>
        </div>
    );
};

export default ProjectDescriptionTabOne;