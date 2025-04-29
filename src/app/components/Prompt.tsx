import React, { useRef, useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import DefaultCard from "./DefaultCard";
import { BsChatQuote } from "react-icons/bs";

interface PromptProps {
  open: boolean;
  onSaveInput: (input: string) => void;
  defaultPrompt: string;
  renderMessages: () => JSX.Element[];
  inputPrompt: string;
  setInputPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleToggleLeftFrame: () => void;
  openRightFrame: boolean;
  handleToggleRightFrame: () => void;
  isInputEmpty: boolean;
  setIsInputEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  // saveQueryData;
}

const Prompt: React.FC<PromptProps> = ({
  open,
  onSaveInput,
  defaultPrompt,
  renderMessages,
  inputPrompt,
  setInputPrompt,
  handleToggleLeftFrame,
  handleToggleRightFrame,
  isInputEmpty,
  setIsInputEmpty,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [renderMessages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(event.target.value);
    setIsInputEmpty(event.target.value.trim() === "");
    autoResizeTextarea();
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSendClick = async () => {
    if (!isInputEmpty) {
      onSaveInput(inputPrompt);
      setInputPrompt("");
      setIsInputEmpty(true);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCardSelect = (value: string) => {
    setInputPrompt(value);
    autoResizeTextarea();
  };

  const handleTextareaClick = () => {
    handleToggleLeftFrame();
    handleToggleRightFrame();
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center relative">
      <div className="prompt-container overflow-y-auto">
        {renderMessages().length === 0 ? (
          <>
            <div className="flex justify-center items-center font-semibold text-2xl mt-12">
              What problem are you trying to solve?
            </div>
            <div className="xl:mt-28 lg:mt-16">
              <DefaultCard
                onSelectCard={handleCardSelect}
                isInputEmpty={isInputEmpty}
                setIsInputEmpty={setIsInputEmpty}
              />
            </div>
          </>
        ) : (
          <div className="mx-2 mb-8 md:mb-16">{renderMessages()}</div>
        )}
      </div>

      <div className="flex items-start w-4/6 bg-white p-4 relative">
        <textarea
          ref={textareaRef}
          className="flex-1 rounded-3xl px-10 py-4 bg-transparent text-[16px] focus:outline-none placeholder-gray-500 resize-none overflow-hidden shadow-lg"
          placeholder="Provide your problem statement to be solved..."
          value={inputPrompt}
          rows={3} 
          onChange={handleInputChange}
          onClick={handleTextareaClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendClick();
            }
          }}
        />
        {/* Send icon inside the box */}
        <div
          className="absolute right-10 bottom-10 cursor-pointer text-gray-500 hover:text-blue-500 transition-colors duration-200"
          onClick={handleSendClick}
        >
          <IoMdSend size={24} />
        </div>
      </div>
    </div>
  );
};

export default Prompt;
