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
import { FaTimes } from "react-icons/fa";

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
  // Mobile-specific props
  isMobile?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const LeftFrame: React.FC<LeftFrameProps> = ({
  onNewChat,
  setSessionId,
  mode = "home",
  isMobile = false,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const logoutRef = useRef<HTMLDivElement | null>(null);
  const userInfo = useUserInfo();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [subTab, setSubTab] = useState("default");
  // Only use collapse state for desktop
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

  // Close mobile drawer on escape key
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape" && onCloseMobile) {
          onCloseMobile();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isMobile, isMobileOpen, onCloseMobile]);

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
    
    // Close mobile drawer after navigation
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  // Determine if sidebar should be collapsed (only for desktop)
  const shouldBeCollapsed = !isMobile && isCollapsed;
  
  // Determine sidebar width
  const sidebarWidth = isMobile ? "w-[280px]" : shouldBeCollapsed ? "w-16" : "w-[260px]";

  const highlightClass = `absolute ${
    shouldBeCollapsed ? "w-12 left-2" : "w-[220px] left-5"
  } h-12 bg-[#0070C0] rounded-lg transition-all duration-500 ease-in-out`;

  // Mobile overlay backdrop
  const MobileOverlay = () => (
    isMobile && isMobileOpen ? (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onCloseMobile}
      />
    ) : null
  );

  return (
    <>
      <MobileOverlay />
      <aside
        className={`
          ${sidebarWidth}
          h-screen bg-white border-r border-gray-100 shadow-lg flex flex-col justify-between z-50 transition-all duration-300
          ${isMobile 
            ? `fixed top-0 left-0 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`
            : 'relative'
          }
        `}
      >
        <div>
          {/* Header with Logo + Action Button */}
          <div className="flex items-center pt-4 px-4 border-b border-gray-100 pb-4">
            <div className="sm:flex items-center hidden justify-between w-full">
              <Image
                src="/nifoimage.png"
                alt="Nifo Logo"
                width={shouldBeCollapsed ? 50 : 100}
                height={shouldBeCollapsed ? 50 : 100}
                className={`cursor-pointer ${shouldBeCollapsed ? "w-8 h-8" : "w-36"}`}
                onClick={() => router.push("/")}
              />
              
              {/* Mobile: Close button, Desktop: Collapse toggle */}
              <button
                className="text-primary font-bold ml-auto p-1 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => {
                  if (isMobile && onCloseMobile) {
                    onCloseMobile();
                  } else {
                    setIsCollapsed(!isCollapsed);
                  }
                }}
                aria-label={isMobile ? "Close menu" : "Toggle sidebar"}
              >
                {isMobile ? (
                  <FaTimes size={20} />
                ) : shouldBeCollapsed ? (
                  <IoChevronForward size={20} />
                ) : (
                  <FiChevronsLeft size={22} />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Items */}
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
                    title={shouldBeCollapsed ? item.title : ""}
                    onClick={() => handleNavigation(item)}
                    className={`group flex items-center ${
                      shouldBeCollapsed ? "justify-center px-2" : "gap-3 pl-10 px-6"
                    } h-12 font-medium rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                      isActive
                        ? "text-white scale-105"
                        : "text-gray-700 hover:scale-[1.02] hover:text-primary"
                    }`}
                  >
                    <Icon
                      className={`${shouldBeCollapsed ? "text-xl" : "text-base"} ${
                        isActive ? "text-white" : "text-primary"
                      } flex-shrink-0`}
                    />
                    {!shouldBeCollapsed && (
                      <span className="text-sm whitespace-nowrap">{item.title}</span>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Subtabs under Home - only show when not collapsed */}
          {pathname === "/" && mode === "home" && !shouldBeCollapsed && (
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

          {/* Subtab content - only if not collapsed */}
          {pathname === "/" &&
            mode === "home" &&
            subTab === "recommended" &&
            !shouldBeCollapsed && <RecommendedQueries />}
          {pathname === "/" &&
            mode === "home" &&
            subTab === "chathistory" &&
            !shouldBeCollapsed && <ChatHistory />}
        </div>

        {/* User Menu / Logout */}
        <div className="relative border-t border-gray-100">
          <div
            className={`px-4 py-3 flex items-center ${
              shouldBeCollapsed ? "justify-center" : "justify-between"
            } cursor-pointer hover:bg-gray-50 transition-colors`}
            onClick={() => setIsLogoutOpen(!isLogoutOpen)}
            ref={logoutRef}
          >
            {!shouldBeCollapsed && (
              <div className="text-sm font-medium text-gray-700 truncate">
                {userInfo?.first_name || "User"}
              </div>
            )}
            <GrLogout 
              size={shouldBeCollapsed ? 18 : 16} 
              className="text-gray-600 flex-shrink-0" 
            />
          </div>
          
          {isLogoutOpen && (
            <div className={`absolute bottom-full ${shouldBeCollapsed ? "left-0 w-48" : "left-0 w-full"} mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-20`}>
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
    </>
  );
};

export default LeftFrame;