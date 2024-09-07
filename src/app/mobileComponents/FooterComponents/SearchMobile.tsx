import { FaBars } from "react-icons/fa6";
import React, { useState } from "react";
import PromptTabMobile from "./PromptTabMobile";
import Image from "next/image";
import StartupProfile from "../StartupProfile";
import HistoryMobile from "../HistoryMobile";
import StartupList from "../../components/SearchMobile/StartupList";

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
  handleNewChat: any;
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
  handleNewChat,
}) => {
  const [selectedStartup, setSelectedStartup] = useState<any>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [queryForConnect, setQueryForConnect] = useState<string>();

  const handleStartups = (startup: any) => {
    setSelectedStartup(startup);
    setQueryForConnect(startup.name);
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleSelectSession = (sessionId: string) => {
    setSessionId(sessionId);
    setIsHistoryOpen(false);
  };

  // Check if the startups array has valid startups with a "name" field.
  const hasValidStartups = (startups: any[]) => {
    if (!Array.isArray(startups)) return false;
    return startups.some((startup) => startup?.name);
  };

  const renderDynamicSection = (response: any, key: string, title: string) => {
    if (!response[key]) return null;

    return (
      <>
        <h3 className="font-bold text-lg">{title}</h3>
        {Array.isArray(response[key]) ? (
          response[key].map((item: any, index: number) => (
            <div key={index} className="mb-2">
              {item.point && item.point !== "No point available" && (
                <div className="font-semibold">{item.point}</div>
              )}
              <div>{item.description}</div>
            </div>
          ))
        ) : (
          <div className="mb-2">{response[key]}</div>
        )}
      </>
    );
  };

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
          onClick={handleNewChat}
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
              ) : message?.response?.success === false ? (
                <div className="text-red-500">
                  Connection error: Please ensure you are connected to the
                  internet securely.
                </div>
              ) : (
                <>
                  {/* Only render "No response available" if no valid response */}
                  {message?.response?.response &&
                  message?.response?.response !== "No response available" ? (
                    <div>{message?.response?.response}</div>
                  ) : null}

                  {/* Render "use cases" properly */}
                  {renderDynamicSection(
                    message?.response,
                    "use_cases",
                    "Use Cases"
                  )}

                  {/* Render "usp" (unique selling proposition) properly */}
                  {renderDynamicSection(message?.response, "usp", "USP")}

                  {/* Render "success stories" properly */}
                  {renderDynamicSection(
                    message?.response,
                    "success_stories",
                    "Success Stories"
                  )}

                  {/* Map through startups if they don't have names (render as descriptions) */}
                  {message?.response?.startups &&
                    !hasValidStartups(message?.response?.startups) &&
                    message?.response?.startups.map(
                      (startup: any, index: number) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-semibold">Description:</h4>
                          <div>{startup.description}</div>
                        </div>
                      )
                    )}

                  {/* Handle 'startups' with valid names for direct user query */}
                  {hasValidStartups(message?.response?.startups) && (
                    <StartupList
                      startups={message.response.startups}
                      handleStartups={handleStartups}
                    />
                  )}

                  {/* Handle 'trends' category */}
                  {message?.response?.trends?.length > 0 && (
                    <div className="grid grid-flow-row gap-4 pl-4 py-2 pb-2">
                      {message.response.trends.map((trend, trendIndex) => (
                        <div key={trendIndex} className="cursor-pointer">
                          <div className="text-blue-400 underline font-bold text-lg mb-2">
                            {trend.name}
                          </div>
                          <div className="text-sm font-light mb-2 text-gray-600">
                            {trend.description}
                          </div>

                          {trend.example && (
                            <div className="text-sm font-medium italic text-gray-800">
                              <span className="text-black font-semibold">
                                Example:{" "}
                              </span>{" "}
                              {trend.example}
                            </div>
                          )}

                          {hasValidStartups(trend.startups) && (
                            <StartupList
                              startups={trend.startups}
                              handleStartups={handleStartups}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>


      <div className="fixed bottom-24 left-7 right-5 shadow-lg z-50">
        <PromptTabMobile
          isInputEmpty={isInputEmpty}
          inputPrompt={inputPrompt}
          setInputPrompt={setInputPrompt}
          setIsInputEmpty={setIsInputEmpty}
          handleToggleRightFrame={handleToggleRightFrame}
          handleToggleLeftFrame={handleToggleLeftFrame}
          onSaveInput={onSaveInput}
          setAnswerTab={() => {}}
        />
      </div>
    </div>
  );

  return (
    <div className="mt-20">
      {selectedStartup ? (
        <StartupProfile
          selectedStartup={selectedStartup}
          onBackClick={() => setSelectedStartup(null)}
          queryForConnect={queryForConnect}
        />
      ) : messages.length > 0 ? (
        renderAnswerTab()
      ) : (
        <div className="relative flex flex-col gap-10 justify-center h-[80vh]">
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
          <div className="mx-10">
            <PromptTabMobile
              isInputEmpty={isInputEmpty}
              inputPrompt={inputPrompt}
              setInputPrompt={setInputPrompt}
              setIsInputEmpty={setIsInputEmpty}
              handleToggleRightFrame={handleToggleRightFrame}
              handleToggleLeftFrame={handleToggleLeftFrame}
              onSaveInput={onSaveInput}
              setAnswerTab={() => {}}
            />
          </div>
        </div>
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
