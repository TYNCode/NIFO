import React, { useState } from "react";
import PromptTabMobile from "./PromptTabMobile";
import Image from "next/image";
import StartupProfile from "../StartupProfile";
// import { useRouter } from "next/navigation";


const SearchMobile = ({
  isInputEmpty,
  inputPrompt,
  setIsInputEmpty,
  setInputPrompt,
  handleToggleRightFrame,
  handleToggleLeftFrame,
  onSaveInput,
  // saveQueryData,
  messages,
  connectionStatus,
  setConnectionStatus,
}) => {
  // const router = useRouter();
  const [answerTab, setAnswerTab] = useState<boolean>(false);
  const [selectedStartup, setSelectedStartup] = useState<any>(null);

  const handleStartups = (startup: any) => {
    console.log(startup,"selectedStartup")
    setSelectedStartup(startup);
    // router.push(`/startups/${}`)
  };

  const handleBackClick = () => {
    setSelectedStartup(null);
  };

  console.log("selectedSrtartup", selectedStartup);

  const renderMainContent = () => {
    return (
      <div className="flex items-center flex-col my-40 gap-20">
        <div className="flex gap-10">
          <Image
            src="/ecllipseright.png"
            width={50}
            height={50}
            alt="Ecllipse Right"
          />
          <div className="font-semibold text-lg flex flex-col gap-2 items-center justify-center mx-auto">
            What problem are you <span className="flex justify-center items-center">trying to solve?</span>
          </div>
          <Image
            src="/ecllipseleft.png"
            width={50}
            height={50}
            alt="Ecllipse Left"
          />
        </div>
        <div className="">
          <PromptTabMobile
            isInputEmpty={isInputEmpty}
            inputPrompt={inputPrompt}
            setInputPrompt={setInputPrompt}
            setIsInputEmpty={setIsInputEmpty}
            handleToggleRightFrame={handleToggleRightFrame}
            handleToggleLeftFrame={handleToggleLeftFrame}
            onSaveInput={onSaveInput}
            // saveQueryData={saveQueryData}
            setAnswerTab={setAnswerTab}
          />
        </div>
      </div>
    );
  };

  console.log("Loadash",messages[0]?.response)

  const renderAnswerTab = () => {
    return (
      <div className="pb-64">
        <div className="mx-6 flex flex-col gap-6 mt-6">
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col gap-2 mb-4">
              <div className="border-l-2 border-orange-100 pl-4 py-2 font-medium leading-relaxed">
                {message?.question}
              </div>
              <div className="font-light leading-relaxed border-l-2 border-blue-100 pl-4 py-2 pb-2">
                {message?.response === "Loading" ? (
                  <div>Loading...</div>
                ) : (
                  message.response.response !== "No specific details available." ? (
                    <div>{message.response.response}</div>
                  ) : null
                )}
              </div>
              {message?.response?.startups?.length > 0 && (
                <div className="grid grid-flow-row gap-2 border-l-2 border-blue-100 pl-4 py-2 pb-2">
                  <div className="flex font-medium gap-6">
                    <div className="w-1/4">Startups</div>
                    <div className="w-3/4">Reason</div>
                  </div>
                  {message.response.startups.map((startup, index) => (
                    <div
                      key={index}
                      className="flex gap-6 rounded-lg p-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] cursor-pointer"
                      onClick={() => handleStartups(startup)}
                    >
                      <div className="w-1/4">
                        <Image
                          src={startup.logo || "/default_logo.png"}
                          alt={`${startup.name} Logo`}
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
            // saveQueryData={saveQueryData}
            setAnswerTab={setAnswerTab}
          />
        </div>
        </div>
      </div>
    );
  };
  

  return (
    <div>
      {selectedStartup ? (
        <StartupProfile
          selectedStartup={selectedStartup}
          onBackClick={handleBackClick}
          connectionStatus={connectionStatus}
          setConnectionStatus={setConnectionStatus}
        />
      ) : messages.length > 0 ? (
        renderAnswerTab()
      ) : (
        renderMainContent()
      )}
    </div>
  );
};

export default SearchMobile;
