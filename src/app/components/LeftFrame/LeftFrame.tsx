"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { FiLink } from "react-icons/fi";
import { GrLogout } from "react-icons/gr";
import { IoHome } from "react-icons/io5";
import { RiHistoryLine } from "react-icons/ri";
import { LuLampDesk } from "react-icons/lu";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { FaArrowTrendUp, FaFolder } from "react-icons/fa6";
import { BiTestTube } from "react-icons/bi";
import ChatHistory from "./ChatHistory";
import RecommendedQueries from "./RecommendedQueries";
import useUserInfo from "../../redux/customHooks/userHook";
import { useAppDispatch } from "../../redux/hooks";
import { fetchChatHistory } from "../../redux/features/chatHistorySlice";

interface LeftFrameProps {
  onNewChat?: () => void;
  setSessionId?: React.Dispatch<React.SetStateAction<string>>;
  setInputPrompt?: Dispatch<SetStateAction<string>>;
  setIsInputEmpty?: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "home" | "chat";
}

const LeftFrame: React.FC<LeftFrameProps> = ({
  onNewChat,
  setSessionId,
  setInputPrompt,
  setIsInputEmpty,
  mode = "home",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const logoutRef = useRef<HTMLDivElement>(null);
  const userInfo = useUserInfo();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // ✅ Locally manage subTab state
  const [subTab, setSubTab] = useState<"default" | "recommended" | "chathistory">("default");

  // ✅ Initialize subTab from URL ONCE on mount
  useEffect(() => {
    const initialSubTab = searchParams.get("subTab") as "recommended" | "chathistory" | null;
    if (initialSubTab) setSubTab(initialSubTab);
  }, []);

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
        setIsLogoutOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabClick = (tab: string) => {
    if (tab === "Home") {
      router.push("/", { scroll: false });
      setSubTab("default");
    } else if (tab === "Chat History") {
      router.push("/", { scroll: false });
      setSubTab("chathistory");
    } else if (tab === "Recommended Queries") {
      router.push("/", { scroll: false });
      setSubTab("recommended");
    } else if (tab === "Startup Spotlight") {
      router.push("/spotlights");
    } else if (tab === "Trends") {
      router.push("/trends");
    } else if (tab === "Connections") {
      router.push("/connections");
    } else if (tab === "Usecases") {
      router.push("/usecases");
    } else if (tab === "Projects") {
      router.push("/coinnovation");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtAccessToken");
    localStorage.removeItem("jwtRefreshToken");
    router.push("/login");
  };

  const handleDashboardRoute = () => {
    router.push("/Dashboard");
  };

  const navigationItems = [
    { icon: IoHome, title: "Home" },
    { icon: RiHistoryLine, title: "Chat History" },
    { icon: BsFillSearchHeartFill, title: "Recommended Queries" },
    { icon: LuLampDesk, title: "Startup Spotlight" },
    { icon: FaArrowTrendUp, title: "Trends" },
    { icon: FiLink, title: "Connections" },
    { icon: BiTestTube, title: "Usecases" },
    { icon: FaFolder, title: "Projects" },
  ];

  const getActivePage = () => {
    if (pathname === "/") return "Home";
    if (pathname.startsWith("/spotlights")) return "Startup Spotlight";
    if (pathname.startsWith("/trends")) return "Trends";
    if (pathname.startsWith("/connections")) return "Connections";
    if (pathname.startsWith("/usecases")) return "Usecases";
    if (pathname.startsWith("/coinnovation")) return "Projects";
    return "";
  };

  const activePage = getActivePage();

  return (
    <div className="h-screen flex flex-col bg-white w-72">
      <div className="flex justify-center items-center bg-[#EEF7FF]">
        <Image src="/nifo.svg" alt="The Yellow Network" width={100} height={100} />
      </div>

      <div className="flex-grow overflow-y-auto scrollbar-thin">
        <div className="flex flex-col gap-4 px-4 pt-6 pb-3 bg-[#EEF7FF]">
          {navigationItems.map(({ icon: Icon, title }) => {
            const isActive =
              (title === "Home" && pathname === "/" && subTab === "default") ||
              (title === "Recommended Queries" && pathname === "/" && subTab === "recommended") ||
              (title === "Chat History" && pathname === "/" && subTab === "chathistory") ||
              (title === activePage && title !== "Home");

            return (
              <div
                key={title}
                className={`cursor-pointer flex flex-row gap-4 items-center ${
                  isActive ? "text-[#0070C0] font-semibold" : "text-gray-500"
                }`}
                onClick={() => handleTabClick(title)}
                title={title}
              >
                <Icon size={16} />
                <div className={`${isActive ? "text-base" : "text-[15px]"}`}>{title}</div>
              </div>
            );
          })}
        </div>

        {/* Only render subTabs if in "home" mode */}
        {pathname === "/" && mode === "home" && subTab === "recommended" && setInputPrompt && setIsInputEmpty && (
          <RecommendedQueries setInputPrompt={setInputPrompt} setIsInputEmpty={setIsInputEmpty} />
        )}

        {pathname === "/" && mode === "home" && subTab === "chathistory" && <ChatHistory />}
      </div>

      <div
        className="px-8 py-3 shadow-md flex items-center justify-between cursor-pointer border"
        onClick={() => setIsLogoutOpen(!isLogoutOpen)}
        ref={logoutRef}
      >
        <div>{userInfo?.first_name}</div>
        {isLogoutOpen && (
          <div className="absolute bottom-0 left-0 mb-12 bg-white border w-full z-10">
            {userInfo?.is_primary_user && (
              <div className="flex justify-between px-8 py-3 hover:text-yellow-500" onClick={handleDashboardRoute}>
                View Dashboard
              </div>
            )}
            <div className="flex justify-between px-8 py-3 hover:text-yellow-500" onClick={handleLogout}>
              <div>Logout</div>
              <div><GrLogout size={23} /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftFrame;
