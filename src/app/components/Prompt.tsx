import React, { useRef, useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import DefaultCard from "./DefaultCard";
import { BsChatQuote } from "react-icons/bs";
import axios from "axios";
import FeedbackForm from "./FeedbackForm";

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
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);

  const handleFeedbackIconClick = () => {
    setIsFeedbackFormOpen(true);
  };

  const closeFeedbackForm = () => {
    setIsFeedbackFormOpen(false);
  };
  useEffect(() => {
    scrollToBottom();
  }, [renderMessages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(event.target.value);
    setIsInputEmpty(event.target.value.trim() === "");
  };

  const handleSendClick = async () => {
    if (!isInputEmpty) {
      onSaveInput(inputPrompt);
      setInputPrompt("");
      setIsInputEmpty(true);
      await savedQueryData(inputPrompt); // Pass the input prompt value to saveQueryData
    }
  };

  const savedQueryData = async (query: string) => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");
    if (jwtAccessToken) {
      const response = await axios.post(
        "https://theyellow.group/api/queryhistory/save/",
        {
          userquery: query,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        }
      );
    } else {
      console.error("JWT token not found in localStorage");
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCardSelect = (value: string) => {
    setInputPrompt(value);
  };

  const handleTextareaClick = () => {
    handleToggleLeftFrame();
    handleToggleRightFrame();
  };

  return (
    <div className=" flex flex-col w-full items-center justify-center relative">
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
          <div className="w-[656px] mb-8 md:mb-16">
            {renderMessages()}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="bg-white w-4/6 rounded-lg shadow-lg ">
        <div className="flex items-center ">
          <textarea
            className="flex-1 focus:outline-none py-4 px-4 rounded-md resize-none overflow-hidden text-[14px]"
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
          {isInputEmpty ? (
            <div className="px-8 opacity-50">
              <IoMdSend size={23} />
            </div>
          ) : (
            <div className="px-8 cursor-pointer" onClick={handleSendClick}>
              <IoMdSend size={23} />
            </div>
          )}
        </div>
        <div
          className="absolute right-12 bottom-6 text-gray-500 bg-blue-200 rounded-full cursor-pointer"
          onClick={handleFeedbackIconClick}
        >
          <BsChatQuote size={32} />
        </div>
        <FeedbackForm
          isOpen={isFeedbackFormOpen}
          onRequestClose={closeFeedbackForm}
        />
      </div>
    </div>
  );
};

export default Prompt;
