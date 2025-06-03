"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "../../redux/hooks";
import { fetchChatHistory } from "../../redux/features/chatHistorySlice";
import useUserInfo from "../../redux/customHooks/userHook";
import ChatHistory from "./ChatHistory";
import RecommendedQueries from "./RecommendedQueries";
import { IoHome } from "react-icons/io5";
import { RiHistoryLine } from "react-icons/ri";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { LuLampDesk } from "react-icons/lu";
import { FaArrowTrendUp, FaFolder } from "react-icons/fa6";
import { FiLink } from "react-icons/fi";
import { BiTestTube } from "react-icons/bi";
import { GrLogout } from "react-icons/gr";

const navItems = [
  { title: "Home", icon: IoHome, href: "/", subTab: "default" },
  { title: "Chat History", icon: RiHistoryLine, href: "/", subTab: "chathistory" },
  { title: "Recommended Queries", icon: BsFillSearchHeartFill, href: "/", subTab: "recommended" },
  { title: "Startup Spotlight", icon: LuLampDesk, href: "/spotlights" },
  { title: "Trends", icon: FaArrowTrendUp, href: "/trends" },
  { title: "Connections", icon: FiLink, href: "/connections" },
  { title: "Usecases", icon: BiTestTube, href: "/usecases" },
  { title: "Projects", icon: FaFolder, href: "/coinnovation" },
];

interface LeftFrameProps {
  onNewChat?: () => void;
  setSessionId?: (id: string) => void;
  setInputPrompt?: (prompt: string) => void;
  setIsInputEmpty?: (value: boolean) => void;
  mode?: string;
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
  const logoutRef = useRef(null);
  const userInfo = useUserInfo();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [subTab, setSubTab] = useState("default");

  useEffect(() => {
    const initialSubTab = searchParams.get("subTab");
    if (initialSubTab) setSubTab(initialSubTab);
  }, []);

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoutRef.current && !(logoutRef.current as any).contains(event.target)) {
        setIsLogoutOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleDashboardRoute = () => {
    router.push("/Dashboard");
  };

  const activeIndex = useMemo(() => {
    return navItems.findIndex((item) => {
      if (item.href === "/" && pathname === "/") {
        return item.subTab === subTab;
      }
      return pathname === item.href || pathname.startsWith(item.href + "/");
    });
  }, [pathname, subTab]);

  const handleNavigation = (item: (typeof navItems)[0]) => {
    if (item.href === "/") {
      setSubTab(item.subTab);
    }
    router.push(item.href);
  };

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-gray-100 shadow-md flex flex-col justify-between z-10">
      <div>
        <div className="px-14 pt-4">
          <Image
            src="/nifoimage.png"
            alt="Nifo Logo"
            width={100}
            height={100}
            className="w-36 cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>

        <div className="relative mt-3">
          <div
            className="absolute w-[220px] h-12 bg-[#0070C0] left-5 rounded-lg transition-transform duration-[650ms] ease-in-out"
            style={{
              transform: activeIndex !== -1 ? `translateY(${activeIndex * 52}px)` : "none",
              opacity: activeIndex !== -1 ? 1 : 0,
            }}
          />

          <nav className="flex flex-col relative z-10 gap-1 px-2">
            {navItems.map((item, index) => {
              const isActive = index === activeIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  onClick={() => handleNavigation(item)}
                  className={`group flex items-center gap-3 pl-10 px-6 h-12 font-medium rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                    isActive
                      ? "text-white scale-105"
                      : "text-gray-700 hover:scale-[1.02] hover:text-[#0070C0]"
                  }`}
                >
                  <Icon
                    className={`text-base transition-colors duration-300 ${
                      isActive ? "text-white" : "text-gray-500 group-hover:text-[#0070C0]"
                    }`}
                  />
                  <span className="text-sm">{item.title}</span>
                </div>
              );
            })}
          </nav>
        </div>

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
              <GrLogout size={23} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default LeftFrame;
