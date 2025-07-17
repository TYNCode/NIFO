"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchChatHistory } from "../../redux/features/chatHistorySlice";
import { fetchUserProfile, updateUserProfile } from "../../redux/features/auth/userProfileSlice";
import { fetchCompanyById, updateCompany } from "../../redux/features/companyprofile/companyProfileSlice";
import useUserInfo from "../../redux/customHooks/userHook";
import ChatHistory from "./ChatHistory";
import RecommendedQueries from "./RecommendedQueries";
import { IoHome, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiChevronsLeft } from "react-icons/fi";
import { LuLampDesk } from "react-icons/lu";
import { FaArrowTrendUp, FaFolder, FaBuilding, FaRocket, FaUsers, FaEnvelope } from "react-icons/fa6";
import { FaUserCog } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { GrLogout } from "react-icons/gr";
import { FaTimes } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FiPower, FiUsers, FiBriefcase } from "react-icons/fi";
import { apiRequest } from "../../utils/apiWrapper/apiRequest";

// Role-based navigation items
const getNavItems = (userRole: string) => {
  if (userRole === "startup") {
    return [
      { title: "Dashboard", icon: FaFolder, href: "/startup/dashboard" },
      { title: "Challenges", icon: FaBuilding, href: "/startup/challenges" },
      { title: "Research Agent", icon: FaRocket, href: "/coinnovation" },
    ];
  } else {
    // Enterprise and TYN/Admin users see Home + other items
    const baseItems = [
      { title: "Home", icon: IoHome, href: "/", subTab: "default" },
    ];

    if (userRole === "enterprise") {
      return [
        ...baseItems,
        { title: "Startup Spotlight", icon: LuLampDesk, href: "/spotlights" },
        { title: "Trends", icon: FaArrowTrendUp, href: "/trends" },
        { title: "Connections", icon: FiLink, href: "/connections" },
        { title: "Projects", icon: FaFolder, href: "/coinnovation" },
      ];
    } else {
      // TYN/Admin users see all items
      return [
        ...baseItems,
        { title: "Startup Spotlight", icon: LuLampDesk, href: "/spotlights" },
        { title: "Trends", icon: FaArrowTrendUp, href: "/trends" },
        { title: "Connections", icon: FiLink, href: "/connections" },
        { title: "Projects", icon: FaFolder, href: "/coinnovation" },
      ];
    }
  }
};

interface LeftFrameProps {
  onNewChat?: () => void;
  setSessionId?: (id: string) => void;
  mode?: string;
  isMobile?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onSessionSelect?: (id: string) => void;
}

const LeftFrame: React.FC<LeftFrameProps> = ({
  onNewChat,
  setSessionId,
  mode = "home",
  isMobile = false,
  isMobileOpen = false,
  onCloseMobile,
  onSessionSelect,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.userProfile.data);
  const userProfileLoading = useAppSelector((state) => state.userProfile.loading);
  const userProfileError = useAppSelector((state) => state.userProfile.error);
  const logoutRef = useRef<HTMLDivElement | null>(null);
  const userInfo = useUserInfo();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [subTab, setSubTab] = useState("default");
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Add state for modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileEditData, setProfileEditData] = useState<any>(null);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'company'>('profile');
  const companyProfile = useAppSelector((state) => state.companyProfile.company);
  const companyProfileLoading = useAppSelector((state) => state.companyProfile.loading);
  const companyProfileError = useAppSelector((state) => state.companyProfile.error);
  const [companyEditData, setCompanyEditData] = useState<any>(null);
  const [isCompanyEditing, setIsCompanyEditing] = useState(false);
  const [settingsSection, setSettingsSection] = useState<'none' | 'profile' | 'company' | 'invite'>('none');

  // Fetch company info when switching to company tab (for startups)
  useEffect(() => {
    if (settingsTab === 'company' && userInfo?.role === 'startup' && userInfo?.organization) {
      dispatch(fetchCompanyById({ id: userInfo.organization, type: 'startup' }));
    }
  }, [settingsTab, userInfo, dispatch]);

  useEffect(() => {
    if (companyProfile) setCompanyEditData(companyProfile);
  }, [companyProfile]);

  const handleProfileEditClick = async () => {
    setShowProfileEdit(true);
    if (!userProfile) {
      dispatch(fetchUserProfile()).then((res: any) => {
        if (res.payload) setProfileEditData(res.payload);
      });
    } else {
      setProfileEditData(userProfile);
    }
  };

  const handleProfileEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileEditData((prev: any) => ({ ...prev, [name]: value }));
  };



  const handleProfileCancel = () => {
    setProfileEditData(userProfile);
    setShowProfileEdit(false);
  };

  const handleCompanyEditClick = () => setIsCompanyEditing(true);
  const handleCompanyEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyEditData((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleCompanySave = async () => {
    if (companyProfile && 'startup_id' in companyProfile) {
      await dispatch(updateCompany({ id: companyProfile.startup_id, payload: companyEditData, type: 'startup' }));
      setIsCompanyEditing(false);
    }
  };
  const handleCompanyCancel = () => {
    setCompanyEditData(companyProfile);
    setIsCompanyEditing(false);
  };

  // Get role-based navigation items
  const navItems = useMemo(() => getNavItems(userInfo?.role || "enterprise"), [userInfo?.role]);

  useEffect(() => {
    const initialSubTab = searchParams.get("subTab");
    if (initialSubTab) setSubTab(initialSubTab);
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
        setIsLogoutOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
    console.log("Logging out...");
    setTimeout(() => {
      localStorage.clear();
      router.push("/login");
    }, 100);
  };
  

  const handleDashboardRoute = () => {
    if (userInfo?.role === "startup") {
      router.push("/startup/dashboard");
    } else {
      router.push("/Dashboard");
    }
  };

  const activeIndex = useMemo(() => {
    return navItems.findIndex((item) => {
      if (item.href === "/" && pathname === "/") {
        return 'subTab' in item && item.subTab === subTab;
      }
      return pathname === item.href || pathname.startsWith(item.href + "/");
    });
  }, [pathname, subTab, navItems]);

  const handleNavigation = (item: (typeof navItems)[0]) => {
    if (item.href === "/" && 'subTab' in item && item.subTab) {
      setSubTab(item.subTab);
    }
    router.push(item.href);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const shouldBeCollapsed = !isMobile && isCollapsed;
  const sidebarWidth = isMobile ? "w-[280px]" : shouldBeCollapsed ? "w-16" : "w-[260px]";

  const MobileOverlay = () =>
    isMobile && isMobileOpen ? (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onCloseMobile}
      />
    ) : null;

  return (
    <>
      <MobileOverlay />
      <aside
        className={`
          ${sidebarWidth}
          h-screen bg-white border-r border-gray-100 shadow-lg flex flex-col justify-between z-[150] transition-all duration-300
          ${isMobile
            ? `fixed top-0 left-0 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`
            : 'sticky top-0'
          }
        `}
        style={{ maxHeight: '100vh' }}
      >
        <div>
          {/* Header */}
          <div className="flex items-center pt-4 px-4 border-b border-gray-100 pb-4">
            <div className="sm:flex items-center hidden justify-between w-full">
              <Image
                src="/nifo.svg"
                alt="Nifo Logo"
                width={shouldBeCollapsed ? 50 : 100}
                height={shouldBeCollapsed ? 50 : 100}
                className={`cursor-pointer ${shouldBeCollapsed ? "w-8 h-8" : "w-36"}`}
                onClick={() => {
                  if (userInfo?.role === "startup") {
                    router.push("/startup/dashboard");
                  } else {
                    router.push("/");
                  }
                }}
              />
              <button
                className="ml-auto p-1 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() =>
                  isMobile && onCloseMobile ? onCloseMobile() : setIsCollapsed(!isCollapsed)
                }
              >
                {isMobile ? <FaTimes size={20} /> : shouldBeCollapsed ? <IoChevronForward size={20} /> : <FiChevronsLeft size={22} />}
              </button>
            </div>
          </div>

          {/* Navigation and Scrollable Content */}
          <div className="relative mt-3 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
            {/* Animated Highlight */}
            <div
              className="absolute w-[220px] h-12 bg-primary left-5 rounded-lg transition-transform duration-[650ms] ease-in-out"
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
                  <button
                    key={item.title}
                    onClick={() => handleNavigation(item)}
                    className={`group flex items-center gap-3 pl-10 px-6 h-12 font-medium rounded-full transition-all duration-300 ease-in-out
                      ${isActive ? "text-white scale-105" : "text-gray-700 hover:scale-[1.02] hover:text-primary"}
                    `}
                  >
                    <Icon
                      className={`text-base transition-colors duration-300 ${isActive ? "text-white" : "text-gray-500 group-hover:text-primary"}`}
                    />
                    <span className="text-sm">{item.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Subtabs */}
          {pathname === "/" && mode === "home" && !shouldBeCollapsed && (
            <div className="mt-4 px-4">
              <div className="text-xs font-semibold text-gray-500 mb-2">Quick Access</div>
              <div className="flex flex-col gap-2">
                <div
                  onClick={() => setSubTab("chathistory")}
                  className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${subTab === "chathistory"
                      ? "bg-[#0070C0] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  Chat History
                </div>
                <div
                  onClick={() => setSubTab("recommended")}
                  className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${subTab === "recommended"
                      ? "bg-[#0070C0] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  Recommended Queries
                </div>
              </div>
            </div>
          )}

          {!shouldBeCollapsed && pathname === "/" && subTab === "recommended" && <RecommendedQueries />}
          {!shouldBeCollapsed && pathname === "/" && subTab === "chathistory" && <ChatHistory onSessionSelect={onSessionSelect} />}
        </div>

        {/* Footer - Settings Button */}
        <div className="relative border-t border-gray-100 px-4 py-3">
          <div
            className="flex items-center gap-5 cursor-pointer mx-3 px-2 py-2 text-[#0070C0] text-sm font-medium"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <IoSettingsOutline size={16} />
            <span>Settings</span>
          </div>

          {/* Settings Dropdown/Popover */}
          {isSettingsModalOpen && (
            <>
              <div
                className="absolute bottom-16 left-0 w-full bg-white rounded-xl shadow-lg z-50 border border-gray-100 py-2"
                style={{ minWidth: '220px', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}
              >
                <div className="flex flex-col gap-2 mx-4 py-2">
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded border border-[#0070C0] text-[#0070C0] font-medium hover:bg-blue-50"
                    onClick={() => { setIsSettingsModalOpen(false); router.push('/startup/profile'); }}
                  >
                    <FaUserCog size={16} /> Profile
                  </button>
                  {userInfo?.role === 'startup' && (
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded border border-[#0070C0] text-[#0070C0] font-medium hover:bg-blue-50"
                      onClick={() => { setIsSettingsModalOpen(false); router.push('/startup/company'); }}
                    >
                      <FiBriefcase size={16} /> Company Info
                    </button>
                  )}
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded border border-[#0070C0] text-[#0070C0] font-medium hover:bg-blue-50"
                    onClick={() => { setIsSettingsModalOpen(false); router.push('/startup/team'); }}
                  >
                    <FiUsers size={16} /> Invite Teammates
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded border border-[#0070C0] text-[#0070C0] font-medium hover:bg-blue-50"
                    onClick={() => { setIsSettingsModalOpen(false); router.push('/startup/settings'); }}
                  >
                    <IoSettingsOutline size={16} /> Settings
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded border border-[#0070C0] text-[#0070C0] font-medium hover:bg-blue-50"
                    onClick={() => { setIsSettingsModalOpen(false); handleLogout(); }}
                  >
                    <FiPower size={16} /> Logout
                  </button>
                </div>
              </div>
              {/* Click outside to close */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSettingsModalOpen(false)}
                style={{ pointerEvents: 'auto' }}
              />
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default LeftFrame;
