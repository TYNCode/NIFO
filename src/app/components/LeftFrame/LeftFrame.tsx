"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "../../redux/hooks";
import { fetchChatHistory } from "../../redux/features/chatHistorySlice";
import useUserInfo from "../../redux/customHooks/userHook";
import ChatHistory from "./ChatHistory";
import RecommendedQueries from "./RecommendedQueries";
import { IoHome, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiChevronsLeft } from "react-icons/fi";
import { LuLampDesk } from "react-icons/lu";
import { FaArrowTrendUp, FaFolder } from "react-icons/fa6";
import { FiLink } from "react-icons/fi";
import { BiTestTube } from "react-icons/bi";
import { GrLogout } from "react-icons/gr";

const navItems = [
  { title: "Home", icon: IoHome, href: "/", subTab: "default" },
  { title: "Startup Spotlight", icon: LuLampDesk, href: "/spotlights" },
  { title: "Trends", icon: FaArrowTrendUp, href: "/trends" },
  { title: "Connections", icon: FiLink, href: "/connections" },
  { title: "Usecases", icon: BiTestTube, href: "/usecases" },
  { title: "Projects", icon: FaFolder, href: "/coinnovation" },
];

interface LeftFrameProps {
  onNewChat?: () => void;
  setSessionId?: (id: string) => void;
  mode?: string;
}

const LeftFrame: React.FC<LeftFrameProps> = ({
  onNewChat,
  setSessionId,
  mode = "home",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const logoutRef = useRef<HTMLDivElement | null>(null);
  const userInfo = useUserInfo();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [subTab, setSubTab] = useState("default");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const initialSubTab = searchParams.get("subTab");
    if (initialSubTab) setSubTab(initialSubTab);
  }, [searchParams]);

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
      setSubTab(item.subTab || "default");
    }
    router.push(item.href);
  };

  const highlightClass = `absolute ${
    isCollapsed ? "w-12 left-2" : "w-[220px] left-5"
  } h-12 bg-[#0070C0] rounded-lg transition-all duration-500 ease-in-out`;

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-[260px]"
      } h-screen bg-white border-r border-gray-100 shadow-md flex flex-col justify-between z-10 transition-all duration-300`}
    >
      <div>
        {/* Logo + Collapse Toggle */}
        <div className="flex items-center pt-4 px-4">
          <div className="flex items-center justify-between w-full">
            <Image
              src="/nifoimage.png"
              alt="Nifo Logo"
              width={isCollapsed ? 50 : 100}
              height={isCollapsed ? 50 : 100}
              className={`cursor-pointer ${isCollapsed ? "w-8 h-8" : "w-36"}`}
              onClick={() => router.push("/")}
            />
            <button
              className="text-primary font-bold ml-auto"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <IoChevronForward size={20} />
              ) : (
                <div className="text-primary">
                  <FiChevronsLeft size={22} />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <div className="relative mt-3">
          <div
            className={highlightClass}
            style={{
              transform:
                activeIndex !== -1
                  ? `translateY(${activeIndex * 52}px)`
                  : "none",
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
                  title={isCollapsed ? item.title : ""}
                  onClick={() => handleNavigation(item)}
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center px-2" : "gap-3 pl-10 px-6"
                  } h-12 font-medium rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                    isActive
                      ? "text-white scale-105"
                      : "text-gray-700 hover:scale-[1.02] hover:text-primary"
                  }`}
                >
                  <Icon
                    className={`${isCollapsed ? "text-xl" : "text-base"} ${
                      isActive
                        ? "text-white"
                        : "text-primary"
                    } flex-shrink-0`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm whitespace-nowrap">{item.title}</span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Subtabs under Home only when expanded */}
        {pathname === "/" && mode === "home" && !isCollapsed && (
          <div className="mt-4 px-4">
            <div className="text-xs font-semibold text-gray-500 mb-2">
              Quick Access
            </div>
            <div className="flex flex-col gap-2">
              <div
                onClick={() => setSubTab("chathistory")}
                className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  subTab === "chathistory"
                    ? "bg-[#0070C0] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                Chat History
              </div>
              <div
                onClick={() => setSubTab("recommended")}
                className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  subTab === "recommended"
                    ? "bg-[#0070C0] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                Recommended Queries
              </div>
            </div>
          </div>
        )}

        {/* Subtab content (only if not collapsed) */}
        {pathname === "/" &&
          mode === "home" &&
          subTab === "recommended" &&
          !isCollapsed && <RecommendedQueries />}
        {pathname === "/" &&
          mode === "home" &&
          subTab === "chathistory" &&
          !isCollapsed && <ChatHistory />}
      </div>

      {/* Logout + Dashboard */}
      <div className="relative">
        <div
          className={`px-4 py-3 shadow-md flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } cursor-pointer border-t hover:bg-gray-50 transition-colors`}
          onClick={() => setIsLogoutOpen(!isLogoutOpen)}
          ref={logoutRef}
        >
          {!isCollapsed && (
            <div className="text-sm font-medium text-gray-700 truncate">
              {userInfo?.first_name || "User"}
            </div>
          )}
          <GrLogout 
            size={isCollapsed ? 18 : 16} 
            className="text-gray-600 flex-shrink-0" 
          />
        </div>
        
        {isLogoutOpen && (
          <div className={`absolute bottom-full ${isCollapsed ? "left-0 w-48" : "left-0 w-full"} mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-20`}>
            {userInfo?.is_primary_user && (
              <div
                className="px-4 py-3 hover:bg-yellow-50 hover:text-yellow-600 cursor-pointer text-sm border-b border-gray-100 transition-colors"
                onClick={handleDashboardRoute}
              >
                View Dashboard
              </div>
            )}
            <div
              className="px-4 py-3 hover:bg-red-50 hover:text-red-600 flex items-center justify-between cursor-pointer text-sm transition-colors"
              onClick={handleLogout}
            >
              <span>Logout</span>
              <GrLogout size={16} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default LeftFrame;