"use client";

import React, { useRef, useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import RenderMessagesInChat from "./HomePage/RenderMessagesInChat";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setInputPrompt,
  clearInputPrompt,
} from "../redux/features/prompt/promptSlice";
import HomeComponents from "./HomePage/HomeComponents/HomeComponents";

interface PromptProps {
  onSaveInput: (input: string) => void;
  messages: any;
  handleToggleLeftFrame: () => void;
  handleToggleRightFrame: () => void;
}

const Prompt: React.FC<PromptProps> = ({
  onSaveInput,
  messages,
  handleToggleLeftFrame,
  handleToggleRightFrame,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const inputPrompt = useAppSelector((state) => state.prompt.inputPrompt);
  const isInputEmpty = useAppSelector((state) => state.prompt.isInputEmpty);
  const [rows, setRows] = useState(1);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setInputPrompt(event.target.value));
    autoResizeTextarea(event);
  };

  const autoResizeTextarea = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textareaLineHeight = 24;
    const previousRows = event.target.rows;
    event.target.rows = 1;

    const currentRows = Math.min(
      Math.floor(event.target.scrollHeight / textareaLineHeight),
      7
    );

    setRows(currentRows);
    event.target.rows = currentRows;
  };

  const handleSendClick = async () => {
    if (!isInputEmpty) {
      onSaveInput(inputPrompt);
      dispatch(clearInputPrompt());
      setRows(1);
    }
  };

  const handleTextareaClick = () => {
    handleToggleLeftFrame();
    handleToggleRightFrame();
  };

  const handleCardSelect = (value: string) => {
    dispatch(setInputPrompt(value));
  };

  return (
    <div className="flex flex-col h-screen w-full ">
      {/* Message Section */}
      <div className="flex-1 my-5 overflow-y-scroll px-2 sm:px-4 lg:px-0">
        {messages.length === 0 ? (
          <div className="my-4">
            <HomeComponents />
          </div>
        ) : (
          <div className="mx-2 mb-8 md:mb-16">
            <RenderMessagesInChat messages={messages} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="w-4/5  sm:max-w-lg mx-auto mt-4 pb-6">
        <div className="relative bg-white border border-gray-200 rounded-3xl shadow-sm px-4 py-2">
          <textarea
            ref={textareaRef}
            className="w-full resize-none border-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 bg-transparent text-[15px] leading-6"
            placeholder="Say your Problem..."
            value={inputPrompt}
            rows={rows}
            maxLength={3000}
            onChange={handleInputChange}
            onClick={handleTextareaClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendClick();
              }
            }}
          />
          <button
            onClick={handleSendClick}
            className="absolute right-4 bottom-3 text-gray-500 hover:text-primary transition-colors"
          >
            <IoMdSend size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
