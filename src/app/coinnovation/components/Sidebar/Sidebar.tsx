"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaSuitcase } from "react-icons/fa6";
import { PiCirclesFour } from "react-icons/pi";
import { IoChevronForward } from "react-icons/io5";
import { FiChevronsLeft } from "react-icons/fi";

interface SidebarOption {
  id: number;
  title: string;
  icon: JSX.Element;
  route: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = false, 
  onToggle, 
  isMobile = false 
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(!isMobile);
  const router = useRouter();
  const pathname = usePathname();
  
  const sidebarOptions: SidebarOption[] = [
    {
      id: 1,
      title: "Summary",
      icon: <PiCirclesFour size={20} />,
      route: "/summary",
    },
    {
      id: 2,
      title: "Co-Innovation",
      icon: <FaSuitcase size={20} />,
      route: "/coinnovation",
    },
  ];

  // Reset to collapsed state when route changes (desktop only)
  useEffect(() => {
    if (!isMobile) {
      setIsCollapsed(true);
    }
  }, [pathname, isMobile]);

  // Handle mobile open/close state
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(!isOpen);
    }
  }, [isOpen, isMobile]);

  const activeIndex = sidebarOptions.findIndex((item) =>
    pathname.startsWith(item.route),
  );

  const handleSidebarClick = (route: string) => {
    router.push(route);
    // Close mobile sidebar after navigation
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  const handleToggleCollapse = () => {
    if (isMobile && onToggle) {
      onToggle();
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const highlightClass = `absolute ${
    isCollapsed ? "w-12 left-2" : "w-[220px] left-5"
  } h-12 bg-primary rounded-lg transition-all duration-500 ease-in-out`;

  // Mobile overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onToggle}
          />
        )}
        
        {/* Mobile Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-[260px] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Logo + Close Toggle */}
            <div className="flex items-center pt-4 px-4">
              <div className="flex items-center justify-between w-full">
                <Image
                  src="/nifo.svg"
                  alt="Nifo Logo"
                  width={100}
                  height={100}
                  className="w-36 cursor-pointer"
                  onClick={() => {
                    router.push("/");
                    if (onToggle) onToggle();
                  }}
                />
                <button
                  className="text-primary font-bold ml-auto"
                  onClick={handleToggleCollapse}
                >
                  <FiChevronsLeft size={22} />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="relative mt-3">
              <div
                className="absolute w-[220px] left-5 h-12 bg-primary rounded-lg transition-all duration-500 ease-in-out"
                style={{
                  transform:
                    activeIndex !== -1
                      ? `translateY(${activeIndex * 52}px)`
                      : "none",
                  opacity: activeIndex !== -1 ? 1 : 0,
                }}
              />

              <nav className="flex flex-col relative z-10 gap-1 px-2">
                {sidebarOptions.map((option, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <div
                      key={option.id}
                      className={`group flex items-center gap-3 pl-10 px-6 h-12 font-medium rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                        isActive
                          ? "text-white scale-105"
                          : "text-gray-700 hover:scale-[1.02] hover:text-primary"
                      }`}
                      onClick={() => handleSidebarClick(option.route)}
                    >
                      {React.cloneElement(option.icon, {
                        className: `text-base ${
                          isActive ? "text-white" : "text-primary"
                        } flex-shrink-0`,
                      })}
                      <span className="text-sm whitespace-nowrap">{option.title}</span>
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-[260px]"
      } fixed z-50 bg-white h-screen border-r border-gray-100 shadow-md flex flex-col justify-between transition-all duration-300`}
    >
      <div>
        {/* Logo + Collapse Toggle */}
        <div className="flex items-center pt-4 px-4">
          <div className="flex items-center justify-between w-full">
            <Image
              src="/nifo.svg"
              alt="Nifo Logo"
              width={isCollapsed ? 50 : 100}
              height={isCollapsed ? 50 : 100}
              className={`cursor-pointer ${isCollapsed ? "w-8 h-8" : "w-36"}`}
              onClick={() => router.push("/")}
            />
            <button
              className="text-primary font-bold ml-auto"
              onClick={handleToggleCollapse}
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
            {sidebarOptions.map((option, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={option.id}
                  title={isCollapsed ? option.title : ""}
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center px-2" : "gap-3 pl-10 px-6"
                  } h-12 font-medium rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                    isActive
                      ? "text-white scale-105"
                      : "text-gray-700 hover:scale-[1.02] hover:text-primary"
                  }`}
                  onClick={() => handleSidebarClick(option.route)}
                >
                  {React.cloneElement(option.icon, {
                    className: `${isCollapsed ? "text-xl" : "text-base"} ${
                      isActive ? "text-white" : "text-primary"
                    } flex-shrink-0`,
                  })}
                  {!isCollapsed && (
                    <span className="text-sm whitespace-nowrap">{option.title}</span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;