import React, { useState } from "react";
import { BsChatQuote } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

const PromptTabMobile = ({
  isInputEmpty,
  inputPrompt,
  setInputPrompt,
  setIsInputEmpty,
  handleToggleRightFrame,
  handleToggleLeftFrame,
  onSaveInput,
  // saveQueryData,
  setAnswerTab,
}) => {
  const renderQuestionTab = () => {
    return (
      <div className="">
        {/* Text area */}
        <div className="bg-white w-[330px] h-24 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="flex items-center ">
            <textarea
              className="flex-1 focus:outline-none py-4 px-4 rounded-md resize-none border-none overflow-hidden text-[14px] placeholder:text-sm placeholder:italic italic"
              placeholder="Provide your problem statement to be solved..."
              rows={1}
              autoFocus
              value={inputPrompt}
              onChange={handleInputChange}
              onClick={handleTextareaClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendClick();
                }
              }}
            />
          </div>

          <div className="flex justify-end">
            {isInputEmpty ? (
              <div className="px-8 opacity-10">
                <IoMdSend size={23} />
              </div>
            ) : (
              <div
                className="px-8 cursor-pointer text-blue-400"
                onClick={handleSendClick}
              >
                <IoMdSend size={23} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleSendClick = async () => {
    if (!isInputEmpty) {
      onSaveInput(inputPrompt);
      setInputPrompt("");
      setIsInputEmpty(true);
      // await saveQueryData(inputPrompt);
      setAnswerTab(true);
      // Pass the input prompt value to saveQueryData
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(event.target.value);
    setIsInputEmpty(event.target.value.trim() === "");
  };

  const handleTextareaClick = () => {
    handleToggleLeftFrame();
    handleToggleRightFrame();
  };

  return <div>{renderQuestionTab()}</div>;
};

export default PromptTabMobile;
