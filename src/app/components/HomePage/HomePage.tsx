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
import { TbShare2 } from "react-icons/tb";
import { encryptURL } from "../../utils/shareUtils";

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
  const [connectionStatus, setConnectionStatus] = useState<string>("Connect");
  const [queryData, setQueryData] = useState<ChatHistoryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Spotlight");
  const [activeSpotlight, setActiveSpotlight] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    const now = new Date();
    return now.getSeconds().toString();
  });

  console.log("queryDatainHome", queryData, inputPrompt);
  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("userInfo");
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

  const toggleWidth = () => {
    setExpanded(!expanded);
  };

  const handleToggleRightFrame = () => {
    if (openRightFrame) {
      setOpenRightFrame(!openRightFrame);
    }
  };

  const handleSaveInput = async (input: string) => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");
    const userQuery = { input, session_id: sessionId }; // Adjust session_id as needed

    setMessages((prevMessages) => [
      ...prevMessages,
      { question: input, response: "Loading" },
    ]);

    try {
      const response = await axios.post(
        "https://theyellow.group/api/prompt/chat/",
        userQuery,
        {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        }
      );

      console.log(response, "response ===>");
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.question === input
            ? { question: input, response: response.data }
            : msg
        )
      );

      // Save query data if needed
      // await saveQueryData(input);
    } catch (error) {
      console.log("error in getting startups", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.question === input
            ? { question: input, response: "Error fetching response" }
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
          `https://theyellow.group/api/prompt/convo/${sessionId}/`,
          {
            headers: {
              Authorization: `Bearer ${jwtAccessToken}`,
            },
          }
        );

        console.log("responseee==?", response.data.conversations);

        if (response.status === 200) {
          setMessages(response.data.conversations); // Adjust this to match your response structure
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
    console.log("Fetching status for startupId:", startupId);
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");
    if (jwtAccessToken && startupId) {
      const url = `https://theyellow.group/api/connects/${startupId}/`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        });
        console.log("Fetching status response", response.data.status);
        setConnectionStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching connection status:", error);
      }
    } else {
      console.error("Missing JWT token or startup ID");
    }
  };

  const handleSendStartupData = (item: any, message: any) => {
    console.log("itemofhandlem", item);
    setMailMessage(message);
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
            <div>Loading..</div>
          ) : (
            <div>
              {message?.response?.response === "No specific details available."
                ? null
                : message?.response?.response}
              <RenderStartup
                message={message}
                handleSendStartupData={handleSendStartupData}
              ></RenderStartup>
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
            // saveQueryData={saveQueryData}
            messages={messages}
            connectionStatus={connectionStatus}
            setConnectionStatus={setConnectionStatus}
          />
        );
      case "Trends":
        return <TrendsMobile />;
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
            onSaveInput={handleSaveInput}
            defaultPrompt={defaultPrompt}
            renderMessages={renderMessages}
            inputPrompt={inputPrompt}
            setInputPrompt={setInputPrompt}
            open={open}
            handleToggleLeftFrame={handleToggleLeftFrame}
            openRightFrame={openRightFrame}
            handleToggleRightFrame={handleToggleRightFrame}
            isInputEmpty={isInputEmpty}
            setIsInputEmpty={setIsInputEmpty}
            // saveQueryData={saveQueryData}
          />
          <div className="absolute left-2 top-2 flex items-center">
            <NavBar
              open={open}
              handleToggleLeftFrame={handleToggleLeftFrameNavbar}
            />
            <TbShare2
              size={24}
              className="ml-4 cursor-pointer"
              onClick={handleShareClick}
              title="Share Chat Session"
            />
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
              connectionStatus={connectionStatus}
              setConnectionStatus={setConnectionStatus}
              queryData={queryData}
            />
          </div>
        )}
      </div>

      {/* Mobile Responsiveness */}
      <div className="flex flex-col md:hidden">
        <MobileHeader
          activeSpotlight={activeSpotlight}
          setActiveSpotlight={setActiveSpotlight}
        />
        {renderTabContent()}
        <BottomBar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
    </main>
  );
}
