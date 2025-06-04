import React, { useRef, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import DefaultCard from "./DefaultCard";
import RenderMessagesInChat from "./HomePage/RenderMessagesInChat";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setInputPrompt, clearInputPrompt } from "../redux/features/prompt/promptSlice";

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setInputPrompt(event.target.value));
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
      dispatch(clearInputPrompt());
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCardSelect = (value: string) => {
    dispatch(setInputPrompt(value));
    autoResizeTextarea();
  };

  const handleTextareaClick = () => {
    handleToggleLeftFrame();
    handleToggleRightFrame();
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center relative">
      <div className="prompt-container overflow-y-auto">
        {messages.length === 0 ? (
          <>
            <div className="flex justify-center items-center font-semibold text-2xl mt-12">
              What problem are you trying to solve?
            </div>
            <div className="xl:mt-28 lg:mt-16">
              <DefaultCard onSelectCard={handleCardSelect} />
            </div>
          </>
        ) : (
          <div className="mx-2 mb-8 md:mb-16"><RenderMessagesInChat messages={messages}/></div>
        )}
      </div>

      <div className="flex items-start w-4/6 bg-white p-4 relative">
        <textarea
          ref={textareaRef}
          className="flex-1 rounded-3xl px-10 py-4 bg-transparent text-[16px] focus:ring-0 focus:outline-none placeholder-gray-500 resize-none overflow-y-flow shadow-lg max-h-[150px]"
          placeholder="Provide your problem statement to be solved..."
          value={inputPrompt}
          rows={3}
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
