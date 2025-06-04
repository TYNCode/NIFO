"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaSuitcase } from "react-icons/fa6";
import { PiCirclesFour } from "react-icons/pi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface SidebarOption {
  id: number;
  title: string;
  icon: JSX.Element;
  route: string;
}

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const sidebarOptions: SidebarOption[] = [
    { id: 1, title: "Summary", icon: <PiCirclesFour size={20} />, route: "/summary" },
    { id: 2, title: "Co-Innovation", icon: <FaSuitcase size={20} />, route: "/coinnovation" },
  ];

  const activeIndex = sidebarOptions.findIndex((item) => pathname.startsWith(item.route));

  const handleSidebarClick = (route: string) => {
    router.push(route);
  };

  return (
    <aside
      className={`${
        isExpanded ? "w-[260px]" : "w-16"
      } fixed z-50 bg-white h-screen border-r border-gray-100 shadow-md flex flex-col justify-between transition-all duration-300`}
    >
      <div>
        <div className={`flex items-center ${isExpanded ? "px-14" : "justify-center"} pt-4`}>
          <button
            className="text-gray-600"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <IoChevronBack /> : <IoChevronForward />}
          </button>
        </div>

        <div className="relative mt-3">
          <div
            className={`absolute ${isExpanded ? "w-[220px] left-5" : "w-12 left-2"} h-12 bg-[#0070C0] rounded-lg transition-transform duration-[650ms] ease-in-out`}
            style={{
              transform: activeIndex !== -1 ? `translateY(${activeIndex * 52}px)` : "none",
              opacity: activeIndex !== -1 ? 1 : 0,
            }}
          />

          <nav className="flex flex-col relative z-10 gap-1 px-2">
            {sidebarOptions.map((option, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={option.id}
                  className={`group flex items-center ${isExpanded ? "gap-3 pl-10" : "justify-center"} px-6 h-12 font-medium rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                    isActive
                      ? "text-white scale-105"
                      : "text-gray-700 hover:scale-[1.02] hover:text-[#0070C0]"
                  }`}
                  onClick={() => handleSidebarClick(option.route)}
                >
                  {option.icon}
                  {isExpanded && <span className="text-sm">{option.title}</span>}
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
