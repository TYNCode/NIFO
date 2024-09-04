"use client";

import React, { useEffect, useState } from "react";
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
import { ChatHistoryResponse, StartupType } from "../../interfaces";
import { encryptURL } from "../../utils/shareUtils";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchPartnerConnectsByOrg } from "../../redux/features/connection/connectionSlice";
import { IoShareSocialOutline } from "react-icons/io5";

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [defaultPrompt, setDefaultPrompt] = useState<string>("");
  const [open, setOpen] = useState<boolean>(true);
  const [selectedStartup, setSelectedStartup] = useState<StartupType>();
  const [inputPrompt, setInputPrompt] = useState(defaultPrompt);
  const [openRightFrame, setOpenRightFrame] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [mailMessage, setMailMessage] = useState<any>(null);
  const [queryData, setQueryData] = useState<ChatHistoryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Spotlight");
  const [sessionId, setSessionId] = useState<string>(() => {
    const now = new Date();
    return now.getSeconds().toString();
  });

  const [requestQuery, setRequestQuery] = useState<string>();
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);

  console.log("queryDatainHome", queryData, inputPrompt);

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

  const handleToggleLeftFrame = () => {
    if (open) {
      setOpen(!open);
    }
  };

  const handleBack = () => {
    if (selectedTechnology) {
      setSelectedTechnology(null); // Go back to Industries
    } else if (selectedIndustry) {
      setSelectedIndustry(null); // Go back to SubSectors
    } else if (selectedSector) {
      setSelectedSector(null); // Go back to Sectors
    } else {
      setActiveTab("Spotlight"); // Go back to Spotlight if at the root of Trends
    }
  };

  const handleSectorClick = (sectorName) => {
    setSelectedSector(sectorName);
    setSelectedIndustry(null); // Reset industry and technology
    setSelectedTechnology(null);
  };

  const handleIndustryClick = (industryName) => {
    setSelectedIndustry(industryName);
    setSelectedTechnology(null); // Reset technology
  };

  const handleTechnologyClick = (technologyName) => {
    setSelectedTechnology(technologyName);
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
        "https://nifo.theyellow.network/api/prompt/chat/",
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

    if (jwtAccessToken) {
      try {
        const response = await axios.get(
          `https://nifo.theyellow.network/api/prompt/convo/${sessionId}/`,
          {
            headers: {
              Authorization: `Bearer ${jwtAccessToken}`,
            },
          }
        );

        console.log("responseee==?", response.data.conversations);

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
    console.log("itemofhandlem", message);
    setMailMessage(message);
    setRequestQuery(message.question);
    setSelectedStartup(item?.database_info);
    setOpenRightFrame(true);
    fetchConnectStatus(item?.database_info?.startup_id);
  };

  const handleShareClick = async () => {
    const encodedSessionID = encryptURL(sessionId);

    const shareUrl: string = `${window.location.origin}/share/${encodedSessionID}`;
    console.log(shareUrl, "shareChatUrl-->");
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Chat Session",
          url: shareUrl,
        });
        console.log("Successfully shared");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API not supported");
    }
  };

  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    setSessionId(newSessionId);
    setMessages([]);
    setInputPrompt("");
  };

  const renderMessages = () => {
    return messages.map((message: any, index: number) => (
      <div key={index} className="justify-between mb-4 text-[16px] px-6">
        <div className="p-6 text-left border-l-4 border-orange-100">
          <span className="font-semibold text-[17px] text-black block mb-1">
            You:
          </span>
          <span className="text-[17px]">{message?.question}</span>
        </div>
        <div className="p-6 text-left border-l-4 border-blue-100">
          <span className="font-semibold text-black block mb-3">NIFO:</span>
          {message?.response === "Loading" ? (
            <div>Loading...</div>
          ) : (
            <div>
              {typeof message?.response?.response === "string" ? (
                message?.response?.response ===
                "No specific details available." ? null : (
                  message?.response?.response
                )
              ) : (
                <div>
                  {message?.response?.response?.response ||
                    JSON.stringify(message?.response?.response)}
                </div>
              )}
              <RenderStartup
                message={message}
                handleSendStartupData={handleSendStartupData}
              />
            </div>
          )}
        </div>
      </div>
    ));
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
      {/* Desktop Responsiveness */}
      <div className="hidden md:flex w-full flex-row">
        {open && (
          <div className="w-1/5">
            <LeftFrame onNewChat={handleNewChat} setSessionId={setSessionId} />
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
            <IoShareSocialOutline
              size={24}
              className="ml-4 cursor-pointer"
              onClick={handleShareClick}
              title="Share Chat Session"
            />
          </div>
        </div>
      </div>

      {/* Mobile Responsiveness */}
      <div className="flex flex-col md:hidden h-screen">
        {/* Mobile Header */}
        <MobileHeader
        handleBack={handleBack}
        activeTab={activeTab}
        />

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto">{renderTabContent()}</div>

        {/* Bottom Bar */}
        <BottomBar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
    </main>
  );
}
