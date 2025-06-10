import Image from "next/image";
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl 
                          flex flex-col max-h-[90vh] overflow-hidden
                          transform animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#2286C0] to-[#1a6b96] 
                                          rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">File Upload</h2>
                        </div>
                        <button
                            onClick={() => setIsFileUploadModalOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 
                                     p-2 rounded-full hover:bg-gray-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                    {/* Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center 
                                  cursor-pointer transition-all duration-300 min-h-[200px] justify-center
                                  ${tempFiles.length > 0 
                                    ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                                    : 'border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-[#2286C0]'
                                  }`}
                        onClick={() => document.getElementById("fileInput")?.click()}
                    >
                        {tempFiles.length > 0 ? (
                            <div className="w-full space-y-3 max-h-60 overflow-y-auto scrollbar-thin">
                                {tempFiles.map((file, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border">
                                        <div className="flex items-start gap-3">
                                            {/* File Icon */}
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                                                          bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                                                {file.name.endsWith('.docx') && (
                                                    <Image src="/coinnovation/docx-icon.svg" 
                                                           className="w-5 h-5" alt="DOCX" width={20} height={20} />
                                                )}
                                                {file.name.endsWith('.pdf') && (
                                                    <Image src="/coinnovation/pdf-icon.svg" 
                                                           className="w-5 h-5" alt="PDF" width={20} height={20} />
                                                )}
                                                {file.name.endsWith('.txt') && (
                                                    <Image src="/coinnovation/txt-icon.svg" 
                                                           className="w-5 h-5" alt="TXT" width={20} height={20} />
                                                )}
                                            </div>

                                            {/* File Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-medium text-gray-800 truncate pr-2" 
                                                       title={file.name}>
                                                        {file.name}
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTempFiles(tempFiles.filter((_, i) => i !== index));
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 transition-colors 
                                                                 p-1 rounded-full hover:bg-red-50 flex-shrink-0"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                                  d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                                    <div className={`h-full rounded-full transition-all duration-1000 
                                                                   ${uploadComplete ? 'bg-green-500 w-full' : 'bg-blue-300 w-full'}`}>
                                                    </div>
                                                </div>

                                                {/* File Info */}
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <span className="truncate pr-2">
                                                        {uploadComplete ? 'Ready to upload' : 'File selected'}
                                                    </span>
                                                    <span className="font-medium whitespace-nowrap">
                                                        {(file.size / 1024).toFixed(1)} KB
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="mb-4">
                                    <Image 
                                        src="/coinnovation/uploadfileicon.svg" 
                                        height={60} 
                                        width={60} 
                                        alt="Upload" 
                                        className="mx-auto sm:w-16 sm:h-16"
                                    />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                                    Drop files here or click to browse
                                </h3>
                                <p className="text-sm text-gray-500 mb-1">
                                    Drag and drop your files here
                                </p>
                                <p className="text-xs text-gray-400">
                                    Supported formats: PDF, TXT, DOCX
                                </p>
                            </div>
                        )}
                    </div>

                    {/* File Input */}
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        accept=".pdf,.txt,.xlsx,.docx"
                        multiple
                        onChange={handleFileChange}
                    />

                    {/* Upload Stats */}
                    {tempFiles.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-blue-700 font-medium">
                                    {tempFiles.length} file{tempFiles.length > 1 ? 's' : ''} selected
                                </span>
                                <span className="text-blue-600">
                                    {(tempFiles.reduce((sum, file) => sum + file.size, 0) / 1024).toFixed(1)} KB total
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <button
                            onClick={() => setIsFileUploadModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium 
                                     transition-colors duration-200 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUploadClick}
                            disabled={tempFiles.length === 0 || uploading}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 
                                      flex items-center justify-center gap-2 min-w-[120px]
                                      ${tempFiles.length > 0 && !uploading
                                        ? "bg-gradient-to-r from-[#2286C0] to-[#1a6b96] hover:from-[#1a6b96] hover:to-[#2286C0] text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                      }`}
                        >
                            {uploading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Upload Files
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;