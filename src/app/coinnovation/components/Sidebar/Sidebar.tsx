import { useRouter } from "next/navigation";
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
  const [isActive, setIsActive] = useState<string>("Co-Innovation");
  const router = useRouter();

  const sidebarOptions: SidebarOption[] = [
    { id: 1, title: "Home", icon: <PiCirclesFour size={24} />, route: "/" },
    {
      id: 2,
      title: "Co-Innovation",
      icon: <FaSuitcase size={24} />,
      route: "/coinnovation",
    },
    {
      id: 3,
      title: "Notification",
      icon: <MdOutlineNotificationsActive size={24} />,
      route: "/notification",
    },
    {
      id: 4,
      title: "Settings",
      icon: < IoSettingsOutline size={24} />,
      route: "/settings",
    },
    // { id: 5, title: "Chat", icon: <FaSuitcase size={24} />, route: "/chat" },
  ];

  const handleSidebarClick = (id: number, route: string) => {
    router.push(route);
  };

  return (
    <div
      className={`bg-white ${isExpanded ? "w-56" : ""} min-h-screen flex flex-col items-center py-4 shadow-md transition-all duration-300`}
    >
      <div
        className="w-full flex items-center justify-start cursor-pointer p-4 hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaBars size={24} className="text-[#0070C0]" />
      </div>

      {sidebarOptions.map((option) => (
        <div
          key={option.id}
          className={`flex items-center w-full p-4 cursor-pointer  rounded-lg transition-all  ${isActive === option.title ? "bg-[#0070C0] text-white" : "bg-white text-[#0070C0] hover:bg-gray-100"}`}
          onClick={() => handleSidebarClick(option.id, option.route)}
        >
          {option.icon}
          {isExpanded && <span className="ml-4">{option.title}</span>}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
