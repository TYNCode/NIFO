"use client";

import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import LeftFrame from "../LeftFrame/LeftFrame";
import Prompt from "../Prompt";
import NavBar from "../Navbar";
import CompanyProfilePane from "../CompanyProfilePane";
import BottomBar from "../../mobileComponents/BottomBar";
import MobileHeader from "../../mobileComponents/MobileHeader";
import SpotlightMobile from "../Spotlights/SpotlightMobile";
import SearchMobile from "../../mobileComponents/FooterComponents/SearchMobile";
import TrendsMobile from "../../mobileComponents/FooterComponents/TrendsMobile";
import MoreMobile from "../../mobileComponents/FooterComponents/MoreMobile";
import TrendsMobileHeader from "../../mobileComponents/TrendsMobileHeader";
import { ChatHistoryResponse, StartupType } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchPartnerConnectsByOrg } from "../../redux/features/connection/connectionSlice";
import { v4 as uuidv4 } from "uuid";
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

  const { singleSession } = useAppSelector((state) => state.sessionMessage);

  console.log("singleSessionn---->",singleSession)
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
        "http://127.0.0.1:8000/prompt/chat/",
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
            ? { question: input, response: errorMessage }
            : msg
        )
      );
    }
  };


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

  const [activeTabs, setActiveTabs] = useState<{ [key: number]: string }>({});


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
          <div className="w-[21%]">
            <LeftFrame
              onNewChat={handleNewChat}
              setSessionId={setSessionId}
              setInputPrompt={setInputPrompt}
              setIsInputEmpty={setIsInputEmpty}
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
            messages={messages}
            open={open}
            openRightFrame={openRightFrame}
          />
          <div className="absolute left-2 top-2 flex items-center">
            <NavBar
              open={open}
              handleToggleLeftFrame={handleToggleLeftFrameNavbar}
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
