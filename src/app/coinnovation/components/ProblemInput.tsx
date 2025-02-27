import React, { useState } from 'react';
import { CiPlay1 } from 'react-icons/ci';
import { RiFileUploadLine } from 'react-icons/ri';
import FileUploadModal from './FileUploadModal';

interface ProblemInputProps {
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    problemStatement: string;
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    lineHeight: number;
    maxRows: number;
    handleSubmit: (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void;
    loading: boolean;
}



const ProblemInput: React.FC<ProblemInputProps> = ({ textareaRef, problemStatement, handleChange, lineHeight, maxRows, handleSubmit, loading }) => {
    const isProblemEntered = problemStatement.trim().length > 0; 
    const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);

    const handleFileUpload = ()=>{
       setIsFileUploadModalOpen(true);
    }

    return (
        <div className="flex flex-row justify-center items-center gap-4">
            <div className="w-full flex items-center relative">
                <textarea
                    ref={textareaRef}
                    className="w-[50vw] border-none focus:ring-[1px] focus:ring-[#2286C0] px-4 py-3 resize-none overflow-auto
               rounded-xl shadow-[0px_4px_12px_0px_rgba(34,134,192,0.1)] 
               placeholder-gray-400 placeholder-opacity-75 leading-6 text-sm "
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


                <div className='absolute transform -translate-x-1/2 -translate-y-1/2 right-0 top-1/2 text-[#0070C0] cursor-pointer ' onClick={handleFileUpload}>
                        <img
                            src="/coinnovation/uploadfileicon.svg"
                            alt="File Upload Icon"
                            className='h-[50%] w-[50%]'
                        />
                </div>
            </div>

            {
                isFileUploadModalOpen && (
                    <div>
                        <FileUploadModal
                            isFileUploadModalOpen={isFileUploadModalOpen}
                            setIsFileUploadModalOpen={setIsFileUploadModalOpen}/>
                    </div>
                )
            }

            <button
                className={`flex flex-row items-center gap-1 px-4 py-2 w-max text-white shadow-[6px_10px_20px_0px_rgba(7,7,7,0.1)] rounded-[12px] 
                    ${isProblemEntered ? "bg-[#2286C0] cursor-pointer" : "bg-[#979797] cursor-default"}`}
                onClick={handleSubmit}
                disabled={!isProblemEntered || loading} 
            >
                <div className="font-medium">
                    <CiPlay1 />
                </div>
                <div className="font-semibold tracking-wide text-[13px] ">
                    {loading ? "Processing" : "Describe"}
                </div>
            </button>
        </div>
    );
};

export default ProblemInput;
