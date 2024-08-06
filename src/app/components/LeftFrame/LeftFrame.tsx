import React, { useState, useRef, useEffect } from "react";
import HistoryBar from "./HistoryBar";
import RecommendedQueries from "./RecommendedQueries";
import ChatWindow from "./ChatWindow";
import Connects from "./Connects";
import { IoChatbubblesSharp } from "react-icons/io5";
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

interface LeftFrameProps {
  onNewChat: () => void;
  setSessionId: React.Dispatch<React.SetStateAction<string>>;
}

const LeftFrame: React.FC<LeftFrameProps> = ({ onNewChat, setSessionId }) => {
  const userInfo = useUserInfo();
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(() => {
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

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleHistorySelect = (sessionId: string) => {
    setSessionId(sessionId);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setIsLogoutOpen(false);
    router.push("/login");
  };

  const handleDashboardRoute = () => {
    router.push("/totalRequests");
  };

  const isYellowNetworkEmail = (email: string) =>
    email.endsWith("@theyellow.network") ||
    email.endsWith("mahendran99@gmail.com");

  return (
    <div className="h-screen z-50 flex flex-col bg-white relative top-0 left-0">
      <div className="flex justify-center items-center bg-white shadow-md p-4 z-20">
        <img src="/tyn-logo.png" alt="The Yellow Network" width={160} />
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-thin">
        <div className="flex flex-row justify-between mx-4 mt-6 mb-3">
          {[
            { icon: BsFillSearchHeartFill, tab: "recommended", title: "Recommended Queries" },
            { icon: FaHistory, tab: "history", title: "Chat History" },
            { icon: LuLampDesk, tab: "spotlight", title: "Startup Spotlight" },
            { icon: FiLink, tab: "connects", title: "Connects" },
            { icon: IoChatbubblesSharp, tab: "chat", title: "Chat Window" },
          ].map(({ icon: Icon, tab, title }) => (
            <div
              key={tab}
              className={`cursor-pointer ${activeTab === tab ? "text-yellow-500" : "text-gray-500"}`}
              onClick={() => handleTabClick(tab)}
              title={title}
            >
              <Icon size={23} />
            </div>
          ))}
        </div>
        <div>
          {(() => {
            switch (activeTab) {
              case "recommended":
                return <RecommendedQueries onSelectHistory={handleHistorySelect} />;
              case "history":
                return (
                  <>
                    <div className="text-sm py-3 px-2 bg-white font-semibold cursor-pointer flex justify-center">
                      <button className="bg-yellow-400 p-2 rounded-lg text-white" onClick={onNewChat}>
                        New Chat
                      </button>
                    </div>
                    <HistoryBar onSelectHistory={handleHistorySelect} />
                  </>
                );
              case "spotlight":
                return <Spotlight />;
              case "connects":
                return <Connects />;
              case "chat":
                return <ChatWindow />;
              default:
                return null;
            }
          })()}
        </div>
      </div>
      <div
        className="px-8 py-3 shadow-md flex items-center justify-between z-20 cursor-pointer border"
        onClick={() => setIsLogoutOpen(!isLogoutOpen)}
        ref={logoutRef}
      >
        <div>{userInfo?.first_name}</div>
        {isLogoutOpen && (
          <div className="absolute bottom-0 left-0 mb-12 bg-white border w-full z-10">
            {isYellowNetworkEmail(userInfo?.email) && (
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
