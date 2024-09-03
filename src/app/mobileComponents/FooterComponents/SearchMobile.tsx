import React, { useState } from "react";
import PromptTabMobile from "./PromptTabMobile";
import Image from "next/image";
import StartupProfile from "../StartupProfile";
import { FaBars } from "react-icons/fa6";
import HistoryMobile from "../HistoryMobile";

interface SearchMobileProps {
  isInputEmpty: any;
  inputPrompt: any;
  setIsInputEmpty: (isEmpty: any) => void;
  setInputPrompt: (prompt: any) => void;
  handleToggleRightFrame: () => void;
  handleToggleLeftFrame: () => void;
  onSaveInput: any;
  messages: any[];
  setSessionId: (id: any) => void;
  handleNewChat: any
}

const SearchMobile: React.FC<SearchMobileProps> = ({
  isInputEmpty,
  inputPrompt,
  setIsInputEmpty,
  setInputPrompt,
  handleToggleRightFrame,
  handleToggleLeftFrame,
  onSaveInput,
  messages,
  setSessionId,
  handleNewChat
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [answerTab, setAnswerTab] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<any>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [queryForConnect, setQueryForConnect] = useState();


  console.log("messages in mobile", messages);
  const handleAccordian = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleStartups = (startup: any, message:any) => {
    setSelectedStartup(startup);
    setQueryForConnect(message.question);
  };

  const handleBackClick = () => {
    setSelectedStartup(null);
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleSelectSession = (sessionId: string) => {
    setSessionId(sessionId);
    setIsHistoryOpen(false);
  };

  const renderMainContent = () => (
    <div className="relative flex flex-col items-center justify-center h-[80vh]">
      <div
        className="absolute top-0 left-0 m-4 text-blue-500 cursor-pointer"
        onClick={toggleHistory}
      >
        <FaBars size={24} />
      </div>

      <div className="flex gap-10 items-center justify-center">
        <Image
          src="/ecllipseright.png"
          width={50}
          height={50}
          alt="Ecllipse Right"
        />
        <div className="font-semibold text-lg text-center">
          What problem are you trying to solve?
        </div>
        <Image
          src="/ecllipseleft.png"
          width={50}
          height={50}
          alt="Ecllipse Left"
        />
      </div>
      <div>
        <PromptTabMobile
          isInputEmpty={isInputEmpty}
          inputPrompt={inputPrompt}
          setInputPrompt={setInputPrompt}
          setIsInputEmpty={setIsInputEmpty}
          handleToggleRightFrame={handleToggleRightFrame}
          handleToggleLeftFrame={handleToggleLeftFrame}
          onSaveInput={onSaveInput}
          setAnswerTab={setAnswerTab}
        />
      </div>
    </div>
  );

  const renderAnswerTab = () => (
    <div className="pb-64">
      <div className="flex justify-between items-center">
        <div
          className="mt-4 ml-4 text-blue-500 cursor-pointer"
          onClick={toggleHistory}
        >
          <FaBars size={24} />
        </div>

        <div
          className="p-2 rounded-md bg-blue-500 text-white mt-4 mr-4 text-sm font-semibold"
          onClick={() => handleNewChat()}
        >
          New Chat
        </div>
      </div>

      <div className="mx-6 flex flex-col gap-6 mt-6">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-2 mb-4">
            <div className="border-l-2 border-orange-100 pl-4 py-2 font-medium leading-relaxed">
              {message?.question}
            </div>
            <div className="font-light leading-relaxed border-l-2 border-blue-100 pl-4 py-2 pb-2">
              {message?.response === "Loading" ? (
                <div>Loading...</div>
              ) : message.response.response !==
                "No specific details available." ? (
                <div>{message.response.response}</div>
              ) : null}
            </div>
            {message?.response?.startups?.length > 0 && (
              <div className="grid grid-flow-row gap-2 border-l-2 border-blue-100 pl-4 py-2 pb-2">
                <div className="flex font-medium gap-6">
                  <div className="w-1/4">Startups</div>
                  <div className="w-3/4">Reason</div>
                </div>
                {message?.response?.startups.map((startup, index) => (
                  <div
                    key={index}
                    className="flex gap-6 rounded-lg p-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] cursor-pointer"
                    onClick={() => handleStartups(startup, message)}
                  >
                    <div className="w-1/4">
                      <Image
                        src={startup?.database_info?.startup_logo || "/nologo.png"}
                        alt={`${startup?.name || "Startup"} Logo`}
                        width={200}
                        height={50}
                      />
                    </div>
                    <div className="w-3/4">
                      <div className="font-semibold">{startup.name}</div>
                      <div className="text-sm">{startup.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <div className="bottom-28 left-8 fixed flex items-center justify-center">
          <PromptTabMobile
            isInputEmpty={isInputEmpty}
            inputPrompt={inputPrompt}
            setInputPrompt={setInputPrompt}
            setIsInputEmpty={setIsInputEmpty}
            handleToggleRightFrame={handleToggleRightFrame}
            handleToggleLeftFrame={handleToggleLeftFrame}
            onSaveInput={onSaveInput}
            setAnswerTab={setAnswerTab}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {selectedStartup ? (
        <StartupProfile
          selectedStartup={selectedStartup}
          onBackClick={handleBackClick}
          queryForConnect={queryForConnect}
        />
      ) : messages.length > 0 ? (
        renderAnswerTab()
      ) : (
        renderMainContent()
      )}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Query History</h2>
              <button
                onClick={toggleHistory}
                className="text-gray-600 cursor-pointer"
              >
                Close
              </button>
            </div>
            <HistoryMobile onSelectSession={handleSelectSession} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMobile;
