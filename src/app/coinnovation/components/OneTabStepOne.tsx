import React, { useState, useEffect, useRef } from "react";
import { CiPlay1 } from "react-icons/ci";

const OneTabStepOne = () => {
    const [problemStatement, setProblemStatement] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const lineHeight = 24; 
    const maxRows = 4;

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = lineHeight * maxRows;

            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    }, [problemStatement]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProblemStatement(e.target.value);
    };

    return (
        <div className="">
            <div className="bg-blue-200 shadow-md rounded-lg flex justify-center items-center px-5">
                <div className="flex items-center flex-col gap-4">
                    <div className="flex flex-col justify-center items-center gap-1">
                        <div className="text-base">Let us define the</div>
                        <div className="text-xl font-medium">Problem Statement</div>
                    </div>

                    <div className="flex flex-row justify-center items-center gap-2">
                        <div className="w-full">
                            <textarea
                                ref={textareaRef}
                                className="w-[900px] border-none focus:ring-0 px-4 py-2 resize-none overflow-auto rounded-lg 
                                           placeholder-gray-400 placeholder-opacity-75 text-base leading-[1.5] align-middle"
                                value={problemStatement}
                                onChange={handleChange}
                                placeholder="Type your problem statement"
                                style={{
                                    minHeight: `${lineHeight}px`,
                                    maxHeight: `${lineHeight * maxRows}px`,
                                }}
                            />
                        </div>

                        <div className="flex flex-row items-center gap-2 px-4 py-[7px] bg-blue-500 w-max rounded-lg text-white cursor-pointer">
                            <div className="font-medium">
                                <CiPlay1 />
                            </div>
                            <div className="font-medium">Describe</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OneTabStepOne;
