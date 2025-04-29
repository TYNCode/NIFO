import React, { useState, useRef, useEffect } from "react";
import HistoryBar from "./HistoryBar";
import RecommendedQueries from "./RecommendedQueries";
import Connects from "./Connects";
import { FiLink } from "react-icons/fi";
import { LuLampDesk } from "react-icons/lu";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchChatHistory } from "../../redux/features/chatHistorySlice";
import useUserInfo from "../../redux/customHooks/userHook";
import Spotlight from "../Spotlights/Spotlight";
import { Dispatch, SetStateAction } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import TrendsTab from "./TrendsTab";
import Image from "next/image";
import { FaFolder } from "react-icons/fa6";
import { BiTestTube } from "react-icons/bi"; // Added for Usecases tab

interface LeftFrameProps {
  onNewChat: () => void;
  setSessionId: React.Dispatch<React.SetStateAction<string>>;
  setInputPrompt: Dispatch<SetStateAction<string>>;
  setIsInputEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  currentRoute?: string; // Added to track current route
}

const LeftFrame: React.FC<LeftFrameProps> = ({
  onNewChat,
  setSessionId,
  setInputPrompt,
  setIsInputEmpty,
  currentRoute = "",
}) => {
  const userInfo = useUserInfo();
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Set activeTab based on current path if available
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/spotlights') return 'spotlight';
      if (path === '/trends') return 'trends';
      if (path === '/connections') return 'connects';
      if (path === '/coinnovation') return 'projects';
      if (path === '/usecases') return 'usecases';
    }
    return localStorage.getItem("activeTab") || "spotlight";
  });

  const dispatch = useAppDispatch();
  const { history } = useAppSelector((state) => state.chatHistory);
  const logoutRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

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
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleTabClick = (tab: string, route?: string) => {
    setActiveTab(tab);
    
    if (route) {
      router.push(route);
    }
  };

  const handleHistorySelect = (sessionId: string) => {
    setSessionId(sessionId);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtAccessToken");
    localStorage.removeItem("jwtRefreshToken");
    setIsLogoutOpen(false);
    router.push("/login");
  };

  const handleDashboardRoute = () => {
    router.push("/Dashboard");
  };

  // Navigation items including new Usecases tab
  const navigationItems = [
    {
      icon: BsFillSearchHeartFill,
      tab: "recommended",
      title: "Recommended Queries",
      route: "/"
    },
    { 
      icon: FaHistory, 
      tab: "history", 
      title: "Chat History",
      route: "/"
    },
    { 
      icon: LuLampDesk, 
      tab: "spotlight", 
      title: "Startup Spotlight",
      route: "/spotlight"
    },
    { 
      icon: FaArrowTrendUp, 
      tab: "trends", 
      title: "Trends",
      route: "/trends"
    },
    { 
      icon: FiLink, 
      tab: "connects", 
      title: "Connections",
      route: "/connections"
    },
    {
      icon: BiTestTube, 
      tab: "usecases", 
      title: "Usecases",
      route: "/usecases"
    },
    {
      icon: FaFolder, 
      tab: "projects", 
      title: "Projects",
      route: "/coinnovation"
    }
  ];

  // Function to render tab content based on currently active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "recommended":
        return (
          <RecommendedQueries
            setInputPrompt={setInputPrompt}
            setIsInputEmpty={setIsInputEmpty}
          />
        );
      case "history":
        return (
          <div className="bg-[#EEF7FF]">
            <div className="text-sm py-3 mx-2 bg-white font-semibold cursor-pointer flex justify-center rounded-t-md">
              <button
                className="bg-[#0070C0] text-xs px-3 py-2 rounded-md text-white"
                onClick={onNewChat}
              >
                New Chat
              </button>
            </div>
            <HistoryBar onSelectHistory={handleHistorySelect} />
          </div>
        );
      case "connects":
        // Only show this if we're on the main route, not in the dedicated connections page
        return !currentRoute.includes("/connections") ? <Connects /> : null;
      case "spotlight":
        // Only show this if we're on the main route, not in the dedicated spotlight page
        return !currentRoute.includes("/spotlight") ? <Spotlight /> : null;
      case "trends":
        // Only show this if we're on the main route, not in the dedicated trends page
        return !currentRoute.includes("/trends") ? <TrendsTab /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen z-50 flex flex-col bg-white relative top-0 left-0">
      <div className="flex justify-center items-center z-20 bg-[#EEF7FF]">
        <Image src="/nifo.svg" alt="The Yellow Network" width={100} height={100} />
      </div>

      <div className="flex-grow overflow-y-auto scrollbar-thin">
        <div className="flex flex-col gap-4 justify-between px-4 pt-6 pb-3 bg-[#EEF7FF]">
          {navigationItems.map(({ icon: Icon, tab, title, route }) => (
            <div
              key={tab}
              className={`cursor-pointer flex flex-row gap-4 items-center ${
                activeTab === tab ? "text-[#0070C0] font-semibold" : "text-gray-500"
              }`}
              onClick={() => handleTabClick(tab, route)}
              title={title}
            >
              <Icon size={16} />
              <div className="text-xs">
                {title}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content - Only render for local tabs, not for routed pages */}
        {(activeTab === 'recommended' || activeTab === 'history' || 
          (activeTab === 'spotlight' && !currentRoute.includes('/spotlight')) ||
          (activeTab === 'connects' && !currentRoute.includes('/connections')) ||
          (activeTab === 'trends' && !currentRoute.includes('/trends'))) && (
          <div>
            {renderTabContent()}
          </div>
        )}
      </div>

      <div
        className="px-8 py-3 shadow-md flex items-center justify-between z-20 cursor-pointer border"
        onClick={() => setIsLogoutOpen(!isLogoutOpen)}
        ref={logoutRef}
      >
        <div>{userInfo?.first_name}</div>
        {isLogoutOpen && (
          <div className="absolute bottom-0 left-0 mb-12 bg-white border w-full z-10">
            {userInfo?.is_primary_user && (
              <div
                className="flex justify-between px-8 py-3 hover:text-yellow-500"
                onClick={handleDashboardRoute}
              >
                View Dashboard
              </div>
            )}
            <div
              className="flex justify-between px-8 py-3 hover:text-yellow-500"
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