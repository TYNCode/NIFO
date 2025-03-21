"use client";

import { useEffect, useState } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import LeftFrame from "../LeftFrame/LeftFrame";
import Prompt from "../Prompt";
import NavBar from "../Navbar";
import CompanyProfilePane from "../CompanyProfilePane";
import RenderStartup from "./RenderStartup";
import BottomBar from "../../mobileComponents/BottomBar";
import MobileHeader from "../../mobileComponents/MobileHeader";
import SpotlightMobile from "../Spotlights/SpotlightMobile";
import SearchMobile from "../../mobileComponents/FooterComponents/SearchMobile";
import TrendsMobile from "../../mobileComponents/FooterComponents/TrendsMobile";
import MoreMobile from "../../mobileComponents/FooterComponents/MoreMobile";
import TrendsMobileHeader from "../../mobileComponents/TrendsMobileHeader";
import { ChatHistoryResponse, StartupType } from "../../interfaces";
import { encryptURL } from "../../utils/shareUtils";
import { postRequestWithAccessToken, useAppDispatch } from "../../redux/hooks";
import { fetchPartnerConnectsByOrg } from "../../redux/features/connection/connectionSlice";
import { v4 as uuidv4 } from "uuid";
import BounceLoading from "./BounceLoading/BounceLoading";
import { FiPlayCircle } from "react-icons/fi";
import ComparisonTable from "./ComparisonTable";
import { useRouter, useSearchParams } from "next/navigation";

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [defaultPrompt, setDefaultPrompt] = useState<string>("");
  const [open, setOpen] = useState<boolean>(true);
  const [selectedStartup, setSelectedStartup] = useState<StartupType | null>(
    null
  );
  const [inputPrompt, setInputPrompt] = useState(defaultPrompt);
  const [openRightFrame, setOpenRightFrame] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [mailMessage, setMailMessage] = useState<any>(null);
  const [queryData, setQueryData] = useState<ChatHistoryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Spotlight");
  const [sessionId, setSessionId] = useState<string>(() => uuidv4());

  const [requestQuery, setRequestQuery] = useState<string>();
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [currentStep, setCurrentStep] = useState("trends");

  const [compareResultsLoading, setCompareResultsLoading] = useState<{
    [key: number]: boolean;
  }>({});

  const [comparisonTableResponse, setComparisonTableResponse] = useState<any>(
    []
  );

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("user");
    if (userInfoFromStorage) {
      const parsedUserInfo = JSON.parse(userInfoFromStorage);
      setUserInfo(parsedUserInfo);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("promptStorage", inputPrompt);
  }, [inputPrompt]);

  const handleToggleLeftFrameNavbar = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const currentTab = searchParams.get("tab") || "More";
    console.log("Current tab=>" + currentTab);
    setActiveTab(currentTab);
  }, [searchParams]);

  useEffect(() => {
    router.push(`/?tab=${activeTab}`);
    console.log("Active tab = > " + activeTab);
  }, [activeTab, router]);

  const handleToggleLeftFrame = () => {
    if (open) {
      setOpen(!open);
    }
  };

  const handleBack = () => {
    if (currentStep === "ecosystem") {
      setCurrentStep("usecaseDescription");
    } else if (currentStep === "usecaseDescription") {
      setCurrentStep("usecasesCombined");
    } else if (currentStep === "usecasesCombined") {
      setCurrentStep("industries");
    } else if (currentStep === "industries") {
      setCurrentStep("subSectors");
    } else if (currentStep === "subSectors") {
      setCurrentStep("sectors");
    } else {
      setCurrentStep("trends");
    }
  };

  const handleSectorClick = (sectorName) => {
    setSelectedSector(sectorName);
    setSelectedIndustry(null);
    setSelectedTechnology(null);
    setCurrentStep("subSectors");
  };

  const handleIndustryClick = (industryName) => {
    setSelectedIndustry(industryName);
    setSelectedTechnology(null);
    setCurrentStep("industries");
  };

  const handleTechnologyClick = (technologyName) => {
    setSelectedTechnology(technologyName);
    setCurrentStep("usecasesCombined");
  };

  const toggleWidth = () => {
    setExpanded(!expanded);
  };

  const handleToggleRightFrame = () => {
    if (openRightFrame) {
      setOpenRightFrame(!openRightFrame);
    }
  };

  const dispatch = useAppDispatch();

  const handleSaveInput = async (input: string) => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");
    const userQuery = { input, session_id: sessionId };
    setMessages((prevMessages) => [
      ...prevMessages,
      { question: input, response: "Loading" },
    ]);

    try {
      const response = await axios.post(
        "https://tyn-server.azurewebsites.net/prompt/chat/",
        userQuery,
        {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        }
      );

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.question === input
            ? { question: input, response: response.data }
            : msg
        )
      );
    } catch (error) {
      let errorMessage = "Error fetching response";

      if (error.code === "ECONNREFUSED") {
        errorMessage =
          "Connection error: Please ensure you are connected to the internet securely.";
      } else if (error.response && error.response.status === 500) {
        errorMessage = "Internal Server Error: Please try again later.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.question === input
            ? { question: input, presponse: errorMessage }
            : msg
        )
      );
    }
  };

  const handleGetConvo = async () => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");

    console.log("session id inside handleGetConvo", sessionId)
    if (jwtAccessToken) {
      try {
        const response = await axios.get(
          `https://tyn-server.azurewebsites.net/prompt/sessions/${sessionId}/conversations`,
          {
            headers: {
              Authorization: `Bearer ${jwtAccessToken}`,
            },
          }
        );

        if (response.status === 200) {
          setMessages(response.data.conversations);
        } else {
          console.error("Failed to fetch conversation data.");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching conversation data:",
          error
        );
      }
    } else {
      console.error("JWT token not found in localStorage.");
    }
  };

  useEffect(() => {
    handleGetConvo();
  }, [sessionId]);

  const fetchConnectStatus = async (startupId: number) => {
    dispatch(fetchPartnerConnectsByOrg(startupId));
  };

  const handleSendStartupData = (item: any, message: any) => {
    setMailMessage(message);
    setRequestQuery(message.question);
    setSelectedStartup(item?.database_info);
    setOpenRightFrame(true);
    fetchConnectStatus(item?.database_info?.startup_id);
  };

  console.log("Messages", messages);

  const handleNewChat = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
    setInputPrompt("");
  };

  const handleCompareResults = async (messageIndex: number) => {
    if (compareResultsLoading[messageIndex]) return;

    setCompareResultsLoading((prev) => ({
      ...prev,
      [messageIndex]: true,
    }));

    try {
      const response = await postRequestWithAccessToken(
        "https://tyn-server.azurewebsites.net/prompt/compareresults/",
        messages[messageIndex]
      );

      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === messageIndex
            ? { ...msg, compareResults: response?.data?.answer?.response}
            : msg
        )
      );
    } catch (error) {
      console.error("handleCompareResults error:", error);
    } finally {
      setCompareResultsLoading((prev) => ({
        ...prev,
        [messageIndex]: false, 
      }));
    }
  };

  const renderMessages = () => {
    return messages.map((message: any, index: number) => {
      let markdownText = "";

      console.log("message-----------<))))))))))))))))))", message)

      if (typeof message?.response?.response === "string") {
        markdownText = message?.response?.response.replace(/\n/g, "  \n");
      } else if (typeof message?.response?.response === "object") {
        markdownText =
          "```json\n" +
          JSON.stringify(message?.response?.response, null, 2) +
          "\n```";
      }

      return (
        <div key={index} className="justify-between mb-4 text-[16px] w-[50vw]">
          {/* User Question */}
          <div className="p-6 text-left border-l-4 border-orange-100">
            <span className="font-semibold text-[17px] text-black block mb-1">
              You:
            </span>
            <span className="text-[17px]">{message?.question}</span>
          </div>

          {/* Response from NIFO */}
          <div className="p-6 text-left border-l-4 border-blue-100">
            <span className="font-semibold text-black block mb-3">NIFO:</span>

            {message?.response === "Loading" ? (
              <div>
                <BounceLoading />
              </div>
            ) : (
              <div>
                {/* Render Markdown Correctly */}
                <ReactMarkdown className="prose max-w-none">
                  {markdownText}
                </ReactMarkdown>

                {message?.response?.follow_up_questions && (
                  <div className="mt-4">
                    <p className="font-semibold text-[16px] text-gray-700">
                      Follow-up Questions:
                    </p>
                    <ul className="list-disc list-inside text-[15px] text-gray-600">
                      {message?.response?.follow_up_questions.map(
                        (question: string, i: number) => (
                          <li key={i}>{question}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <RenderStartup
                  message={message}
                  handleSendStartupData={handleSendStartupData}
                />

                {message?.response?.startups && (
                  <div className="flex justify-end my-2">
                    <div
                      onClick={() => handleCompareResults(index)}
                      className="flex gap-2 bg-blue-400 text-white py-2 px-2 w-max items-center rounded-md justify-end text-sm cursor-pointer"
                    >
                      {compareResultsLoading[index] ? (
                        <div className="cursor-not-allowed">Loading ...</div>
                      ) : (
                        <div className="flex gap-2 justify-center items-center cursor-pointer">
                          Compare Results <FiPlayCircle />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {message?.compareResults &&
                  message?.compareResults.length > 0 && (
                    <ComparisonTable data={message.compareResults} />
                  )}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Spotlight":
        return <SpotlightMobile />;
      case "Search":
        return (
          <SearchMobile
            isInputEmpty={isInputEmpty}
            inputPrompt={inputPrompt}
            setInputPrompt={setInputPrompt}
            setIsInputEmpty={setIsInputEmpty}
            handleToggleRightFrame={handleToggleRightFrame}
            handleToggleLeftFrame={handleToggleLeftFrame}
            onSaveInput={handleSaveInput}
            handleNewChat={handleNewChat}
            messages={messages}
            setSessionId={setSessionId}
          />
        );
      case "Trends":
        return (
          <TrendsMobile
            selectedSector={selectedSector}
            selectedIndustry={selectedIndustry}
            selectedTechnology={selectedTechnology}
            handleSectorClick={handleSectorClick}
            handleIndustryClick={handleIndustryClick}
            handleTechnologyClick={handleTechnologyClick}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        );
      case "More":
        return <MoreMobile userInfo={userInfo} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex flex-col w-full">
      <div className="hidden md:flex w-full flex-row">
        {open && (
          <div className="w-1/5">
            <LeftFrame
              onNewChat={handleNewChat}
              setSessionId={setSessionId}
              setInputPrompt={setInputPrompt}
            />
          </div>
        )}
        <div className="relative flex-grow pt-12">
          <Prompt
            isInputEmpty={isInputEmpty}
            inputPrompt={inputPrompt}
            setInputPrompt={setInputPrompt}
            setIsInputEmpty={setIsInputEmpty}
            handleToggleLeftFrame={handleToggleLeftFrame}
            handleToggleRightFrame={handleToggleRightFrame}
            onSaveInput={handleSaveInput}
            defaultPrompt={defaultPrompt}
            renderMessages={renderMessages}
            open={open}
            openRightFrame={openRightFrame}
          />
          <div className="absolute left-2 top-2 flex items-center">
            <NavBar
              open={open}
              handleToggleLeftFrame={handleToggleLeftFrameNavbar}
            />
            {/* <IoShareSocialOutline
              size={24}
              className="ml-4 cursor-pointer"
              onClick={handleShareClick}
              title="Share Chat Session"
            /> */}
          </div>
        </div>

        {openRightFrame && selectedStartup && (
          <div className={`${expanded ? "" : "w-1/4"}`}>
            <CompanyProfilePane
              companyData={selectedStartup}
              setOpenState={setOpenRightFrame}
              openState={openRightFrame}
              userInfo={userInfo}
              expanded={expanded}
              toggleWidth={toggleWidth}
              mailData={mailMessage}
              setMailData={setMailMessage}
              queryData={queryData}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:hidden h-[100dvh]">
        {activeTab === "Trends" ? (
          <TrendsMobileHeader handleBack={handleBack} />
        ) : (
          <MobileHeader />
        )}
        <div className="flex-grow overflow-y-auto">{renderTabContent()}</div>
        <BottomBar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
    </main>
  );
}
