import React, { useState, useRef, useEffect } from "react";
import HistoryBar from "./HistoryBar";
import RecommendedQueries from "./RecommendedQueries";
import ChatWindow from "./ChatWindow";
import Connects from "./Connects";
import Spotlight from "./Spotlight";
import { IoChatbubblesSharp } from "react-icons/io5";
import { FiLink } from "react-icons/fi";
import { LuLampDesk } from "react-icons/lu";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";
import { useRouter } from "next/navigation";
import axios from "axios";
import { QueryResponse } from "../../interfaces";
interface UserInfo {
  email: string;
  first_name: string;
}

interface LeftFrameProps {
  open: boolean;
  inputPrompt: string;
  setInputPrompt: React.Dispatch<React.SetStateAction<string>>;
  userInfo: UserInfo;
  isInputEmpty: boolean;
  setIsInputEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  queryData: QueryResponse;
  setIsLogoutOpen: boolean;
  isLogoutOpen: boolean;
}

const LeftFrame: React.FC<LeftFrameProps> = ({
  open,
  inputPrompt,
  setInputPrompt,
  userInfo,
  isInputEmpty,
  setIsInputEmpty,
  queryData,
  setIsLogoutOpen,
  isLogoutOpen
}) => {
  const [historyData, setHistoryData] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Retrieve the active tab from localStorage if available
    const savedActiveTab = localStorage.getItem("activeTab");
    return savedActiveTab ? savedActiveTab : "spotlight";
  });

  const [currentMenu, setCurrentMenu] = useState<string>(activeTab); // Initialize currentMenu with activeTab
  const logoutRef = useRef<HTMLDivElement>(null);
  const navigate = useRouter();

  useEffect(() => {
    handleQueryHistory();
  }, [queryData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        logoutRef.current &&
        !logoutRef.current.contains(event.target as Node)
      ) {
        setIsLogoutOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Save the active tab to localStorage when it changes
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleQueryHistory = async () => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");

    if (jwtAccessToken) {
      try {
        const response = await axios.get(
          "https://theyellow.group/api/queryhistory/retrieve/",
          {
            headers: {
              Authorization: `Bearer ${jwtAccessToken}`,
            },
          }
        );
        const queries = response.data;
        setHistoryData(queries);
      } catch (error) {
        console.error("Error fetching query history:", error);
      }
    } else {
      console.error("JWT token not found in localStorage");
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setCurrentMenu(tab);
  };

  const handleHistorySelect = (value: string) => {
    setInputPrompt(value);
    setIsInputEmpty(false);
  };

  const showDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsLogoutOpen(!isLogoutOpen);
  };

  const handleLogout = (event: React.MouseEvent) => {
    event.stopPropagation();
    localStorage.removeItem("userInfo");
    setIsLogoutOpen(false);
    navigate.push("/login");
  };

  const handleDashboardRoute = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate.push("/totalRequests");
  };

  // Check if the email is from theyellow.network
  const isYellowNetworkEmail = (email: string) => {
    return (
      email.endsWith("@theyellow.network") ||
      email.endsWith("mahendran99@gmail.com")
    );
  };

  return (
    <div className="h-screen z-50 flex flex-col bg-white relative top-0 left-0">
      <div className="flex justify-center items-center bg-white shadow-md p-4 z-20">
        <img src="/tyn-logo.png" alt="The Yellow Network" width={160} />
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-thin">
        <div className="flex flex-row justify-between mx-4 mt-6 mb-3">
          <div
            className={`cursor-pointer ${
              activeTab === "recommended" ? "text-yellow-500" : "text-gray-500"
            }`}
            onClick={() => handleTabClick("recommended")}
            title="Recommended Queries"
          >
            <BsFillSearchHeartFill size={23} />
          </div>
          <div
            className={`cursor-pointer ${
              activeTab === "history" ? "text-yellow-500" : "text-gray-500"
            }`}
            onClick={() => handleTabClick("history")}
            title="Chat History"
          >
            <FaHistory size={23} />
          </div>
          <div
            className={`cursor-pointer ${
              activeTab === "spotlight" ? "text-yellow-500" : "text-gray-500"
            }`}
            onClick={() => handleTabClick("spotlight")}
            title="Startup Spotlight"
          >
            <LuLampDesk size={23} />
          </div>
          <div
            className={`cursor-pointer ${
              activeTab === "connects" ? "text-yellow-500" : "text-gray-500"
            }`}
            onClick={() => handleTabClick("connects")}
            title="Connects"
          >
            <FiLink size={23} />
          </div>
          <div
            className={`cursor-pointer ${
              activeTab === "chat" ? "text-yellow-500" : "text-gray-500"
            }`}
            onClick={() => handleTabClick("chat")}
            title="Chat Window"
          >
            <IoChatbubblesSharp size={23} />
          </div>
        </div>
        {activeTab === "history" && (
          <HistoryBar
            onSelectHistory={handleHistorySelect}
            historyData={historyData}
          />
        )}
        {activeTab === "recommended" && (
          <RecommendedQueries onSelectHistory={handleHistorySelect} />
        )}
        {activeTab === "chat" && <ChatWindow />}
        {activeTab === "connects" && <Connects />}
        {activeTab === "spotlight" && <Spotlight />}
      </div>
      <div
        className="px-8 py-3 shadow-md flex items-center justify-between z-20 cursor-pointer border"
        onClick={showDropdown}
        ref={logoutRef}
      >
        <div>{userInfo?.first_name}</div>
        {isLogoutOpen && (
          <div>
            {isYellowNetworkEmail(userInfo.email) && (
              <div
                className="absolute flex justify-between bottom-0 left-0 mb-24 bg-white border  px-8 py-3 z-10 w-full hover:text-yellow-500"
                onClick={handleDashboardRoute}
              >
                View Dashboard
              </div>
            )}
            <div
              className="absolute flex justify-between bottom-0 left-0 mb-12 bg-white border  px-8 py-3 z-10 w-full hover:text-yellow-500"
              onClick={handleLogout}
            >
              <div>Logout</div>
              <div>
                <GrLogout size={23} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftFrame;
