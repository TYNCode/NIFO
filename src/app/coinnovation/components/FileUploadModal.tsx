import React, { useState } from "react";

interface FileUploadModalProps {
    isFileUploadModalOpen: boolean;
    setIsFileUploadModalOpen: (isOpen: boolean) => void;
    files: File[];
    setFiles: (files: File[]) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
    isFileUploadModalOpen,
    setIsFileUploadModalOpen,
    files,
    setFiles
}) => {

    if (!isFileUploadModalOpen) return null;
    const [tempFiles, setTempFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        const allowedExtensions = ['.pdf', '.txt', '.docx'];
        const filteredFiles = selectedFiles.filter(file =>
            allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );

        if (filteredFiles.length < selectedFiles.length) {
            alert("Only PDF, TXT or DOCX files are allowed.");
        }

        setTempFiles([...tempFiles, ...filteredFiles]);
        setUploadComplete(false);
    };


    

    const handleUploadClick = () => {
        if (tempFiles.length === 0) {
            alert("Please select files first.");
            return;
        }

        setUploading(true);
        setUploadComplete(false);

        setTimeout(() => {
            setUploading(false);
            setUploadComplete(true);
            setTimeout(() => {
                setFiles([...files, ...tempFiles]);
                setTempFiles([]);
                setIsFileUploadModalOpen(false); 
            }, 1000); 
        }, 2000);
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-[50vw] flex flex-col px-8 py-6">
                <button
                    onClick={() => setIsFileUploadModalOpen(false)}
                    className="text-[#2286C0] transition duration-200 flex justify-end"
                >
                    ✕
                </button>

                <div className="relative flex items-center justify-center text-base text-[#0070C0] font-semibold">
                    File Upload
                    <div className="absolute -bottom-[2px] w-[120px] h-[2px] bg-[#0070C0]"></div>
                </div>
                <hr className={`border-[#E3F2FE] w-full mt-2 ${uploadComplete ? 'border-green-500' : ''}`} />

                <div
                    className="my-4 mx-auto border-2 border-dashed border-[#D8D8D8] rounded-lg py-6 px-4 flex flex-col w-[80%] cursor-pointer hover:bg-blue-50 transition duration-200"
                    onClick={() => document.getElementById("fileInput")?.click()}
                >
                    {tempFiles.length > 0 ? (
                        tempFiles.map((file, index) => (
                            <div key={index} className="w-full flex flex-row items-center gap-4">
                                {file.name.endsWith('.docx') && (
                                    <img src="/coinnovation/docx-icon.svg" className="flex-shrink-0" alt="File Icon" />
                                )}
                                {file.name.endsWith('.pdf') && (
                                    <img src="/coinnovation/pdf-icon.svg" className="flex-shrink-0" alt="File Icon" />
                                )}
                                {file.name.endsWith('.txt') && (
                                    <img src="/coinnovation/txt-icon.svg" className="flex-shrink-0" alt="File Icon" />
                                )}
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex flex-row justify-between items-center w-full">
                                        <div className="text-[12px] text-[#4A4D4E] truncate w-full">{file.name}</div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTempFiles(tempFiles.filter((_, i) => i !== index));
                                            }}
                                            className="text-[#4A4D4E] text-sm font-semibold cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="w-full h-[5px] rounded-full bg-gray-200">
                                        <div className={`h-full rounded-full ${uploadComplete ? 'bg-green-500' : 'bg-[#E4E5E7]'} w-full`}></div>
                                    </div>

                                    <div className="flex flex-row justify-between text-xs text-gray-600 w-full">
                                        <span>Document Selected. Click the upload button to proceed.</span>
                                        <span>{(file.size / 1024).toFixed(2)} KB</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div>
                                <img src="/coinnovation/uploadfileicon.svg" alt="File Upload Icon" />
                            </div>
                            <div className="text-[#979797] text-[13px]">Drag & Drop or Click to upload</div>
                            <div className="text-[#979797] text-[12px]">Accepted file formats: PDF, TXT, DOCX</div>
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept=".pdf,.txt,.xlsx,.docx"
                    multiple
                    onChange={handleFileChange}
                />

                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleUploadClick}
                        className={`flex flex-row items-center justify-center gap-2 px-4 py-2 w-max text-[12px] text-white shadow-[6px_10px_20px_0px_rgba(7,7,7,0.1)] rounded-[12px] 
                        ${tempFiles.length > 0 && !uploading ? "bg-[#2286C0] cursor-pointer" : "bg-[#979797] cursor-default"}`}
                        disabled={tempFiles.length === 0 || uploading}
                    >
                        <img
                            src="/coinnovation/uploadfilewhite.svg"
                            alt="File Upload Icon"
                            className="h-4 w-4 object-contain"
                        />
                        <div className="flex items-center">
                            {uploading ? "Uploading" : "Upload"}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
