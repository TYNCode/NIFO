import React, { useState, useEffect } from "react";
import { CiPlay1 } from "react-icons/ci";
import FileUploadModal from "./FileUploadModal";

interface ProblemInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  problemStatement: string;
  setProblemStatement:any;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  lineHeight?: number;
  maxRows?: number;
  projectData:any;
  handleSubmit: (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => void;
  loading: boolean;
  files: File[];
  setFiles: (files: File[]) => void;
}

const ProblemInput: React.FC<ProblemInputProps> = ({
  textareaRef,
  problemStatement,
  setProblemStatement,
  projectData,
  handleChange,
  lineHeight ,
  maxRows,
  handleSubmit,
  loading,
  files,
  setFiles,
}) => {
  const isProblemEntered = problemStatement.trim().length > 0;
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);

  console.log("projd ",projectData)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, lineHeight * maxRows)}px`;
    }
  }, [problemStatement, textareaRef, lineHeight, maxRows]);

  useEffect(() => {
    if (projectData?.problem_statement) {
      setProblemStatement(projectData.problem_statement);
    }
  }, [projectData, setProblemStatement]);

  const handleFileUpload = () => {
    setIsFileUploadModalOpen(true);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  console.log("problem statement--->", problemStatement)

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col w-full max-w-[80vw]">
        <div className="flex flex-row gap-4 justify-center items-center w-full">
          <div className="w-full flex items-center relative">
            <textarea
              ref={textareaRef}
              className="w-full border border-gray-300 focus:ring-[0px] focus:border-[#2286C0] focus:border-[1px] focus:ring-[#2286C0] px-4 py-3 pr-12 resize-none overflow-auto
                            rounded-xl shadow-md placeholder-gray-400 leading-6 text-sm scrollbar-thin"
              value={problemStatement}
              onChange={handleChange}
              placeholder="Type your problem statement"
              style={{
                minHeight: `${lineHeight}px`,
                maxHeight: `${lineHeight * maxRows}px`,
              }}
            />
            <div
              className="absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer flex items-center"
              onClick={handleFileUpload}
            >
              <img
                src="/coinnovation/uploadfileicon.svg"
                alt="File Upload Icon"
                className="h-5 w-5"
              />
            </div>
          </div>

          <button
            className={`flex flex-row items-center gap-1 px-4 py-2 text-white shadow-md rounded-xl 
                        ${isProblemEntered || files.length > 0 ? "bg-[#2286C0] cursor-pointer" : "bg-[#979797] cursor-default"}`}
            onClick={handleSubmit}
            disabled={!(isProblemEntered || files.length > 0) || loading}
          >
            <CiPlay1 className="text-lg" />
            <span className="font-semibold text-[13px]">
              {loading ? "Processing" : "Describe"}
            </span>
          </button>
        </div>
        {files.length > 0 && (
          <div className="text-gray-600 text-sm mt-2 w-full">
            <span className="font-semibold text-[12px]">Uploaded Files:</span>
            <ul className="mt-1 space-y-1 w-full">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-white px-3 py-2 rounded-md w-full border"
                >
                  <span className="truncate text-[#0071C1] text-[12px] font-semibold">
                    {file.name}
                  </span>
                  <button
                    className="text-[#0071C1] font-light text-[12px] px-2"
                    onClick={() => removeFile(index)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isFileUploadModalOpen && (
        <FileUploadModal
          isFileUploadModalOpen={isFileUploadModalOpen}
          setIsFileUploadModalOpen={setIsFileUploadModalOpen}
          files={files}
          setFiles={setFiles}
        />
      )}
    </div>
  );
};

export default ProblemInput;