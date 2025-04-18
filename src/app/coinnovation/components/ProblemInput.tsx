import React, { useRef, useState, useEffect } from "react";
import { CiPlay1 } from "react-icons/ci";
import FileUploadModal from "./FileUploadModal";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteProjectFile,
  fetchProjectFiles,
} from "../../redux/features/coinnovation/fileSlice";
import { setProblemStatement } from "../../redux/features/coinnovation/projectSlice";
import Image from "next/image";

interface Props {
  handleSubmit: (e: any) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}

const ProblemInput: React.FC<Props> = ({ handleSubmit, files, setFiles }) => {
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { projectID, problemStatement, creating } = useAppSelector(
    (state) => state.projects
  );
  const uploading = useAppSelector((state) => state.file.uploading);
  const { storedFiles } = useAppSelector((state) => state.file);

  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const isProblemEntered = problemStatement?.trim().length > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 24 * 7)}px`;
    }
  }, [problemStatement]);

  useEffect(() => {
    if (projectID) {
      dispatch(fetchProjectFiles(projectID));
    }
  }, [projectID, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setProblemStatement(e.target.value));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeStoredFile = async (fileId: number) => {
    dispatch(deleteProjectFile(fileId))
      .unwrap()
      .then(() => toast.success("File deleted successfully."))
      .catch(() => toast.error("Failed to delete file."));
  };

  const isButtonDisabled =
  !(isProblemEntered || files.length > 0) || creating || uploading;


  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col w-full max-w-[80vw]">
        <div className="flex flex-row gap-4 justify-center items-center w-full">
          <div className="w-full flex items-center relative">
            <textarea
              ref={textareaRef}
              className="w-full border border-gray-300 px-4 py-3 pr-12 resize-none rounded-xl shadow-md placeholder-gray-400 text-sm scrollbar-thin"
              value={problemStatement || ""}
              onChange={handleChange}
              placeholder="Type your problem statement"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div
              className="absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setIsFileUploadModalOpen(true)}
            >
              <Image
                src="/coinnovation/uploadfileicon.svg"
                alt="Upload"
                className="h-5 w-5"
                height={100}
                width={100}
              />
            </div>
          </div>
          <button
            className={`flex items-center gap-1 px-4 py-2 text-white rounded-xl shadow-md ${isProblemEntered || files.length > 0 ? "bg-[#2286C0]" : "bg-[#979797]"}`}
            onClick={handleSubmit}
            disabled={isButtonDisabled}
          >
            <CiPlay1 className="text-lg" />
            <span className="font-semibold text-[13px]">
              {uploading
                ? "Processing..."
                : creating
                  ? "Processing"
                  : "Describe"}
            </span>
          </button>
        </div>

        {(files.length > 0 || storedFiles.length > 0) && (
          <div className="text-gray-600 text-sm mt-2 w-full">
            <span className="font-semibold text-[12px]">Uploaded Files:</span>
            <ul className="mt-1 space-y-1 w-full">
              {storedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white px-3 py-2 rounded-md border"
                >
                  <a
                    href={file.url}
                    className="truncate text-[#0071C1] text-[12px] font-semibold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file.original_name}
                  </a>
                  <button
                    className="text-[#0071C1] text-xs"
                    onClick={() => removeStoredFile(file.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white px-3 py-2 rounded-md border"
                >
                  <span className="truncate text-[#0071C1] text-[12px] font-semibold">
                    {file.name}
                  </span>
                  <button
                    className="text-[#0071C1] text-xs"
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
