import React from "react";

interface ProjectDescriptionProps {
  projectDescription: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
  projectDescription,
  onInputChange,
  readOnly = false
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-[13px] font-semibold text-[#4A4D4E]">Project Description</div>
      <textarea
        name="project_description"
        value={projectDescription}
        onChange={onInputChange}
        rows={3}
        className={`rounded-md focus:ring-0 border-[#56A8F0] border-[1px] w-full px-2 resize-none 
          text-[#4A4D4E] text-[13px] font-normal mt-2 scrollbar-thin ${readOnly ? "bg-gray-100" : ""}`}
        readOnly={readOnly}
      />
    </div>
  );
};

export default ProjectDescription;