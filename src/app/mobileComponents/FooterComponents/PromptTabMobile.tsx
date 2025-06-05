import React from "react";
import { IoMdSend } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setInputPrompt, clearInputPrompt } from "../../redux/features/prompt/promptSlice";

const PromptTabMobile = ({
  handleToggleRightFrame,
  handleToggleLeftFrame,
  onSaveInput,
  setAnswerTab,
}) => {
  const dispatch = useAppDispatch();
  const inputPrompt = useAppSelector((state) => state.prompt.inputPrompt);
  const isInputEmpty = useAppSelector((state) => state.prompt.isInputEmpty);
  const renderQuestionTab = () => {
    return (
      <div className="">
        {/* Text area with send button inside */}
        <div className="bg-white w-[100%] h-28 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] relative">
          <textarea
            className="w-full h-full focus:outline-none py-4 px-6 pr-10 rounded-md resize-none border-none overflow-y-auto text-[14px] placeholder:text-sm placeholder:italic leading-tight"
            placeholder="Provide your problem statement to be solved..."
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
          <div className="absolute bottom-4 right-4">
            {isInputEmpty ? (
              <div className="opacity-10">
                <IoMdSend size={23} />
              </div>
            ) : (
              <div
                className="cursor-pointer text-blue-400"
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
      dispatch(clearInputPrompt());
      setAnswerTab(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setInputPrompt(event.target.value));
  };

  const handleTextareaClick = () => {
    handleToggleLeftFrame();
    handleToggleRightFrame();
  };

  return <div>{renderQuestionTab()}</div>;
};

export default PromptTabMobile;
