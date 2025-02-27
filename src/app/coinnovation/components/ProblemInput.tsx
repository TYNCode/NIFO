import React, { useState } from 'react';
import { CiPlay1 } from 'react-icons/ci';
import FileUploadModal from './FileUploadModal';

interface ProblemInputProps {
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    problemStatement: string;
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    lineHeight: number;
    maxRows: number;
    handleSubmit: (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void;
    loading: boolean;
    files: File[];
    setFiles: (files: File[]) => void;
}

const ProblemInput: React.FC<ProblemInputProps> = ({ textareaRef, problemStatement, handleChange, lineHeight, maxRows, handleSubmit, loading , files , setFiles }) => {
    const isProblemEntered = problemStatement.trim().length > 0;
    const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);

    const handleFileUpload = () => {
        setIsFileUploadModalOpen(true);
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-row justify-center items-center gap-4 w-full">
        <div className='flex flex-col'>
            <div className='flex flex-row gap-4 justify-center items-center'>
                    <div className="w-full flex items-center relative">
                        <textarea
                            ref={textareaRef}
                            className="w-[50vw] border-none focus:ring-[1px] focus:ring-[#2286C0] px-4 py-3 pr-12 resize-none overflow-auto
                        rounded-xl shadow-[0px_4px_12px_0px_rgba(34,134,192,0.1)] 
                        placeholder-gray-400 placeholder-opacity-75 leading-6 text-sm scrollbar-thin"
                            value={problemStatement}
                            onChange={(e) => {
                                handleChange(e);
                                e.target.style.height = "auto";
                                e.target.style.height = `${Math.min(e.target.scrollHeight, lineHeight * maxRows)}px`;
                            }}
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
                        className={`flex flex-row items-center gap-1 px-4 py-2 w-max text-white shadow-[6px_10px_20px_0px_rgba(7,7,7,0.1)] rounded-[12px] 
                  ${(isProblemEntered || files.length > 0) ? "bg-[#2286C0] cursor-pointer" : "bg-[#979797] cursor-default"}`}
                        onClick={handleSubmit}
                        disabled={!(isProblemEntered || files.length > 0) || loading} 
                    >
                        <CiPlay1 className="text-lg" />
                        <span className="font-semibold tracking-wide text-[13px]">
                            {loading ? "Processing" : "Describe"}
                        </span>
                    </button>
            </div>
                {files.length > 0 && (
                    <div className="text-gray-600 text-sm mt-2 px-4 w-full text-left">
                        <span className="font-semibold text-[12px]">Uploaded Files:</span>
                        <ul className="mt-1 space-y-1">
                            {files.map((file, index) => (
                                <li key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded-md w-full">
                                    <span className="truncate  text-[#0071C1] text-[12px] font-semibold ">{file.name}</span>
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
