"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaSuitcase, FaBars } from "react-icons/fa6";
import { PiCirclesFour } from "react-icons/pi";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";

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
    { id: 3, title: "Notification", icon: <MdOutlineNotificationsActive size={20} />, route: "/notification" },
    { id: 4, title: "Settings", icon: <IoSettingsOutline size={20} />, route: "/settings" },
  ];

  const handleSidebarClick = (route: string) => {
    router.push(route);
  };

  return (
    <div
      className={`fixed z-50 bg-white ${isExpanded ? "w-56 items-left" : "items-center"} h-screen flex flex-col py-4 shadow-md transition-all duration-300`}
    >
      <div
        className={`w-full flex ${isExpanded ? "w-56 items-left pl-2 pr-6" : "items-center px-5"} justify-start cursor-pointer  py-4 hover:bg-gray-100`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaBars size={20} className="text-[#0070C0]" />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {sidebarOptions.map((option) => {
          const isActive = pathname.startsWith(option.route);

          return (
            <div
              key={option.id}
              className={`flex items-center py-2 px-4 cursor-pointer rounded-lg transition-all ${
                isActive ? "bg-[#0070C0] text-white" : "bg-white text-[#0070C0] hover:bg-gray-100"
              }`}
              onClick={() => handleSidebarClick(option.route)}
            >
              {option.icon}
              {isExpanded && <span className="ml-4">{option.title}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
