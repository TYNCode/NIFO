import React from "react";

interface ProjectDescriptionProps {
  projectDescription: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
  projectDescription,
  onInputChange
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold text-[#4A4D4E]">Project Description</div>
      <textarea
        name="project_description"
        value={projectDescription}
        onChange={onInputChange}
        rows={3}
        className="rounded-md focus:ring-0 border-[#56A8F0] border-[1px] w-full px-2 resize-none 
                 text-[#4A4D4E] text-sm font-normal mt-2"
      />
    </div>
  );
};

export default ProjectDescription;